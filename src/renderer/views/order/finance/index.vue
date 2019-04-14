<template>
	<div class="order-finance">
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
			<el-input  style="width: 150px;" label="客户网名" v-model="filter.onlineName" placeholder="客户网名"></el-input>
			<el-button type="primary" @click="search" class="mgl10" icon="search">搜索</el-button>
			<el-button type="primary" @click="refresh" class="mgl10"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
			<el-button type="primary" @click="submissionAudit" :disabled="multipleSelection.length !== 1" class="mgl10"><i class="iconfont icon-tongguo"></i>提交审核</el-button>
			<el-button type="danger" :disabled="multipleSelection.length !== 1" @click="$tool.updateOrderStatus(_self, '2', '驳回订单')"><i class="iconfont icon-qianchu1"></i>驳回</el-button>
			<el-button type="primary" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-qianru1"></i>订单收款</el-button>
      		<el-button type="primary" @click="drawInvoice" :disabled="multipleSelection.length !== 1"><i class="iconfont"></i>开发票</el-button>
			<el-button type="primary" @click="checkIn" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-qianru1"></i>签入</el-button>
      		<el-button type="primary" @click="checkOut" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-qianchu1"></i>签出</el-button>
		</div>
		<div class="table-wrapper">
			<el-table :data="orderList" v-loading="loading" ref="orderList" style="width: 100%" highlight-current-row @current-change="selected" @selection-change="handleSelectionChange" max-height="523" :row-style="setRowStyle">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" label="序号" width="70" align="center">
				</el-table-column>
				<el-table-column prop="orderNumber" label="订单号" align="center" width="180">
				</el-table-column>
				<el-table-column prop="store" label="店铺名称" align="center">
				</el-table-column>
				<el-table-column label="订单状态" :formatter="$formatter.formatOrderStatus" align="center">
				</el-table-column>
				<el-table-column prop="onlineName" label="客户网名" align="center">
				</el-table-column>
				<el-table-column prop="addressee" label="收件人" align="center">
				</el-table-column>
				<el-table-column prop="phone" label="手机" align="center">
				</el-table-column>
				<el-table-column prop="goodsNumber" label="货品总量" align="center">
				</el-table-column>
				<el-table-column prop="actualMoney" label="总价" align="center">
				</el-table-column>
				<el-table-column prop="orderDatetime" label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" align="center">
				</el-table-column>
				<el-table-column prop="payDatetime" label="付款时间" :formatter="$formatter.formatTime('payDatetime')" align="center">
				</el-table-column>
				<el-table-column prop="receivableMoney" label="实付金额" align="center">
				</el-table-column>
			</el-table>
		</div>
		<div class="toolbar clearfix">
			<el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<el-dialog custom-class="finance-form" :title="formTitle" :visible.sync="formVisible" :before-close="handleClose">
	      	<finance-form :formTitle="formTitle" orignalNumber="11223" ref="financeForm"></finance-form>
	    </el-dialog>
		<!-- 底部辅助表格 -->
		<auxiliary-table type="financeAudit"></auxiliary-table>
	</div>
</template>
<script>
	import AuxiliaryTable from '@/components/AuxiliaryTable'
	import FinanceForm from './form'
	import mixin from '@/mixins'
	
	export default {
	  name: 'order-finance',
	  components: {
	    [AuxiliaryTable.name]: AuxiliaryTable,
	    [FinanceForm.name]: FinanceForm
	  },
	  data() {
	    return {
	      // 定时标志
	      _self: this,
	      formTitle: '新建发票',
	      formVisible: false,
	      fontColorData: [],
	      colorOptions: [],
	      goodsList: [],
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
	        onlineName: ''
	      },
	      tabs: {
	        'active_name': 'detail'
	      },
	      /* ===========对话框状态开始 =============== */
	      fontColorVisible: false,
	      /* ===========对话框状态结束 =============== */
	      loading: false,
	      fontColorWriteable: true,
	      saveFontColorType: 'add',
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
	  mixins: [mixin],
	  watch: {},
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
	    // 设置表格每一行的样式
	    setRowStyle(row, index) {
	      return 'background-color:' + row.backgroundColor + ';color:' + row.fontColor + ';font-weight:' + row.bold + ';font-style:' + row.italic
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
	    drawInvoice() {
	    	this.formVisible = true
	    },
	    // 关闭页面
	    handleClose(done) {
	      	this.$refs['financeForm'].clearFields()
	      	done()
	    },
	    // 提交审核
    	submissionAudit() {
      		if (!this.checkSalesman()) return false
      		console.log('此接口暂未开发')
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
	    // 关闭特殊符号列表
	    closeExtract() {
	      this.$refs['extract'].resetForm()
	    },
	    closeCancel() {
	      this.$refs['cancel'].resetForm()
	    },
	    // 多选
	    handleSelectionChange(val) {
	      this.multipleSelection = val
	    },
	    // 分页查询
	    handleCurrentChange(val) {
	      this.pagination.pageIndex = val
	      this._loadMainList()
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
	      if (this.$store.getters.getAccount.name !== this.current.salesman) {
	        this.$message({
	          type: 'error',
	          message: '登录账户必须是订单的业务员'
	        })
	        return true
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
	      this.filter.onlineName = ''
	      this._loadMainList()
	    },
	    // 查询主列表
	    _loadMainList() {
	      this.$tool.loadList(this, 'order/list', bodyInfo => {
	        this.orderList = bodyInfo.info
	      }, {
	        'store': this.filter.store === '全部商店' ? '' : this.filter.store,
	        'order_status': this.filter.order_status.status === '-1' ? '' : this.filter.order_status.status,
	        'orderNumber': this.filter.orderNumber,
	        'onlineName': this.filter.onlineName
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
	        this.fontColorData = bodyInfo.info.map(this.filterFontColor)
	      })
	    },
	    // 查询字体颜色下拉列表
	    queryFontColorDis() {
	      this.$tool.loadOptions(this, 'fontColor/list', bodyInfo => {
	        this.colorOptions = bodyInfo.info.map(this.filterFontColor)
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
	      if (this.current.orderStatus === '13') {
	        this.$message({
	          message: '不能操作已取消的订单',
	          type: 'error'
	        })
	        return false
	      }
	      this.$tool.confirm(this, '签入', () => {
	        this.$tool.common(this, 'order/checkin', {
	          'user_name': this.$store.getters.getAccount.name,
	          'order_number': this.current.orderNumber
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
	      if (this.current.orderStatus === '13') {
	        this.$message({
	          message: '不能操作已取消的订单',
	          type: 'error'
	        })
	        return false
	      }
	      this.$tool.confirm(this, '签出', () => {
	        this.$tool.common(this, 'order/checkout', {
	          'user_name': this.$store.getters.getAccount.name,
	          'order_number': this.current.orderNumber
	        }, bodyInfo => {
	          this._loadMainList()
	        })
	      })
	    }
	  },
	  mounted() {
	    [this.queryShop, this._loadMainList, this.queryFontColorDis, this.querySupplier, this.queryBrands].forEach(f => f())
	  },
	  destroyed() {
	    this.$store.commit('selected', {})
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
	
	.order-finance {
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
	
	.finance-form {
	  	width: 1000px;
	  	border-radius: 6px;
	}
</style>