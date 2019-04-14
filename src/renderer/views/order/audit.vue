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
			<el-input  style="width: 150px;" label="原始单号" v-model="filter.originalOrderNo" placeholder="请输入原始单号"></el-input>
			<el-input  style="width: 150px;" label="客服备注" v-model="filter.serviceRemark" placeholder="客服备注"></el-input> 
			<el-input  style="width: 150px;" label="客户网名" v-model="filter.onlineName" placeholder="客户网名"></el-input>
			<el-button type="primary" @click="search" class="mgl10" icon="search">搜索</el-button>
			<br/><br/>
			<el-button type="primary" @click="refresh" class="mgl10">抓单</el-button>
			<el-button type="primary" @click="exportExcel">导出</el-button>
			<el-button type="primary" @click="handlePopupProduct('product')" :disabled="multipleSelection.length !== 1">生产开单</el-button>
			<el-button type="primary" @click="handlePopupProduct('transfer')" :disabled="multipleSelection.length !== 1">根带调拨</el-button>
			<el-button type="primary" @click="handlePopupProduct('purchase')" :disabled="multipleSelection.length !== 1">采购开单</el-button>
			<el-button type="danger" :disabled="multipleSelection.length !== 1" @click="$tool.updateOrderStatus(_self, '2', '驳回订单')">驳回</el-button>
			<!-- <el-button type="danger" @click="handlePopupOrder" :disabled="multipleSelection.length !== 1">取消</el-button> -->
			<el-button type="danger" @click="frozenOrder" :disabled="multipleSelection.length !== 1">冻结</el-button>
			<el-button type="danger" :disabled="multipleSelection.length !== 1" @click="thawOrder">解冻</el-button>
			<el-button type="danger" @click="mergeOrder" :disabled="multipleSelection.length < 2">合单</el-button>
			<el-button type="danger" @click="openOrderSplitPanel" :disabled="multipleSelection.length !== 1">拆单</el-button>
			<el-button type="primary" @click="checkIn" :disabled="multipleSelection.length !== 1">签入</el-button>
      		<el-button type="primary" @click="checkOut" :disabled="multipleSelection.length !== 1">签出</el-button>
		</div>
		<div class="table-wrapper">
			<el-table :data="orderList" v-loading="loading" ref="orderList" highlight-current-row @current-change="selected" @selection-change="handleSelectionChange" max-height="523" :row-style="setRowStyle" fit>
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" label="序号" width="70" align="center">
				</el-table-column>
				<el-table-column prop="id" label="订单号" align="center" min-width="160">
				</el-table-column>
				<el-table-column prop="storeName" label="店铺名称" align="center" min-width="160">
				</el-table-column>
				<el-table-column label="订单状态" :formatter="$formatter.formatOrderStatus" align="center" width="100">
				</el-table-column>
				<el-table-column prop="customerNetName" label="客户网名" align="center" min-width="100">
				</el-table-column>
				<el-table-column prop="addressee" label="收件人" align="center" width="80">
				</el-table-column>
				<el-table-column prop="phone" label="手机" align="center">
				</el-table-column>
				<el-table-column prop="goodsNumber" label="货品总量" align="center" width="100">
				</el-table-column>
				<el-table-column prop="actualMoney" label="总价" align="center">
				</el-table-column>
				<el-table-column prop="orderDatetime" label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" align="center" width="160">
				</el-table-column>
				<el-table-column prop="payDatetime" label="付款时间" :formatter="$formatter.formatTime('payDatetime')" align="center" width="160">
				</el-table-column>
				<el-table-column prop="receivableMoney" label="实付金额" align="center" width="100">
				</el-table-column>
			</el-table>
		</div>
		<div class="toolbar clearfix">
			<el-pagination class="fr" layout="total, sizes, prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<!-- 生产开单/采购开单/根带调拨 -->
		<el-dialog :visible.sync="productionOrdersVisible" :title="productDialogTitle" size="full" @close="clearProductOrder">
			<div class="panel-heading">订单信息</div>
			<el-form :model="_self" ref="productionOrder">
				<el-table :data="productionOrderInfo" stripe style="width: 100%" max-height="243">
					<el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
					<el-table-column prop="number" label="货品编码" width="180" align="center">
					</el-table-column>
					<el-table-column prop="goodsName" label="货品名称" width="180" align="center">
					</el-table-column>
					<el-table-column prop="brand" label="品牌" align="center">
					</el-table-column>
					<el-table-column prop="model" label="规格" align="center">
					</el-table-column>
					<el-table-column prop="length" label="长度(mm)" align="center">
					</el-table-column>
					<el-table-column prop="category" label="分类" align="center">
					</el-table-column>
					<el-table-column prop="supplier" label="供应商" align="center" v-if="productDialogType !== 'product'">
					</el-table-column>
					<el-table-column prop="stockAmount" label="可用库存" align="center" v-if="productDialogType !== 'product'">
					</el-table-column>
					<el-table-column prop="amount" label="数量" align="center">
					</el-table-column>
					<el-table-column label="调拨品牌" align="center" v-if="productDialogType === 'transfer'">
						<template slot-scope="scope">
							<el-form-item :prop="'productionOrderInfo['+ scope.$index +'].transferBrand.label'" :rules="{ required: true, message: '请选择调拨品牌', trigger: 'change' }" :show-message="true">
					      		<el-select v-model="scope.row.transferBrand" placeholder="请选择" class="w100" size="mini">
					        		<el-option v-for="item in brand_options" :key="item.value" :label="item.label" :value="item"></el-option>
					      		</el-select>
					    	</el-form-item>
						</template>
					</el-table-column>
					<el-table-column label="拆分数量" align="center" v-if="productDialogType !== 'transfer'" key='splitNumber'>
						<template slot-scope="scope">
							<el-form-item :prop="'productionOrderInfo['+ scope.$index +'].splitNumber'" :rules="{ validator: validateSplitNumber(scope.row.amount), trigger: 'blur' }" :show-message="true">
								<el-input v-model="scope.row.splitNumber" size="mini" class="w100" placeholder="小于数量"></el-input>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column label="调拨数量" align="center" v-if="productDialogType === 'transfer'">
						<template slot-scope="scope">
							<el-form-item :prop="'productionOrderInfo['+ scope.$index +'].transferNumber'" :rules="{ validator: validateSplitNumber(scope.row.amount), trigger: 'blur' }" :show-message="true">
								<el-input v-model="scope.row.transferNumber" size="mini" class="w100" placeholder="小于数量"></el-input>
							</el-form-item>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<div class="order-row">
				<el-button class="w100 circle-btn" type="primary" @click="makeProductOrder('productionOrder')">添加</el-button>
			</div>
			<div class="panel-heading">{{productDialogHead}}</div>
			<el-form :model="_self" ref="productionGoodsInfo">
				<el-table :data="productionGoodsList" stripe style="width: 100%" max-height="243">
					<el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
					<el-table-column prop="number" label="货品编码" width="180" align="center">
					</el-table-column>
					<el-table-column prop="goodsName" label="货品名称" width="180" align="center">
					</el-table-column>
					<el-table-column prop="brand" label="品牌" align="center">
					</el-table-column>
					<el-table-column prop="model" label="规格" align="center">
					</el-table-column>
					<el-table-column prop="length" label="长度(mm)" align="center">
					</el-table-column>
					<el-table-column label="生产备注" align="center" v-if="productDialogType === 'product'">
						<template slot-scope="scope">
							<el-input size="mini" v-model="scope.row.productRemark" class="w100" placeholder="生产备注"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="category" label="分类" align="center" v-if="productDialogType !== 'product'">
					</el-table-column>
					<el-table-column prop="supplier" label="供应商" align="center" v-if="productDialogType !== 'product'">
					</el-table-column>
					<el-table-column prop="transferBrand.label" label="调拨品牌" align="center" v-if="productDialogType === 'transfer'">
					</el-table-column>
					<el-table-column prop="transferNumber" label="调拨数量" align="center" v-if="productDialogType === 'transfer'">
					</el-table-column>
					<el-table-column label="车间组" align="center" v-if="productDialogType === 'product'">
						<template slot-scope="scope">
							<el-form-item :prop="'productionGoodsList['+ scope.$index +'].workshopItem'" :rules="{ validator: validateWorkshop, trigger: 'change' }" :show-message="true">
								<el-select v-model="scope.row.workshopItem" placeholder="请选择" size="mini" class="w100" value-key="workshopUuid">
									<el-option v-for="item in workshopList" :key="item.value.workshopUuid" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column label="根带调拨" align="center" v-if="productDialogType === 'product'">
						<template slot-scope="scope">
							<el-form-item :prop="'productionGoodsList['+ scope.$index +'].transferBrandId'">
					      		<el-select v-model="scope.row.transferBrandId" placeholder="请选择" class="w100" size="mini">
					        		<el-option v-for="item in brand_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					      		</el-select>
					    	</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="splitNumber" label="生产数量" align="center" v-if="productDialogType !== 'transfer'">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="deleteProductionRow(scope)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<div class="order-row">
				<el-button class="circle-btn" @click="productionOrdersVisible = false">取消</el-button>
				<el-button class="circle-btn" type="primary" @click="deliveryOrder('productionGoodsInfo')" v-if="productDialogType === 'product'">下达</el-button>
				<el-button class="circle-btn" type="primary" @click="deliveryOrder('productionGoodsInfo')" v-if="productDialogType === 'purchase'">递交</el-button>
				<el-button class="circle-btn" type="primary" @click="deliveryOrder('productionGoodsInfo')" v-if="productDialogType === 'transfer'">提交</el-button>
			</div>
		</el-dialog>
		<!-- 订单拆分 -->
		<el-dialog :visible.sync="orderSplitVisible" title="订单拆分" size="full" @close="clearOrderList">
			<div class="panel-heading">主订单信息</div>
			<el-form :model="_self" ref="oldGoodsInfo">
				<el-table :data="oldOrder.old_goods_list" stripe style="width: 100%" max-height="243">
					<el-table-column type="index" label="序号" width="70" align="center">
					</el-table-column>
					<el-table-column prop="orderNumber" label="主订单号" width="180" align="center">
					</el-table-column>
					<el-table-column prop="brand" label="品牌" align="center">
					</el-table-column>
					<el-table-column prop="model" label="规格" align="center">
					</el-table-column>
					<el-table-column prop="length" label="长度(mm)" align="center">
					</el-table-column>
					<el-table-column prop="width" label="宽度(mm)" align="center">
					</el-table-column>
					<el-table-column prop="category" label="分类" align="center">
					</el-table-column>
					<el-table-column prop="supplier" label="供应商" align="center">
					</el-table-column>
					<el-table-column prop="retailPrice" label="原价(米/元)" align="center">
					</el-table-column>
					<el-table-column prop="amount" label="数量" align="center">
					</el-table-column>
					<el-table-column prop="discountPrice" label="优惠价(米/元)" align="center">
					</el-table-column>
					<el-table-column prop="weight" label="单重(kg)" align="center">
					</el-table-column>
					<el-table-column label="总重(kg)" align="center" :formatter="formatAllWeight">
					</el-table-column>
					<el-table-column label="总价(元)" align="center" :formatter="formatAllPrice">
					</el-table-column>
					<el-table-column label="拆分数量" align="center">
						<template slot-scope="scope">
							<el-form-item :prop="'oldOrder.old_goods_list['+ scope.$index +'].splitNumber'" :rules="{ validator: validateSplitNumber(scope.row.amount), trigger: 'blur' }" :show-message="true">
								<el-input v-model="scope.row.splitNumber" size="mini" class="w100" placeholder="小于数量"></el-input>
							</el-form-item>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<el-form :inline="true" :model="oldOrder" class="split-row">
				<el-form-item label="合计金额">
					<el-input v-model="oldOrder.receivable_money_one" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="优惠金额">
					<el-input v-model="oldOrder.discount_money_one" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="应收金额">
					<el-input v-model="oldOrder.actual_money_one" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="circle-btn w100" @click="createNewOrder('oldGoodsInfo')">生成新订单</el-button>
				</el-form-item>
			</el-form>
			<div class="panel-heading">新订单信息</div>
			<el-form :model="_self" ref="newGoodsInfo">
				<el-table :data="newOrder.goods_list" stripe style="width: 100%" align="center" max-height="243">
					<el-table-column type="index" label="序号" width="70">
					</el-table-column>
					<el-table-column prop="new_order_number" label="子订单号" align="center" width="180">
					</el-table-column>
					<el-table-column prop="brand" label="品牌" align="center">
					</el-table-column>
					<el-table-column prop="model" label="规格" align="center">
					</el-table-column>
					<el-table-column prop="length" label="长度(m)" align="center">
					</el-table-column>
					<el-table-column prop="width" label="宽度(m)" align="center">
					</el-table-column>
					<el-table-column prop="category" label="分类" align="center">
					</el-table-column>
					<el-table-column prop="address" label="所在仓库" align="center">
						<template slot-scope="scope">
							<el-form-item :prop="'newOrder.goods_list['+ scope.$index +'].warehouse'" :rules="{ required: true, message: '请选择发料仓库', trigger: 'change' }" :show-message="true">
								<el-select v-model="scope.row.warehouse" placeholder="请选择" size="mini" class="w100">
									<el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="supplier" label="供应商" align="center">
					</el-table-column>
					<el-table-column prop="retailPrice" label="原价" align="center">
					</el-table-column>
					<el-table-column prop="discountPrice" label="优惠价" align="center">
					</el-table-column>
					<el-table-column prop="amount" label="数量" align="center">
					</el-table-column>
					<el-table-column prop="weight" label="单重(kg)" align="center">
					</el-table-column>
					<el-table-column label="总重(kg)" align="center" :formatter="formatAllWeight">
					</el-table-column>
					<el-table-column label="总价(元)" align="center" :formatter="formatAllPrice">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="deleteNewOrderRow(scope)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<el-form :inline="true" :model="newOrder" class="split-row">
				<el-form-item label="合计金额">
					<el-input v-model="newOrder.receivable_money_two" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="优惠金额">
					<el-input v-model="newOrder.discount_money_two" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="应收金额">
					<el-input v-model="newOrder.actual_money_two" :disabled="true"></el-input>
				</el-form-item>
			</el-form>
			<div class="order-row">
				<el-button class="circle-btn" @click="orderSplitVisible = false">取消</el-button>
				<el-button type="primary" class="circle-btn" @click="splitOrder('newGoodsInfo')">保存</el-button>
			</div>
		</el-dialog>
		<!-- 底部辅助表格 -->
		<auxiliary-table type="orderManage"></auxiliary-table>
	</div>
</template>
<script>
	import AuxiliaryTable from '@/components/AuxiliaryTable'
	import EditShortcuts from './edit-shortcuts'
	import EditReason from './edit-reason'
	import CancelReason from './cancel-reason'
	import ExtractSettings from './extract-settings'
	import mixin from '@/mixins'
	
	export default {
	  name: 'order-audit',
	  components: {
	    [AuxiliaryTable.name]: AuxiliaryTable,
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
	      brand_options: [],
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
	        originalOrderNo: '',
	        onlineName: '',
	        serviceRemark: ''
	      },
	      tabs: {
	        'active_name': 'detail'
	      },
	      /* ===========对话框状态开始 =============== */
	      fontColorVisible: false,
	      cancelReasonVisible: false,
	      editReasonVisible: false,
	      productionOrdersVisible: false,
	      orderSplitVisible: false,
	      productDialogType: '', // 弹出框类型
	      productDialogTitle: '', // 弹出框标题
	      productDialogHead: '',
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
	      }],
	      rules: {
        	store: { required: true, message: '请选择店铺', trigger: 'change' }
	      }
	    }
	  },
	  mixins: [mixin],
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
	        // this.cancelReasonVisible = false
	        // this.editReasonVisible = false
	        // this.productionOrdersVisible = false
	        // this.orderSplitVisible = false
	      },
	      deep: true
	    },
	    'oldOrder.old_goods_list': {
	      handler() {
	        // 合计金额
	        let receivableMoney = 0
	        // 应收金额
	        let actualMoney = 0
	        this.oldOrder.old_goods_list.map(item => {
	          receivableMoney += parseFloat(item.discountPrice * item.amount * item.length)
	          actualMoney += parseFloat(item.all_price)
	        })
	        // 主订单合计金额
	        this.oldOrder.receivable_money_one = parseFloat(receivableMoney.toFixed(2))
	        this.oldOrder.actual_money_one = parseFloat(actualMoney.toFixed(2))
	        this.oldOrder.discount_money_one = parseFloat((receivableMoney - actualMoney).toFixed(2))
	      },
	      deep: true
	    },
	    'newOrder.goods_list': {
	      handler() {
	        // 合计金额
	        let receivableMoney = 0
	        // 应收金额
	        let actualMoney = 0
	        this.newOrder.goods_list.map(item => {
	          receivableMoney += parseFloat(item.discountPrice * item.amount * item.length)
	          actualMoney += parseFloat(item.all_price)
	        })
	        // 主订单合计金额
	        this.newOrder.receivable_money_two = parseFloat(receivableMoney.toFixed(2))
	        this.newOrder.actual_money_two = parseFloat(actualMoney.toFixed(2))
	        this.newOrder.discount_money_two = parseFloat((receivableMoney - actualMoney).toFixed(2))
	      },
	      deep: true
	    },
	    productDialogType: {
	    	handler() {
	    		switch (this.productDialogType) {
				case 'product':
				  this.productDialogTitle = '生产开单'
				  this.productDialogHead = '生产单信息'
				  break
				case 'transfer':
				  this.productDialogTitle = '根带调拨'
				  this.productDialogHead = '调拨信息'
				  break
				case 'purchase':
				  this.productDialogTitle = '采购开单'
				  this.productDialogHead = '采购单信息'
				  break
				default:
				  this.productDialogTitle = ''
				}
	    	}
	    }
	  },
	  methods: {
	    notification(message) {
	      const h = this.$createElement
	      this.$notify({
	        title: '系统通知',
	        message: h('i', {
	          style: 'color: teal'
	        }, message)
	      })
	    },
	    // 生产单信息删除一行
	    deleteProductionRow(scope) {
	      	this.productionGoodsList.splice(scope.$index, 1)
	      	let flag = true
	      	let splitNumber
	      	let it = {
	          	allPrice: scope.row.allPrice,
		        allWeight: scope.row.allWeight,
		        orderNumber: scope.row.orderNumber,
		        number: scope.row.number,
		        model: scope.row.model,
		        length: scope.row.length,
		        width: scope.row.width,
		        category: scope.row.category,
		        categoryUuid: scope.row.categoryUuid,
		        supplier: scope.row.supplier,
		        brand: scope.row.brand,
		        brandUuid: scope.row.brandUuid,
		        goodsUuid: scope.row.goodsUuid,
		        goodsName: scope.row.goodsName,
		        orderGoodsUuid: scope.row.orderGoodsUuid,
		        costPrice: scope.row.costPrice,
		        discountPrice: scope.row.discountPrice,
		        sign: scope.row.sign,
		        oneWeight: scope.row.oneWeight,
		        stockAmount: scope.row.stockAmount
	        }
	      	switch (this.productDialogType) {
			case 'product':
				splitNumber = scope.row.splitNumber
				it['amount'] = scope.row.splitNumber
				it['splitNumber'] = scope.row.splitNumber
				break
			case 'transfer':
				splitNumber = scope.row.transferNumber
				it['amount'] = scope.row.transferNumber
				it['transferNumber'] = scope.row.transferNumber
				it['transferBrand'] = scope.row.transferBrand
				break
			case 'purchase':
				splitNumber = scope.row.splitNumber
				it['amount'] = scope.row.splitNumber
				it['splitNumber'] = scope.row.splitNumber
				break
			}
	      	this.productionOrderInfo.forEach(item => {
	        	if (item.orderGoodsUuid === scope.row.orderGoodsUuid) {
	          	item.amount += parseInt(splitNumber)
	          	flag = false
	        	}
	      	})
	      	if (flag) {
	        	this.productionOrderInfo.push(it)
	      	}
	    },
	    deleteNewOrderRow(scope) {
	      this.newOrder.goods_list.splice(scope.$index, 1)
	      let flag = true
	      this.oldOrder.old_goods_list.forEach(item => {
	        if (item.orderGoodsUuid === scope.row.orderGoodsUuid) {
	          item.amount += parseFloat(scope.row.amount)
	          flag = false
	        }
	      })
	      if (flag) {
	        let row = scope.row
	        this.oldOrder.old_goods_list.push({
	          retailPrice: row.retailPrice,
	          discountPrice: row.discountPrice,
	          orderNumber: row.orderNumber,
	          model: row.model,
	          length: row.length,
	          width: row.width,
	          category: row.category,
	          brand: row.brand,
	          supplier: row.supplier,
	          amount: row.amount,
	          weight: row.weight,
	          orderGoodsUuid: row.orderGoodsUuid,
	          splitNumber: '',
	          all_price: '',
	          all_weight: ''
	        })
	      }
	    },
	    // 设置表格每一行的样式
	    setRowStyle(row, index) {
	      return 'background-color:' + row.backgroundColor + ';color:' + row.fontColor + ';font-weight:' + row.bold + ';font-style:' + row.italic
	    },
	    // 拆分订单
	    splitOrder(formName) {
	      if (this.oldOrder.old_goods_list.length === 0) {
	        this.$message({
	          'message': '主订单数据不能为空',
	          'type': 'error'
	        })
	        return
	      }
	      if (this.newOrder.goods_list.length === 0) {
	        this.$message({
	          'message': '新订单数据不能为空',
	          'type': 'error'
	        })
	        return
	      }
	      this.$refs[formName].validate(valid => {
	        if (valid) {
	          this.$tool.common(this, 'order/split', {
	            'user_name': this.$store.getters.getAccount.name,
	            'order_number': this.multipleSelection[0].orderNumber,
	            ...this.oldOrder,
	            ...this.newOrder
	          }, bodyInfo => {
	            this.orderSplitVisible = false
	            this._loadMainList()
	          })
	        }
	      })
	    },
	    // 生成生产单/采购单/调拨单信息
	    makeProductOrder(formName) {
	      this.$refs[formName].validate(valid => {
	        if (valid) {
	          let arr = []
	          let indexArray = []
	          this.productionOrderInfo.forEach((item, index) => {
	            let it = {
		            productionUuid: this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999),
		            allPrice: item.allPrice,
		            allWeight: item.allWeight,
		            amount: item.amount,
		            orderNumber: item.orderNumber,
		            number: item.number,
		            model: item.model,
		            length: item.length,
		            width: item.width,
		            category: item.category,
		            categoryUuid: item.categoryUuid,
		            supplier: item.supplier,
		            brand: item.brand,
		            brandUuid: item.brandUuid,
		            goodsUuid: item.goodsUuid,
		            goodsName: item.goodsName,
		            orderGoodsUuid: item.orderGoodsUuid,
		            costPrice: item.costPrice,
		            discountPrice: item.discountPrice,
		            sign: item.sign,
		            oneWeight: item.oneWeight,
		            stockAmount: item.stockAmount
	            }
	            if (this.productDialogType === 'product') {
	          		it['splitNumber'] = item.splitNumber
	          		it['productRemark'] = ''
	          		it['transferBrandId'] = ''
	          		item.amount = item.amount - item.splitNumber
	            	item.splitNumber = ''
	          	} else if (this.productDialogType === 'transfer') {
	          		it['transferBrand'] = item.transferBrand
	          		it['transferNumber'] = item.transferNumber
	          		item.amount = item.amount - item.transferNumber
	            	item.transferNumber = ''
	          	} else if (this.productDialogType === 'purchase') {
	          		it['splitNumber'] = item.splitNumber
	          		item.amount = item.amount - item.splitNumber
	            	item.splitNumber = ''
	          	}
	            arr.push(it)
	            if (item.amount === 0) {
	                indexArray.push(index)
	            }
	          })
	          this.productionOrderInfo = this.productionOrderInfo.filter((item, index) => {
	            if (!indexArray.includes(index)) {
	              return true
	            }
	          })
	          this.productionGoodsList = this.productionGoodsList.concat(arr)
	        }
	      })
	    },
	    // 生成的新订单
	    createNewOrder(formName) {
	      if (!this.newOrder.new_order_number) {
	        this.newOrder.new_order_number = this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999)
	      }
	      this.$refs[formName].validate(valid => {
	        if (valid) {
	          let arr = []
	          let indexArray = []
	          this.oldOrder.old_goods_list.forEach((item, index) => {
	            if (item.splitNumber <= item.amount && item.splitNumber > 0) {
	              arr.push({
	                new_order_number: this.newOrder.new_order_number,
	                orderNumber: item.orderNumber,
	                weight: item.weight,
	                address: '',
	                allocation: '',
	                amount: item.splitNumber,
	                model: item.model,
	                length: item.length,
	                width: item.width,
	                category: item.category,
	                supplier: item.supplier,
	                brand: item.brand,
	                discountPrice: item.discountPrice,
	                retailPrice: item.retailPrice,
	                all_price: '',
	                all_weight: '',
	                orderGoodsUuid: item.orderGoodsUuid
	              })
	              item.amount = item.amount - item.splitNumber
	              item.splitNumber = ''
	              if (item.amount === 0) {
	                indexArray.push(index)
	              }
	            }
	          })
	          this.oldOrder.old_goods_list = this.oldOrder.old_goods_list.filter((item, index) => {
	            if (!indexArray.includes(index)) {
	              return true
	            }
	          })
	          this.newOrder.goods_list = this.newOrder.goods_list.concat(arr)
	        }
	      })
	    },
	    // 校验分组
	    validateWorkshop(rule, value, callback) {
	      if (this.$tool.isEmptyObject(value)) {
	        callback(new Error('分组不能为空'))
	      } else {
	        callback()
	      }
	    },
	    // 校验数量
	    validateSplitNumber(amount) {
	      return (rule, value, callback) => {
	      	if (!value) {
	      		console.log('空空空')
	      		callback(new Error('格式不正确'))
	      	}
	        if ((/^\d+$/.test(value) && parseInt(value) <= parseInt(amount) && parseInt(value) > 0) && value !== '') {
	          callback()
	        } else {
	          callback(new Error('格式不正确'))
	        }
	      }
	    },
	    // 查询供应商
	    querySupplier() {
	      this.$tool.loadOptions(this, 'supplier/list', bodyInfo => {
	        this.supplierList = bodyInfo.apiResult.map(item => ({
	          value: item.name
	        }))
	      })
	    },
	    // 弹出生产开单/采购开单/根带调拨
	    handlePopupProduct(type) {
	      this.productDialogType = type
	      if (!this.checkSalesman()) {
	        return false
	      }
	      const status = {
	        '1': '待审核'
	      }
	      if (!status[this.multipleSelection[0].orderStatus]) {
	        this.$message({
	          type: 'error',
	          message: '只能操作状态为待审核的订单'
	        })
	        return false
	      }
	      this.queryGoods().then(res => {
	      	switch (type) {
			case 'product':
				this.productionOrderInfo = res.data.body.OrderGoodsList.map(item => ({
	          		splitNumber: '',
	          		...item
	        	}))
				break
	        case 'purchase':
				this.productionOrderInfo = res.data.body.OrderGoodsList.map(item => ({
	          		splitNumber: '',
	          		...item
	        	}))
	        	break
	        case 'transfer':
				this.productionOrderInfo = res.data.body.OrderGoodsList.map(item => ({
	          		transferNumber: '',
	          		transferBrand: {
	          			value: '',
	          			label: ''
	          		},
	          		...item
	        	}))
	        	break
	      	}
	      	console.log(122, this.productionOrderInfo)
	        this.productionOrdersVisible = true
	      })
	    },
	    // 导出Excel
	    exportExcel() {
	      this.$tool.exportExcel(this, 'export/OrderExcelport')
	    },
	    // 合并订单
	    mergeOrder() {
	      let message = []
	      this.multipleSelection.forEach((item) => {
	        message.push('订单' + item.orderNumber)
	      })
	      message = '将' + message.join('，') + '合并'
	      this.$tool.confirm(this, message, () => {
	        let orderUuids = this.multipleSelection.map(item => item.orderUuid)
	        this.$tool.common(this, 'order/merge', {
	          'order_uuids': orderUuids
	        }, bodyInfo => {
	          this._loadMainList()
	        })
	      })
	    },
	    // 清空生产单信息
	    clearProductOrder() {
	      this.productionGoodsList = []
	      this.productionOrderInfo = []
	    },
	    clearOrderList() {
	      // 原始订单
	      this.oldOrder = {
	        receivable_money_one: '',
	        discount_money_one: '',
	        actual_money_one: '',
	        old_goods_list: []
	      }
	      // 拆单后订单
	      this.newOrder = {
	        receivable_money_two: '',
	        discount_money_two: '',
	        actual_money_two: '',
	        goods_list: []
	      }
	    },
	    // 格式化总重量
	    formatAllWeight(row, column) {
	      row.all_weight = parseFloat((row.amount * row.weight * row.length).toFixed(2))
	      return row.all_weight
	    },
	    // 格式化总价
	    formatAllPrice(row, column) {
	      row.all_price = parseFloat((row.amount * row.discountPrice * row.length).toFixed(2))
	      return row.all_price
	    },
	    // 关闭编辑理由列表
	    closeEditReason() {
	      this.$refs['editReason'].resetForm()
	      window.setTimeout(() => {
	        this.cancelReasonVisible = true
	      }, 300)
	    },
	    // 下单生产单
	    deliveryOrder(formName) {
	      if (this.productionOrderInfo.length > 0) {
	        this.$message({
	          type: 'error',
	          message: '订单信息没有完全拆分'
	        })
	        return false
	      }
	      if (this.productionGoodsList.length === 0) {
	        this.$message({
	          type: 'error',
	          message: '生产单信息不能为空'
	        })
	        return false
	      }
	      this.$refs[formName].validate(valid => {
	        let productionGoodsList
	        let relativePath = ''
	        switch (this.productDialogType) {
			case 'product':
				relativePath = 'order/createProduct'
				productionGoodsList = this.productionGoodsList.map(item => {
	          		return {
	            		workshopUuid: item.workshopUuid,
	            		workshopName: item.workshopName,
	            		...item,
	            		...item.workshopItem
	          		}
	        	})
				break
	        case 'purchase':
	        	relativePath = 'order/createProduct'
				productionGoodsList = this.productionGoodsList.map(item => {
	          		return {
	            		...item
	          		}
	        	})
	        	break
	        case 'transfer':
	        	relativePath = 'productTransfer/save'
				productionGoodsList = this.productionGoodsList.map(item => {
	          		return {
			            allPrice: item.allPrice,
			            allWeight: item.allWeight,
			            amount: item.amount,
			            orderNumber: item.orderNumber,
			            number: item.number,
			            model: item.model,
			            length: item.length,
			            width: item.width,
			            category: item.category,
			            categoryUuid: item.categoryUuid,
			            supplier: item.supplier,
			            brand: item.brand,
			            brandUuid: item.brandUuid,
			            goodsUuid: item.goodsUuid,
			            goodsName: item.goodsName,
			            orderGoodsUuid: item.orderGoodsUuid,
			            costPrice: item.costPrice,
			            discountPrice: item.discountPrice,
			            sign: item.sign,
			            oneWeight: item.oneWeight,
			            transferBrandId: item.transferBrand.value,
			            transferNumber: item.transferNumber
	            	}
	        	})
	        	break
	      	}
	        if (valid) {
	          this.$tool.common(this, relativePath, {
	            'user_name': this.$store.getters.getAccount.name,
	            'order_number': this.multipleSelection[0].orderNumber,
	            'goods_list': productionGoodsList
	          }, bodyInfo => {
	            this.productionOrdersVisible = false
	            this._loadMainList()
	          })
	        }
	      })
	    },
	    // 打开订单拆分面板
	    openOrderSplitPanel() {
	      if (!this.checkSalesman()) {
	        return false
	      }
	      if (this.multipleSelection[0].orderStatus !== '1') {
	        this.$message({
	          message: '只能拆分状态为待审核的订单',
	          type: 'error'
	        })
	        return false
	      }
	      // 查询订单货品列表
	      this.queryGoods().then(res => {
	        this.oldOrder.old_goods_list = res.data.body.OrderGoodsList.map(item => {
	          return {
	            splitNumber: '',
	            orderGoodsUuid: item.orderGoodsUuid,
	            orderNumber: item.orderNumber,
	            weight: item.oneWeight,
	            brand: item.brand,
	            model: item.model,
	            length: item.length,
	            width: item.width,
	            category: item.category,
	            supplier: item.supplier,
	            retailPrice: item.retailPrice,
	            amount: item.amount,
	            discountPrice: item.discountPrice,
	            all_weight: '',
	            all_price: ''
	          }
	        })
	      })
	      this.orderSplitVisible = true
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
	          order_number: this.current.orderNumber
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
	    // 搜索
	    search () {
	    	this._loadMainList()
	    },
	    // 抓单
	    refresh() {
	      this.filter.store = '全部商店'
	      this.filter.fontColor = '颜色标注'
	      this.filter.order_status = {
	        status: '-1',
	        name: '全部订单'
	      }
	      this.filter.store = '全部商店'
	      this.filter.orderNumber = ''
	      this.filter.originalOrderNo = ''
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
	        'orderNo': this.filter.orderNumber,
	        'originalOrderNo': this.filter.originalOrderNo,
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
	    openFontColorPanel() {
	      this.queryFontColor()
	      this.fontColorVisible = true
	    },
	    filterFontColor(item) {
	      return {
	        font_color_uuid: item.fontColorUuid,
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
	        this.workshopList = bodyInfo.apiResult.map(item => {
	          return {
	            label: item.workshopName,
	            value: {
	              workshopName: item.workshopName,
	              workshopUuid: item.workshopUuid
	            }
	          }
	        }, {
	      	workshop_name: ''
	      })
	      })
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
	          'user_name': this.$store.getters.getAccount.name,
	          'order_number': this.multipleSelection[0].orderNumber
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
	          'user_name': this.$store.getters.getAccount.name,
	          'order_number': this.multipleSelection[0].orderNumber
	        }, bodyInfo => {
	          this._loadMainList()
	        })
	      })
	    }
	  },
	  mounted() {
	    [this.queryShop, this._loadMainList, this.queryFontColorDis, this.queryWarehouse, this.querySupplier, this.queryWorkshop, this.queryBrands].forEach(f => f())
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