<template>
  <div class="afterSalesGoodsList">
    <div class="mgb15">
      <el-button type="primary" @click="_loadMainList"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
      <!-- 当有权限时可点击新建按钮，新建售后单 -->
      <el-button type="primary" @click="handlePopupForm('add')" :disabled="!permission"><i class="iconfont "></i>新建</el-button>
      <!-- 当有权限，选择一个，订单状态为1（待审核）时，可修改售后单 -->
      <el-button type="primary" @click="handlePopupForm('edit')" :disabled="!permission || multipleSelection.length !== 1 || multipleSelection[0].orderState !== 1"><i class="iconfont icon-icon07"></i>修改</el-button>
      <!-- 当有权限，选择一个，订单状态为1（待审核）时，售后单类型不是维修时，将售后单状态变为已退货或已换货 -->
      <el-button type="primary" @click="passed" :disabled="!permission || multipleSelection.length !== 1 || this.multipleSelection[0].orderState !== 1 || this.multipleSelection[0].afterSalesType === 2"><i class="iconfont icon-artboard38"></i>通过</el-button>
    </div>
    <!-- 售后单列表 -->
    <div class="table-wrapper">
      <el-table :data="afterSalesOrderList" stripe style="width: 100%" @row-click="selectInfo"  ref="table" :fit="true"  @selection-change="handleSelectionChange" highlight-current-row max-height="523">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column type="index" label="序号" width="100">
        </el-table-column>
        <el-table-column prop="afterSalesNumber" label="售后单号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="客户名称">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="120">
        </el-table-column>
        <el-table-column prop="associatedOrders" label="关联订单" width="180">
        </el-table-column>
        <el-table-column prop="salesman" label="业务员">
        </el-table-column>
        <el-table-column prop="typeNumber" label="产品种类">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="产品总数">
        </el-table-column>
        <el-table-column prop="orderState" label="售后单状态" :formatter="regionFormatter">
        </el-table-column>
        <el-table-column prop="afterSalesType" label="售后单类型" :formatter="regionFormatterReturn">
        </el-table-column>
        <el-table-column prop="createDatetime" label="下单时间" :formatter="$formatter.formatTime('createDatetime')" width="160">
        </el-table-column>    
      </el-table>
    </div>
    <!-- 新建或者编辑售后单 -->
    <el-dialog size="full" :title="formTitle" :before-close="handleCloseForm" :visible.sync="dialogVisible">
      <aftersale-form :updatedForm="form"></aftersale-form>
    </el-dialog>
    <!-- 分页 -->
    <div class="toolbar clearfix" :data="pagination">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 辅助模块 -->
    <!-- 日志 -->
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
      <!-- 订单详情 -->
      <el-tab-pane label="订单详情">
          <div class="grid" v-for="item in afterSalesOrderDetailList" :key='item.afterSalesNumber'>
            <div class='grid-row clearfix'>
              <div class="cell">售后单号</div><div class="cell">{{item.afterSalesNumber}}</div>
              <div class="cell">关联订单</div><div class="cell">{{item.associatedOrders}}</div>
              <div class="cell">售后单类型</div><div class="cell">{{item.afterSalesType}}</div>
              <div class="cell">仓库名字</div><div class="cell">{{item.warehouseName}}</div>
              <div class="cell">业务员</div><div class="cell">{{item.salesman}}</div>
              <div class="cell">客户姓名</div><div class="cell">{{item.name}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">手机</div><div class="cell">{{item.phone}}</div>
              <div class="cell">买家留言</div><div class="cell">{{item.buyerRemark}}</div>
              <div class="cell">下单时间</div><div class="cell">{{item.createDatetime}}</div>
              <div class="cell">折扣</div><div class="cell">{{item.discount}}</div>
              <div class="cell">省市区</div><div class="cell"><span v-if="item.city">{{item.province}}/{{item.city}}/{{item.area}}</span></div>
              <div class="cell">地址</div><div class="cell">{{item.address}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">固话</div><div class="cell">{{item.telephone}}</div>
              <div class="cell">邮编</div><div class="cell">{{item.postcode}}</div>
              <div class="cell">邮费</div><div class="cell">{{item.afterSalesNumber}}</div>
              <div class="cell">电话</div><div class="cell">{{item.telephone}}</div>
              <div class="cell">应收金额</div><div class="cell">{{item.receivableMoney}}</div>
              <div class="cell">优惠金额</div><div class="cell">{{item.discountMoney}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">支付方式</div><div class="cell">{{item.payType}}</div>
              <div class="cell">发票类别</div><div class="cell">{{item.invoiceType}}</div>
              <div class="cell">发票抬头</div><div class="cell">{{item.invoiceTitle}}</div>
              <div class="cell">发票内容</div><div class="cell">{{item.invoiceContent}}</div>
              <div class="cell">货运方式</div><div class="cell">{{item.transportationModel}}</div>
              <div class="cell">产品种类</div><div class="cell">{{item.typeNumber}}</div>
            </div>
            <div class='grid-row clearfix'>
              <div class="cell">产品总量</div><div class="cell">{{item.goodsNumber}}</div>
              <div class="cell">订单状态</div><div class="cell  cell-4"><span v-if="item.orderState"></span>{{regionFormatter(item, item.orderState)}}</div>
              <div class="cell">客服备注</div><div class="cell  cell-4">{{item.sellerRemark}}</div>
            </div>
          </div>
      </el-tab-pane>
      <!-- 便签 -->
      <el-tab-pane label="便签">
         <!-- 点击添加，显示添加便签页，添加便签 -->
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
      <!-- 货品列表 -->
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
    <!-- 添加便签时，显示的页 -->
    <el-dialog title="订单便签" size="tiny" :visible.sync="stickyNotesVisible">
      <sticky-notes></sticky-notes>
    </el-dialog>
    <!-- 便签里添加快捷键 -->
    <el-dialog title="编辑快捷键" :visible.sync="shortcutEditingVisivble" @close="handleClose('setShortcutEditingVisivble')">
      <edit-shortcuts></edit-shortcuts>
    </el-dialog>    
  </div>
</template>
<script>
import AftersaleForm from './form'
import EditShortcuts from '@/components/EditShortcuts'
import StickyNotes from '@/components/StickyNotes'
export default {
  name: 'aftersale-management',
  components: {
    [AftersaleForm.name]: AftersaleForm,
    [EditShortcuts.name]: EditShortcuts,
    [StickyNotes.name]: StickyNotes
  },
  data() {
    return {
      // 控制新建或者编辑售后单页面显示或隐性状态
      dialogVisible: false,
      // 控制新建或者编辑售后单页面显示头部的信息显示
      formTitle: '新建售后单',
      // 存储售后单列表数组
      afterSalesOrderList: [],
      // 售后单详情
      afterSalesOrderDetailList: [{'afterSalesNumber': ''}],
      // 存储所选择的售后单信息
      multipleSelection: [],
      // 存储日志信息
      logsData: [],
      // 存储售后货品列表
      afterGoods: [],
      // 便签
      noteList: [],
      // 添加便签按钮是否可点击
      addNode: true,
      // 当前选择的数量
      selectNumber: 0,
      // 是否显示添加便签页
      stickyNotesVisible: false,
      // 是否显示编辑快捷键页
      shortcutEditingVisivble: false,
      // 以对象的形式存储当前选择的第一个售后单
      currentRow: {},
      // 向编辑页传递的数据
      form: {
        user_name: this.$store.getters.getAccount.name,
        associated_order: '',
        afterSales_type: '',
        warehouse_name: '',
        salesman: '',
        name: '',
        phone: '',
        discount: '',
        province: '',
        city: '',
        area: '',
        telephone: '',
        address: '',
        buyer_remark: '',
        postcode: '',
        receivable_money: '',
        postage: '',
        discount_money: '',
        actual_money: '',
        pay_type: '',
        invoice_type: '',
        invoice_title: '',
        invoice_content: '',
        transportation_model: '',
        service_remark: '',
        productInformation: []
      },
      // 分页显示的数据，分页请求的数据量
      pagination: {
        // 请求的第几页
        pageIndex: 1,
        // 每一页请求多少条数据
        pageSize: 20,
        total: 0
      }
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/AfterSalesExcelport')
    },
    // 过滤器，将售后单状态有数字变为文字
    regionFormatter (row, column) {
      const mapping = {
        '1': '待处理',
        '2': '已维修',
        '3': '已退货',
        '4': '已换货'
      }
      return mapping[row.orderState]
    },
    // 过滤器，将售后单类型有数字变为文字
    regionFormatterReturn(row, column) {
      const mapping = {
        '1': '退货',
        '2': '维修',
        '3': '换货'
      }
      return mapping[row.afterSalesType]
    },
    // 每次选择，刷新选中数量，以及向编辑页传递的信息
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectNumber = this.multipleSelection.length
      this.currentRow = this.multipleSelection[0]
      // console.log(this.currentRow)
    },
    // 点击分页，获取对应行的售后单列表，并重新渲染
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    /* 点击关闭页面时，清除数据 */
    handleCloseForm() {
      this.form = {
        user_name: this.$store.getters.getAccount.name,
        associated_order: '',
        afterSales_type: '',
        warehouse_name: '',
        salesman: '',
        name: '',
        phone: '',
        discount: '',
        province: '',
        city: '',
        area: '',
        telephone: '',
        address: '',
        buyer_remark: '',
        postcode: '',
        receivable_money: '',
        postage: '',
        discount_money: '',
        actual_money: '',
        pay_type: '',
        invoice_type: '',
        invoice_title: '',
        invoice_content: '',
        transportation_model: '',
        service_remark: '',
        aftergoods_list: ''
      }
      this.dialogVisible = false
      this.$message({
        showClose: true,
        message: '已取消' + this.formTitle
      })
    },
    // 关闭快捷键编辑页
    handleClose(val) {
      this.val = false
    },
    // 打开便签页
    showStickyNotesVisible () {
      this.stickyNotesVisible = true
      window.sessionStorage.setItem('createNodeParent', 'AfterSalesManagement')
    },
    // 点击一行时触发的函数
    selectInfo(row) {
      // 获取对应行的售后单详情
      this.afterSalesOrderDetail(row.afterSalesNumber)
      // 获取对应行的货品列表
      this.getAfterSalesOrderGoods(row.afterSalesNumber)
      // 获取对应行的便签
      this.getNode(row.afterSalesNumber)
      // 获取对应行的日志信息
      this.getLogList(row.afterSalesNumber)
      // 将对应的售后单号传入便签编辑页
      window.localStorage.setItem('order_number', row.afterSalesNumber)
      // 可添加便签
      this.addNode = false
    },
    // 新建或者编辑售后单时向该页面传递不同信息
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建售后单'
        window.sessionStorage.setItem('formTitle', '新建售后单')
        this.dialogVisible = true
        console.log(window.sessionStorage.getItem('formTitle'))
        // 新建时传递为空
        this.form = Object.assign({}, {
          'after_sales_number': ''
        })
      } else if (formName === 'edit') {
        if (this.currentRow.afterSalesNumber) {
          this.formTitle = '编辑售后单'
          window.sessionStorage.setItem('formTitle', '编辑售后单')
          this.form = Object.assign({}, {
            // 售后单为编辑时，传递售后单号
            'after_sales_number': this.currentRow.afterSalesNumber
          })
          this.dialogVisible = true
        } else {
          this.$message({
            showClose: true,
            message: '请选择'
          })
        }
      }
    },
    // 通过审核
    passed() {
      // 提示信息
      this.$confirm('请确认通过, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 点击确定时 得到该售后单应改变的状态
        let orderState
        if (this.multipleSelection[0].afterSalesType === 1) {
          orderState = '3'
        } else if (this.multipleSelection[0].afterSalesType === 2) {
          orderState = '2'
        } else if (this.multipleSelection[0].afterSalesType === 3) {
          orderState = '4'
        }
        // 将该订单类型的售后单状态，改为对应的通过后状态
        this.$http.post('afterSalesOrder/changeState', {
          'body': {
            user_name: this.$store.getters.getAccount.name,
            after_sales_number: this.multipleSelection[0].afterSalesNumber,
            order_state: orderState
          }
        }).then(res => {
          // 修改成功，从新获取售后单列表
          this._loadMainList()
          // 显示已通过通知
          this.$message({
            type: 'success',
            message: '已通过'
          })
        })
      }).catch(() => {
        // 显示已取消通知
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 获取售后单列表
    _loadMainList() {
      this.$tool.loadList(this, 'afterSalesOrder/list', bodyInfo => {
        this.afterSalesOrderList = bodyInfo.AfterSalesOrderList
      })
    },
    // 获取日志
    getLogList(row) {
      this.$http.post('returnGoods/loglist', {
        'body': {
          'user_name': this.form.user_name = JSON.parse(window.localStorage.getItem('loginUserBaseInfo')).user_name,
          'pageIndex': 1,
          'pageSize': 1000,
          'after_sales_number': row
        }
      }).then(res => {
        // 售后日志
        // console.log('售后日志：', res)
        if (res.data.body.LogAfterSalesList.length !== 0) {
          this.logsData = res.data.body.LogAfterSalesList
        }
      }).catch(res => {
        console.log(res)
      })
    },
    // 获取对应行的货品列表
    getAfterSalesOrderGoods(row) {
      this.$http.post('afterSalesOrder/goods', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'after_sales_number': row
        }
      }).then(res => {
        // console.log(res)售后单货品列表
        this.afterGoods = []
        this.afterGoods = res.data.body.AfterSalesOrderGoodsList
      }).catch(res => {
        console.log(res)
      })
    },
    // 获取便签信息
    getNode(row) {
      window.localStorage.setItem('order_number', row.afterSalesNumber)
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
    // 获取订单详情
    afterSalesOrderDetail(row) {
      this.$http.post('afterSalesOrder/detail', {
        'body': {
          'after_sales_number': row
        }
      }).then(res => {
        // 售后单详情
        this.afterSalesOrderDetailList = []
        this.afterSalesOrderDetailList[0] = res.data.body.AfterSalesOrder
      }).catch(res => {
        console.log(res)
      })
    }
  },
  mounted() {
    // 打开页面自动获取售后单列表
    this._loadMainList()
  },
  computed: {
    permission() {
      // 获取权限信息
      return this.$store.getters.hasPermission('afterSalesWrite')
    }
  }
}

</script>
<style lang="scss" scoped>
 .grid {
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  width: 100%;
  display: flex;
  flex-direction: column;
  .grid-row {
    display: flex;
    .cell {
      word-break:break-word;
      text-align: center;
      padding: 8px 0;
      flex: 1;
      border-right: 1px solid #dfe6ec;
      border-bottom: 1px solid #dfe6ec;
      font-size: 15px;
    }
    .cell-4 {
      flex: 4;
      padding-left: 3px;
    }
  }
}
.afterSalesGoodsList {
  .el-table th>.cell{
    text-align: center;
  }
  .el-table .cell{
    text-align: center;
  }
}
</style>
