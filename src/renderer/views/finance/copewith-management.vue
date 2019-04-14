<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" @click='submitReceivable' :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton"><i class="iconfont icon-tongguo"></i>付款</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="PurchaseList" v-loading="loading" stripe style="width: 100%" highlight-current-row @row-click="selectInfo" @selection-change="handleSelectionChange" max-height="523">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column prop="purchaseUuid" label="采购单号" align="center" width="270">
        </el-table-column>
        <el-table-column prop="supplier" label="供应商" align="center">
        </el-table-column>
        <el-table-column  label="当前状态" align="center" :formatter="$formatter.formatPurchaseOrder">
        </el-table-column>
        <el-table-column prop="moneySign" label="付款状态" align="center" :formatter="regionReceivable">
        </el-table-column>
        <el-table-column prop="buyer" label="采购员" align="center">
        </el-table-column>
        <el-table-column prop="transportationMode" label="货运方式" align="center">
        </el-table-column>
        <el-table-column prop="otherAmount" label="其他费用" align="center">
        </el-table-column>
        <el-table-column prop="totalAmount" label="总货款" align="center">
        </el-table-column>
        <el-table-column prop="afterTaxAmount" label="税后总金额" align="center">
        </el-table-column>
        <el-table-column prop="typeNumber" label="货品类别" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-tabs type="border-card" class="auxiliary-table">
      <el-tab-pane label="日志">
        <el-table :data="logsData" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="200">
          </el-table-column>
          <el-table-column prop="operator" label="操作员">
          </el-table-column>
          <el-table-column prop="content" label="内容">
          </el-table-column>
          <el-table-column prop="time" label="时间">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="入库明细">
        <el-table :data="StockDetailList" stripe style="width: 100%" max-height="163">
          <el-table-column prop="sourceNumber" label="入库单号">
          </el-table-column>
          <el-table-column prop="type" label="类别" :formatter="StockType">
          </el-table-column>
          <el-table-column prop="warehouseName" label="仓库">
          </el-table-column>
          <el-table-column  label="制单时间"  :formatter="$formatter.formatTime('createDatetime')" >
          </el-table-column>
          <el-table-column  label="修改时间"  :formatter="$formatter.formatTime('modificationTime')" >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="便签">
        <el-button class="mgb15" type="primary" @click="showStickyNotesVisible" :disabled="addNode === true"><i class="iconfont  "></i>添加</el-button>
        <el-table :data="noteList" stripe style="width: 100%" max-height="120">
          <el-table-column type="index" label="序号" width="200">
          </el-table-column>
          <el-table-column prop="operator" label="操作员">
          </el-table-column>
          <el-table-column prop="content" label="内容">
          </el-table-column>
          <el-table-column label="时间" :formatter="$formatter.formatTime('createDatetime')">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="货品列表">
        <el-table :data="orderGoods" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="brand" label="品牌">
          </el-table-column>
          <el-table-column prop="model" label="规格">
          </el-table-column>
          <el-table-column prop="width" label="宽度">
          </el-table-column>
          <el-table-column prop="length" label="长度">
          </el-table-column>
          <el-table-column prop="category" label="分类">
          </el-table-column>
          <el-table-column prop="number" label="数量">
          </el-table-column>
          <el-table-column prop="purchaseWeight" label="总重">
          </el-table-column>
          <el-table-column prop="purchaseAmount" label="总量">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="订单便签" size="tiny" :visible.sync="stickyNotesVisible">
      <sticky-notes></sticky-notes>
    </el-dialog>
    <el-dialog title="编辑快捷键" :visible.sync="shortcutEditingVisivble" @close="handleClose('setShortcutEditingVisivble')">
      <edit-shortcuts></edit-shortcuts>
    </el-dialog>
  </div>
</template>
<script>
import EditShortcuts from '@/views/crm/customer-files/edit-shortcuts'
import StickyNotes from '@/views/crm/customer-files/sticky-notes'
export default {
  name: 'copewith-management',
  components: {
    [EditShortcuts.name]: EditShortcuts,
    [StickyNotes.name]: StickyNotes
  },
  data() {
    return {
      // 便签添加页
      stickyNotesVisible: false,
      // 编辑快捷键页
      shortcutEditingVisivble: false,
      // 选择项是否为待审核状态
      submitReceivableButton: true,
      // 应付管理列表
      PurchaseList: [],
      // 便签列表
      noteList: [],
      // 是否允许添加便签
      addNode: true,
      // 货品列表
      orderGoods: [],
      // 选中行
      multipleSelection: [],
      // 选择项id数组
      purchases: [],
      // 日志
      logsData: [],
      // 入库详情
      StockDetailList: [],
      loading: false,
      // 分页
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/PurchasePayExcelport')
    },
    // 过滤器，过滤付款状态
    regionReceivable(row, column) {
      const mapping = {
        '1': '未付款',
        '2': '已付款'
      }
      return mapping[row.moneySign]
    },
    // 过滤器，过滤信息
    StockType(row, column) {
      const mapping = {
        '1': '出库',
        '2': '入库',
        '3': '仓间调拨'
      }
      return mapping[row.type]
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 关闭form页面
    handleClose(Form) {
      Form = false
    },
    _loadMainList() {
      this.$tool.loadList(this, 'financial/payableList', bodyInfo => {
        this.PurchaseList = bodyInfo.PurchaseList
      })
    },
    // 点击一行
    selectInfo(row, event) {
      // 日志
      this.getLogList(row.purchaseUuid)
      // 便签
      this.getNode(row.purchaseUuid)
      // 货品列表
      this.getOrderGoods(row.purchaseUuid)
      // 入库明细
      this.getWarehousingDetail(row)
      window.localStorage.setItem('order_number', row.purchaseUuid)
      // 允许添加便签
      this.addNode = false
    },
    // 添加便签
    showStickyNotesVisible() {
      this.stickyNotesVisible = true
      window.sessionStorage.setItem('createNodeParent', 'DealWithManagement')
    },
    // 入库详情
    getWarehousingDetail(row) {
      this.$http.post('stock/detailSourceNumber', {
        'body': {
          'source_number': row.purchaseUuid
        }
      }).then(res => {
        this.StockDetailList = res.data.body.StockDetailList
      }).catch(res => {
        console.log(res)
      })
    },
    // 货品列表
    getOrderGoods(row) {
      this.$http.post('purchase/find', {
        'body': {
          'purchase_uuid': row
        }
      }).then(res => {
        this.orderGoods = res.data.body.PurchaseGoodslist
      }).catch(res => {
        console.log(res)
      })
    },
    // 日志
    getLogList(row) {
      this.$http.post('order/loglist', {
        'body': {
          'user_name': this.$store.getters.getAccount.name,
          'pageIndex': 1,
          'pageSize': 1000,
          'order_number': row
        }
      }).then(res => {
        this.logsData = []
        this.logsData = res.data.body.LogOrderList
      }).catch(res => {
        console.log(res)
      })
    },
    // 便签
    getNode(row) {
      window.localStorage.setItem('order_number', row.orderNumber)
      this.$http.post('note/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'order_number': row
        }
      }).then(res => {
        this.noteList = []
        this.noteList = res.data.body.NoteList
      }).catch(res => {
        console.log(res)
      })
    },
    // 选中项时，判断是否允许点击付款按钮
    handleSelectionChange(val) {
      let sign = false
      this.multipleSelection = val
      this.purchases = []
      this.selectNumber = this.multipleSelection.length
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.purchases[i] = this.multipleSelection[i].purchaseUuid
        if (this.multipleSelection[i].moneySign === 2 || this.multipleSelection[i].moneySign === '2') {
          // 不允许打款
          this.submitReceivableButton = true
          sign = true
        }
        if (i === this.multipleSelection.length - 1) {
          if (sign === false) {
            // 允许打款
            this.submitReceivableButton = false
          }
        }
      }
    },
    // 付款
    submitReceivable () {
      this.$confirm('请确认已打款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('financial/Payable', {
          'body': {
            'purchase_uuids': this.purchases
          }
        }).then(res => {
          this._loadMainList()
          this.$message({
            type: 'success',
            message: '打款成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消打款'
        })
      })
    }
  },
  mounted() {
    this._loadMainList()
    this.queryShop()
  },
  computed: {
    // 获取权限信息
    permission() {
      return this.$store.getters.hasPermission('payableManageWrite')
    }
  }
}

</script>
