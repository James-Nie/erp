<template>
  <div class="orderReceivablesManagement">
    <div class="mgb15">
      <el-dropdown @command="handleDashBoard" trigger="click">
        <el-button type="primary" style="width: 100px">{{storeName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item v-for="item in commands" :key="item.id" :command="item.id">{{item.storeName}}</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" class="mgl10" @click="receivableAudit" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton"><i class="iconfont icon-artboard38"></i>已收款</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <el-table :data="orderList" v-loading="loading" highlight-current-row @current-change="selected" @selection-change="handleSelectionChange" max-height="523" @row-click="selectInfo">
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
      <el-table-column prop="orderNumber" label="订单号" width="180" align="center"></el-table-column>
      <el-table-column prop="store" label="店铺名称"></el-table-column>
      <el-table-column prop="orderStatus" label="订单状态" :formatter="$formatter.formatOrderStatus" align="center"></el-table-column>
      <el-table-column prop="orderType" label="订单类型" ></el-table-column>
      <el-table-column prop="refundStatus" label="退款状态"></el-table-column>
      <el-table-column :formatter="$formatter.formatTime('orderDatetime')" label="下单时间" width="180" align="center"></el-table-column>
      <el-table-column prop="addressee" label="收件人"></el-table-column>
      <el-table-column prop="logisticsMode" label="物流方式"></el-table-column>
      <el-table-column prop="goodsNumber" label="数量"></el-table-column>
      <el-table-column label="是否收款" :formatter="$formatter.formatMoneySign"></el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>  
    <!-- 底部辅助表格 -->
    <el-tabs type="border-card" max-height="163">
      <el-tab-pane label="日志">
        <el-table :data="logsData" stripe style="width: 100%">
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
      <el-tab-pane label="订单详情" name="detail">
        <order-details :order="order"></order-details>
      </el-tab-pane>
      <el-tab-pane label="便签">
        <el-button class="mgb15" type="primary" @click="showStickyNotesVisible" :disabled="addNode === true"><i class="iconfont  "></i>添加</el-button>
        <el-table :data="noteList" stripe style="width: 100%">
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
        <el-table :data="orderGoods" stripe style="width: 100%">
          <el-table-column type="index" label="序号">
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
          <el-table-column prop="amount" label="数量">
          </el-table-column>
          <el-table-column prop="allWeight" label="总重">
          </el-table-column>
          <el-table-column prop="retailPrice" label="零售价">
          </el-table-column>
          <el-table-column prop='allPrice' label="总价">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="物流跟踪" name="logistics">
      <el-row style="margin-bottom: 20px">
        <el-col :span="8"><div style="textAlign:center">{{companyName}}</div></el-col>
        <el-col :span="8"><div styel="textAlign:center">{{logisticsStatus}}</div></el-col>
        <el-col :span="8"><div style="textAlign:center">{{logisticsNumber}}</div></el-col>
      </el-row>
      <el-steps :space="200" :active="getlogisticsInfo.length">
        <el-step v-for="(item, key, index) in getlogisticsInfo" :key="index" :title="item.logisticTime" :description="item.str"></el-step>
      </el-steps>
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
  name: 'receivables-management',
  components: {
    [EditShortcuts.name]: EditShortcuts,
    [StickyNotes.name]: StickyNotes
  },
  data() {
    return {
      // 订单列表
      orderList: [],
      // 商店列表
      commands: [],
      // 日志
      logsData: [],
      // 订单详情
      order: {},
      // 便签
      noteList: [],
      // 货品列表
      orderGoods: [],
      // 物流公司名字
      companyName: '',
      // 物流状态
      logisticsStatus: '暂无物流信息',
      // 物流单号
      logisticsNumber: '',
      // 物流信息
      getlogisticsInfo: [],
      // 是否允许点击已收款
      submitReceivableButton: true,
      // 添加便签
      stickyNotesVisible: false,
      // 快捷键
      shortcutEditingVisivble: false,
      // 允许添加便签
      addNode: true,
      // 选中行信息
      multipleSelection: [],
      // 选择的订单列表id数组
      orderNumberLists: [],
      // 选中数量
      selectNumber: 0,
      // 仓库名称
      storeName: '全部仓库',
      storeId: '',
      loading: false,
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      }
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/OrderReceivableExcelport')
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 点击一行
    selected (current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    // 获取商店列表
    queryShop() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.commands = bodyInfo.apiResult
      })
    },
    // 点击一行
    selectInfo(row) {
      console.log(row.orderNumber)
      this.getlogistics(row)
      this.getOrderGoods(row.orderNumber)
      this.getNode(row.orderNumber)
      this.getOrderGoodsDetail(row)
      this.addNode = false
      this.getLogList(row.orderNumber)
    },
    // 物流信息
    getlogistics(row) {
      this.$http.post('order/logistics', {
        'body': {
          'orderNumber': row.orderNumber
        }
      }).then(res => {
        // console.log('物流跟踪', res)
        this.getlogisticsInfo = res.data.body.logistic
        this.logisticsStatus = res.data.body.state
        this.companyName = res.data.body.companyName
        this.logisticsNumber = res.data.body.logisticsNumber
      }).catch(res => {
        console.log(res)
      })
    },
    // 货品列表
    getOrderGoods(row) {
      this.$http.post('order/goods', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'order_number': row
        }
      }).then(res => {
        // console.log(res)货品列表
        this.orderGoods = []
        this.orderGoods = res.data.body.OrderGoodsList
      }).catch(res => {
        // console.log(res)
      })
    },
    // 订单详情
    getOrderGoodsDetail(row) {
      this.$http.post('order/detail', {
        'body': {
          'order_uuid': row.orderUuid
        }
      }).then(res => {
        // console.log(res)
        this.order = res.data.body.order
      }).catch(res => {
        // console.log(res)
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
      window.localStorage.setItem('order_number', row)
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
    // 添加便签
    showStickyNotesVisible() {
      this.stickyNotesVisible = true
      window.sessionStorage.setItem('createNodeParent', 'OrderReceivablesManagement')
    },
    // 选择商店
    handleDashBoard(command) {
      this.storeId = command
      for (let i = 0; i < this.commands.length; i++) {
        if (this.commands[i].id === this.storeId) {
          this.storeName = this.commands[i].storeName
        }
      }
    },
    // 判断选中行是否允许点击收款按钮
    handleSelectionChange(val) {
      this.multipleSelection = val
      let sign = false
      this.orderNumberLists = []
      this.selectNumber = this.multipleSelection.length
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.orderNumberLists[i] = this.multipleSelection[i].orderNumber
        if (this.multipleSelection[i].moneySign === 2 || this.multipleSelection[i].moneySign === '2') {
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
    },
    // 收款，改变状态，刷新
    receivableAudit() {
      this.$confirm('请确认已收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('financial/receivableAudit', {
          'body': {
            'order_numbers': this.orderNumberLists
          }
        }).then(res => {
          this._loadMainList()
          this.$message({
            type: 'success',
            message: '设置收款成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消收款'
        })
      })
    },
    _loadMainList() {
      this.$tool.loadList(this, 'financial/receivableList', bodyInfo => {
        this.orderList = bodyInfo.OrderList
      })
    }
  },
  mounted() {
    [this.queryShop, this._loadMainList].forEach(f => f())
  },
  computed: {
    // 获取权限信息
    permission() {
      return this.$store.getters.hasPermission('receivableManageWrite')
    }
  }
}

</script>
<style>
 .orderReceivablesManagement .el-table .cell {
  text-align: center;
}
</style>