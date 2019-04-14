<template>
  <div class="order-management">
    <div class="mgb15">
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
          {{filter.store}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in commands" :key="item.id" :command="item.storeName">{{item.storeName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="commandOrderStatus" class="mgl10">
        <el-button type="primary">
          {{filter.order_status.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in orderStatus" :key="item.value.status" :command="item.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
			<el-input  style="width: 150px;" label="订单编号" v-model="filter.orderNumber" placeholder="请输入订单编号"></el-input>
			<el-input  style="width: 150px;" label="客服备注" v-model="filter.serviceRemark" placeholder="客服备注"></el-input> 
			<el-input  style="width: 150px;" label="客户网名" v-model="filter.onlineName" placeholder="客户网名"></el-input>
			<el-button type="primary" @click="search" class="mgl10" icon="search">搜索</el-button>
			<br/><br/>
			<el-button type="primary" @click="refresh" class="mgl10"><i class="iconfont icon-shuaxin1"></i>同步订单</el-button>
      <el-button type="primary" @click="handlePopupForm('add')"><i class="iconfont  "></i>新建</el-button>  
      <el-button type="primary" @click="extractSettingsVisible = true"><i class="iconfont icon-shezhi"></i>提取设置</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
      <el-button type="primary" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>修改</el-button>
      <el-button type="primary" @click="submissionAudit" :disabled="multipleSelection.length !== 1" class="mgl10"><i class="iconfont icon-tongguo"></i>提交审核</el-button>
      <el-button type="primary" @click="checkIn" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-qianru1"></i>签入</el-button>
      <el-button type="primary" @click="checkOut" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-qianchu1"></i>签出</el-button>
      <el-button type="danger" @click="handlePopupOrder" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-quxiao"></i>取消</el-button>
      <el-button type="danger" @click="frozenOrder" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-dongjiefene"></i>冻结</el-button>
      <el-button type="danger" :disabled="multipleSelection.length !== 1" @click="thawOrder"><i class="iconfont icon-jiedong01"></i>解冻</el-button>
      <el-dropdown class="mgl10" @command="selectedCommand">
        <el-button>
          {{filter.fontColor}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in colorOptions" :key="item.id" :command="{id:item.id, name: item.name}">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="more" class="mgl10" @click="openFontColorPanel"></el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="orderList" v-loading="loading" ref="orderList" highlight-current-row @current-change="selected" @selection-change="handleSelectionChange" max-height="523" :row-style="setRowStyle">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column prop="id" label="订单号" align="center" min-width="160">
        </el-table-column>
        <el-table-column prop="storeName" label="店铺名称" align="center" min-width="160">
        </el-table-column>
        <el-table-column label="订单状态" :formatter="$formatter.formatOrderStatus" align="center" min-width="100">
        </el-table-column>
        <el-table-column prop="orderType" label="订单分类" align="center" min-width="100">
        </el-table-column>
        <el-table-column label="退款状态" :formatter="$formatter.formatRefundStatus" align="center" min-width="100">
        </el-table-column>
        <el-table-column prop="orderDatetime" label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" align="center" min-width="160">
        </el-table-column>
        <el-table-column prop="salesman" label="业务员" align="center">
        </el-table-column>
        <el-table-column prop="addressee" label="收件人" align="center">
        </el-table-column>
        <el-table-column prop="logisticsMode" label="物流" align="center">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="数量" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="total, sizes, prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!--特殊符号列表-->
    <el-dialog title="备注提取设置" :visible.sync="extractSettingsVisible" @close="closeExtract">
      <extract-settings ref="extract"></extract-settings>
    </el-dialog>
    <el-dialog custom-class="order-management-dialog" :title="form.formTitle" :visible.sync="orderManagementFormVisible" size="full" @close="resetForm">
      <order-form :updatedForm="form" ref="orderForm" :goodsList.sync="goodsList" @submit="handleSubmitForm" @reset="resetForm"></order-form>
    </el-dialog>
    <!--新建取消原因-->
    <el-dialog size="tiny" custom-class="cancel-reason" title="取消原因" :visible.sync="cancelReasonVisible" @close="closeCancel">
      <cancel-reason :orderNumber="multipleSelection[0]" ref="cancel" @reset="closeCancel"></cancel-reason>
    </el-dialog>
    <el-dialog custom-class="edit-reason-dialog" title="编辑理由" :visible.sync="editReasonVisible" @close="closeEditReason">
      <edit-reason ref="editReason"></edit-reason>
    </el-dialog>
    <el-dialog title="颜色标记" custom-class="color-panel" :visible.sync="fontColorVisible" @close="closeColorPanel" max-height="243">
      <div class="mgb15">
        <el-button type="primary" @click="addFontColor"><i class="iconfont  "></i>添加</el-button>
        <el-button icon="star-off" @click="saveFontColor">保存</el-button>
      </div>
      <el-table :data="fontColorData" highlight-current-row @row-click="updateFontColor">
        <el-table-column label="标记名称" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" size="mini" class="w100" v-if="scope.row.editable"></el-input>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="背景颜色" align="center">
          <template slot-scope="scope">
            <el-color-picker v-if="scope.row.editable" show-alpha v-model="scope.row.background_color"></el-color-picker>
            <div class="el-color-picker" v-else>
              <div class="el-color-picker__trigger">
                <span class="el-color-picker__color is-alpha">
                  <span class="el-color-picker__color-inner" :style="'background-color:' + scope.row.background_color"></span>
                </span>
                <span class="el-color-picker__icon el-icon-caret-bottom readonly"></span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="字体颜色" align="center">
          <template slot-scope="scope">
            <el-color-picker v-if="scope.row.editable" show-alpha v-model="scope.row.font_color"></el-color-picker>
            <div class="el-color-picker" v-else>
              <div class="el-color-picker__trigger">
                <span class="el-color-picker__color is-alpha">
                  <span class="el-color-picker__color-inner" :style="'background-color:' + scope.row.font_color"></span>
                </span>
                <span class="el-color-picker__icon el-icon-caret-bottom readonly"></span>
              </div>
            </div>
          </template>    
        </el-table-column>
        <el-table-column label="是否斜体" align="center">
          <template slot-scope="scope">
            <el-checkbox v-if="scope.row.editable" v-model="scope.row.italic" true-label="italic" false-label="normal"></el-checkbox>
            <span v-else>{{scope.row.italic === 'italic' ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否粗体" align="center">
          <template slot-scope="scope">
            <el-checkbox v-if="scope.row.editable" v-model="scope.row.bold" true-label="bold" false-label="normal"></el-checkbox>
            <span v-else>{{scope.row.bold === 'bold' ? '是' : '否'}}</span>
          </template>          
        </el-table-column>
        <el-table-column label="是否停用" align="center">
          <template slot-scope="scope">
            <el-checkbox v-if="scope.row.disable_flag" v-model="scope.row.disable" true-label="2" false-label="1"></el-checkbox>
            <span v-else>{{$formatter.formatDisable(scope.row)}}</span>
          </template>          
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteFontColor(scope)">删除</el-button>
          </template>           
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 底部辅助表格 -->
    <auxiliary-table type="orderManage"></auxiliary-table>
  </div>
</template>
<script>
import AuxiliaryTable from '@/components/AuxiliaryTable'
import OrderForm from './form'
import EditShortcuts from './edit-shortcuts'
import EditReason from './edit-reason'
import CancelReason from './cancel-reason'
import ExtractSettings from './extract-settings'

export default {
  name: 'order-management',
  components: {
    [AuxiliaryTable.name]: AuxiliaryTable,
    [OrderForm.name]: OrderForm,
    [EditShortcuts.name]: EditShortcuts,
    [EditReason.name]: EditReason,
    [CancelReason.name]: CancelReason,
    [ExtractSettings.name]: ExtractSettings
  },
  data() {
    return {
      // 定时标志
      timer: null,
      _self: this,
      fontColorData: [],
      colorOptions: [],
      goodsList: [],
      loglist: [],
      warehouseList: [],
      supplierList: [],
      workshopList: [],
      orderStatus: this.$store.getters.getOrderStatus,
      filter: {
        store: '全部商店',
        fontColor: '颜色标注',
        order_status: {
          status: '-1',
          name: '全部订单'
        },
	      orderNumber: '',
	      onlineName: '',
	      serviceRemark: ''
      },
      tabs: {
        'active_name': 'detail'
      },
      /* ===========对话框状态开始 =============== */
      fontColorVisible: false,
      extractSettingsVisible: false,
      orderManagementFormVisible: false,
      cancelReasonVisible: false,
      editReasonVisible: false,
      // 原始订单
      oldOrder: {
        receivable_money_one: '',
        discount_money_one: '',
        actual_money_one: '',
        old_goods_list: []
      },
      // 拆单后订单
      newOrder: {
        new_order_number: '',
        receivable_money_two: '',
        discount_money_two: '',
        actual_money_two: '',
        goods_list: []
      },
      /* ===========对话框状态结束 =============== */
      loading: false,
      fontColorWriteable: true,
      saveFontColorType: 'add',
      form: {
        formTitle: '新建订单',
        user_name: this.$store.getters.getAccount.name,
        store: '',
        order_type: '',
        salesman: '',
        origin_number: '',
        name: '',
        phone: '',
        cityArray: [],
        pay_account: '',
        addressee: '',
        telephone: '',
        address: '',
        buyer_remark: '',
        postcode: '',
        receivable_money: '',
        postage: '',
        discount_money: '',
        discount: '',
        actual_money: '',
        pay_type: '',
        invoice_type: '',
        invoice_title: '',
        invoice_content: '',
        logistics_mode: '',
        service_remark: ''
      },
      productionGoodsList: [],
      multipleSelection: [],
      orderList: [],
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      order: {},
      current: {},
      commands: [],
      productionOrderInfo: [],
      // 新增字体颜色
      initFontColor: {
        name: '',
        background_color: '#ffffff',
        font_color: '#1f2d3d',
        italic: 'normal',
        bold: 'normal',
        disable: '1',
        editable: true,
        disable_flag: false
      },
      // 生产方式
      productionModeList: [{
        value: '车间生产'
      }, {
        value: '成品直发'
      }]
    }
  },
  watch: {
    // 每三分钟刷新一次数据
    orderList: {
      handler(val, oldVal) {
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(() => {
          let message = '数据在' + this.$moment().format('YYYY-MM-DD HH:mm:ss') + '更新了...'
          this.notification(message)
          this._loadMainList()
        }, 3 * 60 * 1000)
        // this.fontColorVisible = false
        // this.extractSettingsVisible = false
        // this.orderManagementFormVisible = false
        // this.cancelReasonVisible = false
        // this.editReasonVisible = false
      },
      deep: true
    }
  },
  methods: {
    notification(message) {
      const h = this.$createElement
      this.$notify({
        title: '系统通知',
        message: h('i', {style: 'color: teal'}, message)
      })
    },
    // 设置表格每一行的样式
    setRowStyle(row, index) {
      return 'background-color:' + row.backgroundColor + ';color:' + row.fontColor + ';font-weight:' + row.bold + ';font-style:' + row.italic
    },
    // 查询供应商
    querySupplier() {
      this.$tool.loadOptions(this, 'supplier/list', bodyInfo => {
        this.supplierList = bodyInfo.apiResult.map(item => ({value: item.name}))
      })
    },
    // 导出Excel
    exportExcel() {
      this.$tool.exportExcel(this, 'export/OrderExcelport')
    },
    // 关闭编辑理由列表
    closeEditReason() {
      this.$refs['editReason'].resetForm()
      window.setTimeout(() => {
        this.cancelReasonVisible = true
      }, 300)
    },
    // 关闭特殊符号列表
    closeExtract() {
      this.$refs['extract'].resetForm()
    },
    closeCancel() {
      this.$refs['cancel'].resetForm()
    },
    // 冻结订单
    frozenOrder() {
      if (!this.checkSalesman()) {
        return false
      }
      const status = {
        '0': '冻结',
        '1': '待审核',
        '2': '驳回',
        '3': '待财审',
        '4': '审核通过'
      }
      if (!status[this.multipleSelection[0].orderStatus]) {
        this.$message({
          message: '只有还未开生产单的订单可以冻结',
          type: 'error'
        })
        return false
      }
      this.$tool.frozenOrder(this, this.multipleSelection[0].id)
    },
    // 解冻订单
    thawOrder() {
      if (!this.checkSalesman()) {
        return false
      }
      this.$tool.thawOrder(this, this.multipleSelection[0].id)
    },
    // 多选
    handleSelectionChange(val) {
    	console.log('val', val)
      this.multipleSelection = val
    },
    // 页面条数修改
    handleSizeChange(val) {
    	this.pagination.pageSize = val
      this._loadMainList()
    },
    // 分页查询
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 检查订单是否重复
    isRepeatOrder() {
      return this.$http.post('order/repeatOrder', {
        'body': {
          'store': this.form.store,
          'order_type': this.form.order_type,
          'salesman': this.form.salesman,
          'name': this.form.name,
          'address': this.form.address,
          'goods_list': this.goodsList
        }
      })
    },
    submitForm(status) {
      let url = this.form.formTitle === '新建订单' ? 'order/create' : 'order/update'
      this.$tool.common(this, url, {
        ...this.form,
        city: JSON.stringify(this.form.cityArray),
        goods_list: this.goodsList,
        status
      }, bodyInfo => {
        this.resetForm()
        this._loadMainList()
      })
    },
    // 新建编辑表单
    handleSubmitForm(status) {
      if (this.form.formTitle === '新建订单') {
        this.isRepeatOrder().then(res => {
          this.submitForm(status)
        }).catch(err => {
          this.$confirm(err.description, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitForm(status)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消下单'
            })
          })
        })
      } else {
        this.submitForm(status)
      }
    },
    // 重置表单
    resetForm() {
      this.form = {
        formTitle: '新建订单',
        user_name: this.$store.getters.getAccount.name,
        store: '',
        order_type: '',
        salesman: '',
        origin_number: '',
        pay_account: '',
        name: '',
        phone: '',
        cityArray: [],
        addressee: '',
        telephone: '',
        address: '',
        buyer_remark: '',
        postcode: '',
        receivable_money: '',
        postage: '',
        discount_money: '',
        discount: '',
        actual_money: '',
        pay_type: '',
        invoice_type: '',
        invoice_title: '',
        invoice_content: '',
        logistics_mode: '',
        service_remark: ''
      }
      this.$refs['orderForm'].resetForm()
      this.goodsList = []
      this.orderManagementFormVisible = false
    },
    // 选择商店
    handleCommand(command) {
      this.filter.store = command
      this._loadMainList()
    },
    // 选择订单
    commandOrderStatus(command) {
      this.filter.order_status = command
      this._loadMainList()
    },
    // 单选
    selected(current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    // 查询货品列表
    queryGoods() {
      return this.$http.post('order/goods', {
        'body': {
          pageIndex: 1,
          pageSize: 1000,
          order_number: this.current.id
        }
      })
    },
    // 查询订单详情
    queryDetail() {
      return this.$http.post('order/detail', {
        'body': {
          'order_uuid': this.current.orderUuid
        }
      })
    },
    // 检查用户名是否是订单业务员
    checkSalesman() {
      if (this.$store.getters.getAccount.name !== this.multipleSelection[0].salesman) {
        this.$message({
          type: 'error',
          message: '登录账户必须是订单的业务员'
        })
        return false
      }
      return true
    },
    // 签入
    checkIn() {
      if (!this.checkSalesman()) {
        return false
      }
      if (this.multipleSelection[0].orderStatus === '14') {
        this.$message({
          message: '不能操作已取消的订单',
          type: 'error'
        })
        return false
      }
      this.$tool.confirm(this, '签入', () => {
        this.$tool.common(this, 'order/checkin', {
          'orderNo': this.multipleSelection[0].id
        }, bodyInfo => {
          this._loadMainList()
        })
      })
    },
    // 签出
    checkOut() {
      if (!this.checkSalesman()) {
        return false
      }
      if (this.multipleSelection[0].orderStatus === '14') {
        this.$message({
          message: '不能操作已取消的订单',
          type: 'error'
        })
        return false
      }
      this.$tool.confirm(this, '签出', () => {
        this.$tool.common(this, 'order/checkout', {
          'orderNo': this.multipleSelection[0].id
        }, bodyInfo => {
          this._loadMainList()
        })
      })
    },
    // 提交审核
    submissionAudit() {
//    if (!this.checkSalesman()) return false
      if (this.multipleSelection[0].orderStatus === '1') {
          this.$message({
            type: 'error',
            message: '只能操作待审核状态的订单'
          })
          return false
      }
      this.$tool.confirm(this, '提交审核', () => {
        this.$tool.common(this, 'order/toCheck', {
          'orderNo': this.multipleSelection[0].id
        }, bodyInfo => {
          this._loadMainList()
        })
      })
    },
    // 弹出取消订单窗口
    handlePopupOrder() {
    	if (this.multipleSelection[0].orderStatus === '14') {
          this.$message({
            type: 'error',
            message: '不能取消取消状态的订单'
          })
          return false
      }
    	let selectOrderNumber = this.multipleSelection[0].id
      this.$tool.confirm(this, ` 取消订单${selectOrderNumber}`, () => {
        window.setTimeout(() => {
          this.cancelReasonVisible = true
        }, 300)
      })
    },
    // 弹出新建编辑表单
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.form.formTitle = '新建订单'
        this.orderManagementFormVisible = true
      } else {
        const updatedStatus = {
          '0': '冻结',
          '2': '驳回'
        }
        let statusNumber = this.multipleSelection[0].orderStatus
        if (!updatedStatus[statusNumber]) {
          this.$message({
            type: 'error',
            message: '只能修改冻结和驳回状态的订单'
          })
          return false
        }
        if (!this.checkSalesman()) {
          return false
        }
        this.$tool.common(this, 'order/findOrder', {
          'user_name': this.$store.getters.getAccount.name,
          'order_uuid': this.multipleSelection[0].orderUuid
        }, bodyInfo => {
          this.goodsList = bodyInfo.OrderGoodslist.map(item => {
            return {
              row_uuid: this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999),
              // 总的优惠后的价格
              all_price: item.allPrice,
              // 零售价
              retail_price: item.retailPrice,
              // 优惠后的价格
              discount_price: item.discountPrice,
              category_uuid: item.categoryUuid,
              brand_uuid: item.brandUuid,
              goods_uuid: item.goodsUuid,
              goods_name: item.goodsName,
              brand: item.brand,
              model: item.model,
              width: item.width,
              category: item.category,
              weight: item.oneWeight,
              supplier: item.supplier,
              cost_price: item.costPrice,
              length: item.length,
              sign: item.sign,
              amount: item.amount,
              discount_rice: item.discountRice,
              all_weight: item.allWeight
            }
          })
          let order = bodyInfo.order
          this.form = Object.assign({}, {
            user_name: this.$store.getters.getAccount.name,
            formTitle: '编辑订单',
            order_uuid: order.OrderUuid,
            store: order.store,
            order_number: order.orderNumber,
            order_type: order.orderType,
            salesman: order.salesman,
            origin_number: order.originNumber,
            online_name: order.onlineName,
            name: order.name,
            phone: order.phone,
            cityArray: order.city,
            addressee: order.addressee,
            telephone: order.telephone,
            address: order.address,
            buyer_remark: order.buyerRemark,
            pay_account: order.payAccount,
            postcode: order.postcode,
            receivable_money: order.receivableMoney,
            postage: order.postage,
            discount_money: order.discountMoney,
            discount: order.discount,
            actual_money: order.actualMoney,
            pay_type: order.payType,
            invoice_type: order.invoiceType,
            invoice_title: order.invoiceTitle,
            invoice_content: order.invoiceContent,
            logistics_mode: order.logisticsMode,
            service_remark: order.serviceRemark
          })
          this.orderManagementFormVisible = true
        })
      }
    },
    // 搜索
	  search () {
	    this._loadMainList()
	  },
    // 同步订单
    refresh() {
      this.filter.store = '全部商店'
      this.filter.fontColor = '颜色标注'
      this.filter.order_status = {
        status: '-1',
        name: '全部订单'
      }
	      this.filter.orderNumber = ''
	      this.filter.onlineName = ''
	      this.filter.serviceRemark = ''
      this._loadMainList()
    },
    // 查询主列表
    _loadMainList() {
      this.$tool.loadList(this, 'order/list', bodyInfo => {
        this.orderList = bodyInfo.apiResult
      }, {
      	'isHistory': 2,
        'storeId': this.filter.store === '全部商店' ? '' : this.filter.store,
        'orderStatus': this.filter.order_status.status === '-1' ? '' : this.filter.order_status.status,
	      'orderNumber': this.filter.orderNumber,
	      'onlineName': this.filter.onlineName,
	      'serviceRemark': this.filter.serviceRemark
      })
    },
    // 查询商店
    queryShop() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.commands = bodyInfo.apiResult
        this.commands.unshift({ storeName: '全部商店', id: 0 })
      })
    },
    // 打开字体颜色管理面板
    openFontColorPanel() {
      this.queryFontColor()
      this.fontColorVisible = true
    },
    // 过滤字体颜色
    filterFontColor(item) {
      return {
        id: item.id,
        name: item.name,
        background_color: item.backgroundColor,
        font_color: item.fontColor,
        italic: item.italic,
        bold: item.bold,
        disable: item.disable,
        editable: false
      }
    },
    // 查询字体颜色列表
    queryFontColor() {
      this.$tool.loadOptions(this, 'fontColor/list', bodyInfo => {
        this.fontColorData = bodyInfo.apiResult.map(this.filterFontColor)
      })
    },
    // 查询字体颜色下拉列表
    queryFontColorDis() {
      this.$tool.loadOptions(this, 'fontColor/list', bodyInfo => {
        this.colorOptions = bodyInfo.apiResult.map(this.filterFontColor)
      })
    },
    // 新建字体颜色
    addFontColor() {
      this.fontColorData.forEach((item, index) => {
        item.editable = false
        item.disable_flag = false
      })
      if (this.fontColorWriteable) {
        this.fontColorData.push(Object.assign({}, this.initFontColor))
        this.fontColorWriteable = false
      } else {
        this.$message({
          message: '操作有误，请先完成添加操作',
          type: 'error'
        })
        this.fontColorData[this.fontColorData.length - 1].editable = true
      }
      this.saveFontColorType = 'add'
    },
    // 更改颜色状态
    updateFontColor(row, event, column) {
      if (!row) return false
      this.saveFontColorType = 'edit'
      this.fontColorData.forEach(item => {
        if (item.id === row.id) {
          item.editable = true
          item.disable_flag = true
        } else {
          item.editable = false
          item.disable_flag = false
        }
      })
      // 当this.fontColorWriteable等于false时认为有提交的表单
      if (!this.fontColorWriteable) {
        if (row.id !== this.fontColorData[this.fontColorData.length - 1].id) {
          this.fontColorData.pop()
          this.fontColorWriteable = true
        } else {
          this.saveFontColorType = 'add'
          row.disable_flag = false
        }
      }
    },
    // 保存字体颜色
    saveFontColor() {
      // this.saveFontColorType默认添加操作 否则编辑操作
      if (this.saveFontColorType === 'add') {
        this.$tool.common(this, 'fontColor/create', this.fontColorData[this.fontColorData.length - 1], bodyInfo => {
          this.queryFontColor()
          this.queryFontColorDis()
          this.fontColorWriteable = true
          this.fontColorVisible = false
        })
      } else {
        let editItem = (this.fontColorData.filter(item => {
          if (item.editable) return true
        }))[0]
        this.$tool.common(this, 'fontColor/fontColor/update', {
        	font_color_uuid: editItem.id,
        	...editItem
        }, bodyInfo => {
          this.queryFontColor()
          this.queryFontColorDis()
          this.fontColorVisible = false
        })
      }
    },
    // 关闭颜色面板
    closeColorPanel() {
      this.fontColorWriteable = true
      this.saveFontColorType = 'add'
      this._loadMainList()
    },
    // 删除字体颜色
    deleteFontColor(scope) {
      let row = scope.row
      let index = scope.$index
      if (!row.id) {
        this.fontColorData.splice(index, 1)
        return
      }
      this.$tool.confirm(this, '删除字体颜色', () => {
        this.$tool.common(this, 'fontColor/delete', {
          fontColorUuids: [row.id]
        }, bodyInfo => {
          this.queryFontColor()
        })
      })
    },
    // 选中颜色列表
    selectedCommand(command) {
      let orderNumbers = this.multipleSelection.map(item => item.id)
      if (orderNumbers.length === 0) {
        this.$message({
          type: 'error',
          message: '操作失败，未选中订单'
        })
        return false
      }
      this.filter.fontColor = command.name
      console.log('command', command)
      this.$tool.common(this, 'order/fontColor', {
        userName: this.$store.getters.getAccount.name,
        orderNumbers: orderNumbers,
        id: command.id
      }, bodyInfo => {
        this._loadMainList()
      })
    },
    // 查询仓库
    queryWarehouse() {
      this.$tool.loadOptions(this, 'warehouse/select', bodyInfo => {
        this.warehouseList = bodyInfo.WarehouseList.map(item => {
          return {
            value: item.warehouseName
          }
        })
      })
    },
    // 查询车间列表
    queryWorkshop() {
      this.$tool.loadOptions(this, 'workshop/list', bodyInfo => {
        this.workshopList = bodyInfo.WorkshopList.map(item => {
          return {
            label: item.workshopName,
            value: {
              workshopName: item.workshopName,
              workshopUuid: item.workshopUuid
            }
          }
        })
      }, {
	      	workshop_name: ''
	      })
    }
  },
  mounted() {
    [this.queryShop, this._loadMainList, this.queryFontColorDis, this.queryWarehouse, this.querySupplier, this.queryWorkshop].forEach(f => f())
  },
  destroyed() {
    this.$store.commit('selected', {})
    window.clearTimeout(this.timer)
  }
}
</script>
<style lang="scss">
.split-row {
  margin-top: 20px;
}
.color-panel {
  width: 960px;
}
.el-table {
  .el-input--mini .el-input__inner {
    text-align: center;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}

.el-color-picker__trigger {
  border: none !important;
}
.order-management {
  .more-btn {
    margin-left: 15px;
    vertical-align: bottom;
  }
  .cancel-reason {
    width: 420px;
  }
  .cancel-footer {
    margin-top: 60px;
  }
}
.order-row {
  text-align: center;
  margin-top: 60px;
  .el-button+.el-button {
    margin-left: 20px;
  }
}

.el-icon-caret-bottom.readonly:before {
  content: ''
}
</style>
