<template>
  <div class="financialAudit">
    <div class="mgb15">
      <el-dropdown @command="handleDashBoard" trigger="click">
        <el-button style="width: 100px" type="primary">{{storeName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item command="全部商店">全部商店</el-dropdown-item>
          <el-dropdown-item v-for="item in commands" :key="item.id" :command="item.storeName">{{item.storeName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" @click="queryAuditlist" class="mgl10"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
      <el-button type="danger" @click="passed(1, '允许销售')" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton1"><i class="iconfont icon-artboard38"></i>允许销售</el-button>
      <el-button type="danger" icon="warning" @click="passed(2, '驳回销售')" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton1" v-if="permission">驳回销售</el-button>
      <el-button type="danger" @click="passed(11, '允许退货')" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton2"><i class="iconfont icon-artboard38"></i>允许退货</el-button>
      <el-button type="danger" icon="warning" @click="passed(13, '驳回退货')" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton2">驳回退货</el-button>
      <el-button type="danger" @click="passed(12, '退款')" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton2" ><i class="iconfont icon-qianru1"></i>已退款</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="OrderList" stripe style="width: 100%" highlight-current-row @current-change="selected" @selection-change="handleSelectionChange" max-height="523">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="70">
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="store" label="店铺名称" align="center">
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" :formatter="$formatter.formatOrderStatus" align="center">
        </el-table-column>
        <el-table-column prop="orderType" label="订单分类" align="center">
        </el-table-column>
        <el-table-column prop="refundStatus" label="退款状态" align="center">
        </el-table-column>
        <el-table-column prop="orderDatetime" label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" align="center" width="180">
        </el-table-column>
        <el-table-column prop="addressee" label="收件人" align="center">
        </el-table-column>
        <el-table-column prop="logisticsMode" label="物流" align="center">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="数量" align="center">
        </el-table-column>
        <el-table-column prop="actualMoney" label="金额" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>  
    <!-- 底部辅助表格 没有生产详情-->
    <auxiliary-table type="financialAudit"></auxiliary-table>
  </div>
</template>
<script>
import AuxiliaryTable from '@/components/AuxiliaryTable'
export default {
  name: 'financial-audit',
  components: {
    [AuxiliaryTable.name]: AuxiliaryTable
  },
  data() {
    return {
      // 订单列表
      OrderList: [],
      // 商店列表
      commands: [],
      // 选中行
      multipleSelection: [],
      // 是否允许销售
      submitReceivableButton1: true,
      // 是否允许驳回
      submitReceivableButton2: true,
      // 订单号列表
      orderNumberLists: [],
      // 商店名称
      storeName: '全部商店',
      storeId: '',
      pagination: {
        count: 0,
        pageIndex: 1,
        pageSize: 20
      },
      // 选中个数
      selectNumber: 0,
      // 搜索依据
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
    // 点击一行
    selected(current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    // 根据商店名，查询财务信息
    queryAuditlist() {
      this.loading = true
      this.filter.order_status = '3'
      if (this.storeName !== '全部商店') {
        this.filter.store = this.storeName
      } else {
        this.filter.store = ''
      }
      this.$tool.loadList(this, 'financial/auditlist', bodyInfo => {
        this.OrderList = bodyInfo.OrderList
      }, this.filter)
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.queryAuditlist()
    },
    // 获取商店列表
    _loadStore() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.commands = bodyInfo.apiResult
      })
    },
    // 更换商店时，刷新财务列表
    handleDashBoard(command) {
      this.storeName = command
      this.queryAuditlist()
    },
    // 选中时，判断是否允许点击销售，驳回按钮
    handleSelectionChange(val) {
      let sign1 = false
      let sign2 = false
      this.multipleSelection = val
      this.orderNumberLists = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.orderNumberLists[i] = this.multipleSelection[i].orderNumber
        if (this.multipleSelection[i].orderStatus !== '3') {
          // 不允许销售
          sign1 = true
          this.submitReceivableButton1 = true
        }
        if (this.multipleSelection[i].refundStatus !== '申请退货') {
          // 不允许退货
          sign2 = true
          this.submitReceivableButton2 = true
        }
        if (i === this.multipleSelection.length - 1) {
          if (sign1 === false) {
            // 允许销售
            this.submitReceivableButton1 = false
          }
          if (sign2 === false) {
            // 允许退货
            this.submitReceivableButton2 = false
          }
        }
      }
      this.selectNumber = this.multipleSelection.length
    },
    // 驳回，销售按钮点击时，改变相应订单状态
    passed(index, value) {
      this.$confirm('请确认' + value + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('financial/audit', {
          'body': {
            'order_numbers': this.orderNumberLists,
            'order_status': index
          }
        }).then(res => {
          this.queryAuditlist()
          this.$message({
            type: 'success',
            message: value + '!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + value
        })
      })
    }
  },
  mounted() {
    this.queryAuditlist()
    this._loadStore()
  },
  computed: {
    // 获取权限信息
    permission() {
      return this.$store.getters.hasPermission('financialAuditWrite')
    }
  }
}

</script>
