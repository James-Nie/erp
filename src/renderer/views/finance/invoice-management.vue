<template>
  <div class="invoiceMangement">
    <div class="mgb15">
      <el-dropdown @command="handleDashBoard" trigger="click">
        <el-button type="primary" style="width: 100px">{{storeName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item command="全部商店">全部商店</el-dropdown-item>
          <el-dropdown-item v-for="item in commands" :key="item.id" :command="item.storeName">{{item.storeName}}</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" class="mgl10" @click="_loadMainList"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
      <el-button type="primary" icon="message" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton" @click="shipments">已开票</el-button>
    </div>
    <el-table :data="OrderinvoiceList" stripe style="width: 100%" @current-change="selected" @selection-change="handleSelectionChange"highlight-current-row max-height="523">
    <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" label="序号" width="70">
      </el-table-column>
      <el-table-column prop="orderNumber" label="订单号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="store" label="店铺名称">
      </el-table-column>
      <el-table-column prop="orderStatus" label="订单状态" :formatter="$formatter.formatOrderStatus">
      </el-table-column>
      <el-table-column prop="moneySign" label="发货状态" :formatter="regionReceivable">
      </el-table-column>
      <el-table-column prop="orderType" label="订单分类">
      </el-table-column>
      <el-table-column prop="refundStatus" label="退款状态">
      </el-table-column>
      <el-table-column prop="orderDatetime" label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" width="180" align="center">
      </el-table-column>
      <el-table-column prop="addressee" label="收件人">
      </el-table-column>
      <el-table-column prop="invoiceTitle" label="发票抬头">
      </el-table-column>
      <el-table-column prop="invoiceContent" label="发票内容">
      </el-table-column>
      <el-table-column prop="invoiceSign" label="是否开发票" :formatter="regionInvoice">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix" :data="pagination">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>  
    <!-- 底部辅助表格 没有生产详情-->
    <auxiliary-table type="invoiceManagement"></auxiliary-table>
  </div>
</template>
<script>
import AuxiliaryTable from '@/components/AuxiliaryTable'
export default {
  name: 'invoice-management',
  components: {
    [AuxiliaryTable.name]: AuxiliaryTable
  },
  data() {
    return {
      // 发票列表
      OrderinvoiceList: [],
      // 商店列表
      commands: [],
      // 选中行信息
      multipleSelection: [],
      // 选中订单号数组
      orderNumberLists: [],
      // 是否允许点击发票
      submitReceivableButton: true,
      // 商店名称
      storeName: '全部商店',
      storeId: '',
      // 根据商店刷新列表
      store: '',
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 选中个数
      selectNumber: 0,
      // 根据商店刷新列表
      filter: {
        store: '',
        startNum: '',
        endNum: ''
      }
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/FinanceExcelport')
    },
    // 过滤器，过滤发货状态
    regionReceivable(row, column) {
      const mapping = {
        '1': '未发货',
        '2': '已发货'
      }
      return mapping[row.moneySign]
    },
    // 过滤器，过滤开票状态
    regionInvoice(row, column) {
      const mapping = {
        '1': '未开票',
        '2': '已开票'
      }
      return mapping[row.invoiceSign]
    },
    // 点击一行
    selected(current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    // 开票，改变开票状态，刷新
    shipments() {
      this.$confirm('请确认开票, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('financial/invoiceAudit', {
          'body': {
            'order_numbers': this.orderNumberLists
          }
        }).then(res => {
          this._loadMainList()
          this.$message({
            type: 'success',
            message: '开票成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开票'
        })
      })
    },
    // 根据商店名，获取发票列表
    _loadMainList() {
      if (this.storeName !== '全部商店') {
        this.filter.store = this.storeName
      } else {
        this.filter.store = ''
      }
      this.$tool.loadList(this, 'invoice/list', bodyInfo => {
        this.OrderinvoiceList = bodyInfo.apiResult
      }, this.filter)
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取商店列表
    _loadStore() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.commands = bodyInfo.info
      })
    },
    // 选择商店，刷新发票列表
    handleDashBoard(command) {
      this.storeName = command
      this._loadMainList()
    },
    // 选中一行，判断是否允许点击开票按钮
    handleSelectionChange(val) {
      this.multipleSelection = val
      let sign = false
      this.orderNumberLists = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.orderNumberLists[i] = this.multipleSelection[i].orderNumber
        if (this.multipleSelection[i].invoiceSign === 2 || this.multipleSelection[i].invoiceSign === '2') {
          // 不允许
          this.submitReceivableButton = true
          sign = true
        }
        if (i === this.multipleSelection.length - 1) {
          if (sign === false) {
            // 允许
            this.submitReceivableButton = false
          }
        }
      }
      this.selectNumber = this.multipleSelection.length
    }
  },
  mounted() {
    [this._loadMainList, this._loadStore].forEach(f => f())
  },
  computed: {
    // 获取权限信息
    permission() {
      return this.$store.getters.hasPermission('invoiceManageWrite')
    }
  }
}
</script>
<style>
.invoiceMangement .el-table .cell {
  text-align: center;
}

</style>