<template>
  <div class="AftersalesReceivable">
    <div class="mgb15">
      <el-button type="primary" @click="_loadMainList"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
      <el-button type="primary" class="mgl10" @click="submitReceivable" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton"><i class="iconfont icon-artboard38"></i>已收款</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="afterSalesOrderList" stripe style="width: 100%" highlight-current-row @current-change="selected" @row-click="selectInfo" @selection-change="handleSelectionChange" max-height="523">
        <el-table-column type="selection"></el-table-column> 
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column prop="afterSalesNumber" label="售后单号" align="center" width='180'>
        </el-table-column>
        <el-table-column prop="name" label="客户名称" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center" width="150">
        </el-table-column>
        <el-table-column prop="associatedOrders" label="关联订单" align="center" width="180">
        </el-table-column>
        <el-table-column prop="salesman" label="业务员" align="center">
        </el-table-column>
        <el-table-column prop="typeNumber" label="产品种类" align="center">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="货品总数" align="center">
        </el-table-column>
        <el-table-column prop="actualMoney" label="总价" align="center">
        </el-table-column>
        <el-table-column prop="discountMoney" label="优惠价格" align="center">
        </el-table-column>
        <el-table-column prop="moneySign" label="收款状态" align="center" :formatter="regionReceivable">
        </el-table-column>
        <el-table-column prop="createDatetime" label="收货时间" align="center" :formatter="$formatter.formatTime('createDatetime')" width="200">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix" :data="pagination">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 底部辅助表格 -->
    <el-tabs type="border-card" class="auxiliary-table">
      <el-tab-pane label="日志">
        <el-table :data="logsData" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="200">
          </el-table-column>
          <el-table-column prop="operator" label="操作员">
          </el-table-column>
          <el-table-column prop="content" label="内容">
          </el-table-column>
          <el-table-column prop="createDatetime" label="时间">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="订单详情">
          <div class="grid" v-for="item in afterSalesOrderDetailList" :key='item.afterSalesNumber'>
            <div class='grid-row clearfix'>
              <div class="cell">售后单号</div><div class="cell">{{item.afterSalesNumber}}</div>
              <div class="cell">关联订单</div><div class="cell">{{item.associatedOrders}}</div>
              <div class="cell">售后单类型</div><div class="cell">{{item.afterSalesType}}</div>
              <div class="cell">仓库名字</div><div class="cell">{{item.warehouseName}}</div>
              <div class="cell">业务员</div><div class="cell">{{item.salesman}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">客户姓名</div><div class="cell">{{item.name}}</div>
              <div class="cell">手机</div><div class="cell">{{item.phone}}</div>
              <div class="cell">买家留言</div><div class="cell">{{item.buyerRemark}}</div>
              <div class="cell">下单时间</div><div class="cell">{{item.createDatetime}}</div>
              <div class="cell">折扣</div><div class="cell">{{item.discount}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">省市区</div><div class="cell"><span v-if="item.city">{{item.province}}/{{item.city}}/{{item.area}}</span></div>
              <div class="cell">地址</div><div class="cell">{{item.address}}</div>
              <div class="cell">固话</div><div class="cell">{{item.telephone}}</div>
              <div class="cell">邮编</div><div class="cell">{{item.postcode}}</div>
              <div class="cell">邮费</div><div class="cell">{{item.afterSalesNumber}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">电话</div><div class="cell">{{item.telephone}}</div>
              <div class="cell">应收金额</div><div class="cell">{{item.receivableMoney}}</div>
              <div class="cell">优惠金额</div><div class="cell">{{item.discountMoney}}</div>
              <div class="cell">支付方式</div><div class="cell">{{item.payType}}</div>
              <div class="cell">发票类别</div><div class="cell">{{item.invoiceType}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">发票抬头</div><div class="cell">{{item.invoiceTitle}}</div>
              <div class="cell">发票内容</div><div class="cell">{{item.invoiceContent}}</div>
              <div class="cell">货运方式</div><div class="cell">{{item.transportationModel}}</div>
              <div class="cell">产品种类</div><div class="cell">{{item.typeNumber}}</div>
              <div class="cell">产品总量</div><div class="cell">{{item.goodsNumber}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">订单状态</div><div class="cell  cell-4"><span v-if="item.orderState"></span>{{regionFormatter(item, item.orderState)}}</div>
              <div class="cell">客服备注</div><div class="cell  cell-4">{{item.sellerRemark}}</div>
            </div>
          </div>
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
        <el-table :data="afterGoods" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="70">
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
  name: 'after-receivable',
  components: {
    [EditShortcuts.name]: EditShortcuts,
    [StickyNotes.name]: StickyNotes
  },
  data() {
    return {
      // 售后应收列表
      tableData: [],
      // 便签页
      stickyNotesVisible: false,
      // 快捷键编辑页
      shortcutEditingVisivble: false,
      // 选择
      submitReceivableButton: true,
      // 选中个数
      selectNumber: 0,
      // 日志
      logsData: [],
      // 商店列表
      commands: [],
      // 便签
      noteList: [],
      // 是否允许添加便签
      addNode: true,
      // 售后单详情
      afterSalesOrderDetailList: [],
      // 货品列表
      afterGoods: [],
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      current: {},
      // 售后应收管理列表
      afterSalesOrderList: [],
      // 入库详情
      warehousing_detail: [],
      // 选中行信息
      multipleSelection: [],
      // 售后应收管理号数组
      afterSalesNumbers: []
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/AfterSaleReceivableExcelport')
    },
    // 过滤器，将数字转化为文字
    regionFormatter(row, column) {
      const mapping = {
        '0': '冻结',
        '1': '待审核',
        '2': '驳回',
        '3': '待财审',
        '4': '审核通过',
        '5': '代生产',
        '6': '生产中',
        '7': '待发货',
        '8': '已发货',
        '9': '已签收',
        '10': '申请退货',
        '11': '退货中',
        '12': '完成退货',
        '13': '取消'
      }
      return mapping[row.orderState]
    },
    // 过滤器，将数字转化为文字
    regionReceivable(row, column) {
      const mapping = {
        '1': '未收款',
        '2': '已收款'
      }
      return mapping[row.moneySign]
    },
    // // 点击一行
    // selected(current) {
    //   this.current = current
    //   this.$store.commit('selected', current)
    // },
    // 显示便签
    showStickyNotesVisible() {
      this.stickyNotesVisible = true
      window.sessionStorage.setItem('createNodeParent', 'AccountsReceivableManagement')
    },
    // 点击一行
    selectInfo(row, event) {
      this.afterSalesOrderDetail(row)
      this.getAfterSalesOrderGoods(row)
      this.getNode(row.afterSalesNumber)
      this.getLogList(row)
      this.addNode = false
    },
    // 判断选中行
    handleSelectionChange(val) {
      let sign = false
      this.multipleSelection = val
      this.afterSalesNumbers = []
      this.selectNumber = this.multipleSelection.length
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.afterSalesNumbers[i] = this.multipleSelection[i].afterSalesNumber
        if (this.multipleSelection[i].moneySign === '2' || this.multipleSelection[i].moneySign === 2) {
          // 不允许点击已收款
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
    // 已收款
    submitReceivable () {
      this.$confirm('请确认已收到款项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('financial/afterSalesAudit', {
          'body': {
            after_sales_numbers: this.afterSalesNumbers
          }
        }).then(res => {
          // console.log(res)
          this._loadMainList()
          this.$message({
            type: 'success',
            message: '收款成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消收款'
        })
      })
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取商品列表
    _loadMainList() {
      this.$tool.loadList(this, 'financial/afterSalesList', bodyInfo => {
        this.afterSalesOrderList = bodyInfo.AfterSalesOrderList
      })
    },
    // 日志
    getLogList(row) {
      this.$http.post('returnGoods/loglist', {
        'body': {
          'user_name': this.$store.getters.getAccount.name,
          'pageIndex': 1,
          'pageSize': 1000,
          'after_sales_number': row.afterSalesNumber
        }
      }).then(res => {
        if (res.data.body.LogAfterSalesList.length !== 0) {
          this.logsData = res.data.body.LogAfterSalesList
        }
      }).catch(res => {
        // console.log(res)
      })
    },
    // 售后单货品列表
    getAfterSalesOrderGoods(row) {
      this.$http.post('afterSalesOrder/goods', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'after_sales_number': row.afterSalesNumber
        }
      }).then(res => {
        // console.log('售后单货品列表', res)
        this.afterGoods = []
        this.afterGoods = res.data.body.AfterSalesOrderGoodsList
      }).catch(res => {
        // console.log(res)
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
        // console.log('便签', res)
        this.noteList = []
        this.noteList = res.data.body.NoteList
      }).catch(res => {
        // console.log(res)
      })
    },
    // 订单详情
    afterSalesOrderDetail(row) {
      this.$http.post('afterSalesOrder/detail', {
        'body': {
          'after_sales_number': row.afterSalesNumber
        }
      }).then(res => {
        // console.log(res)
        // 售后单详情
        this.afterSalesOrderDetailList = []
        this.afterSalesOrderDetailList[0] = res.data.body.AfterSalesOrder
      }).catch(res => {
        // console.log(res)
      })
    }
  },
  mounted() {
    this._loadMainList()
    this._loadStore()
  },
  computed: {
    // 获取售后应付管理的权限信息
    permission() {
      return this.$store.getters.hasPermission('receivableManageWrite')
    }
  }
}

</script>
<<style lang="scss">
 .grid {
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  width: 100%;
  height: 163px;
  display: flex;
  flex-direction: column;
  .grid-row {
    display: flex;
    .cell {
      word-break:break-word;
      text-align: center;
      padding: 10px 0;
      flex: 1;
      border-right: 1px solid #dfe6ec;
      border-bottom: 1px solid #dfe6ec;
    }
    .cell-4 {
      flex: 4;
      padding-left: 3px;
    }

  }
}
</style>