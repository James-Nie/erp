<template>
	<div class="order-management">
		<div class="mgb15">
			<el-dropdown @command="commandOrderStatus" class="mgl10">
				<el-button type="primary">
					{{filter.order_status.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-for="item in orderStatus" :key="item.value.status" :command="item.value">{{item.label}}</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-dropdown @command="handleCommand">
				<el-button type="primary">
					{{filter.store}}<i class="el-icon-caret-bottom el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-for="item in commands" :key="item.id" :command="item.storeName">{{item.storeName}}</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-input  style="width: 150px;" v-model="filter.original_order_number" label="原始单号" placeholder="原始单号"></el-input>
			<el-input  style="width: 150px;" v-model="filter.customer_net_name" label="客户网名" placeholder="客户网名"></el-input>
			<el-button type="primary" @click="research" class="mgl10" icon="search">搜索</el-button>
			<el-button type="primary" @click="resetFilter" class="mgl10" icon="edit">重置</el-button>
			<el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
		</div>
		<div class="table-wrapper">
			<el-table :data="orderList" v-loading="loading" ref="orderList" style="width: 100%" highlight-current-row @current-change="selected" @selection-change="handleSelectionChange" max-height="523" :row-style="setRowStyle">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" label="序号" width="70" align="center">
				</el-table-column>
				<el-table-column prop="id" label="订单号" align="center" width="180">
				</el-table-column>
				<el-table-column prop="store" label="店铺名称" align="center">
				</el-table-column>
				<el-table-column label="订单状态" :formatter="$formatter.formatOrderStatus" align="center">
				</el-table-column>
				<el-table-column prop="onlineName" label="客户网名" align="center">
				</el-table-column>
				<el-table-column prop="addressee" label="收件人" align="center" width="100">
				</el-table-column>
				<el-table-column prop="phone" label="手机" align="center">
				</el-table-column>
				<el-table-column prop="goodsNumber" label="货品总量" align="center" width="100">
				</el-table-column>
				<el-table-column prop="actualMoney" label="总价" align="center" width="100">
				</el-table-column>
				<el-table-column prop="orderDatetime" label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" align="center">
				</el-table-column>
				<el-table-column prop="payDatetime" label="付款时间" :formatter="$formatter.formatTime('payDatetime')" align="center">
				</el-table-column>
				<el-table-column prop="receivableMoney" label="实付金额" align="center" width="100">
				</el-table-column>
			</el-table>
		</div>
		<div class="toolbar clearfix">
			<el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
			</el-pagination>
		</div>
		<!-- 底部辅助表格 -->
		<auxiliary-table type="orderManage"></auxiliary-table>
	</div>
</template>
<script>
	import AuxiliaryTable from '@/components/AuxiliaryTable'
	import mixin from '@/mixins'
	
	export default {
	  name: 'order-history',
	  components: {
	    [AuxiliaryTable.name]: AuxiliaryTable
	  },
	  data() {
	    return {
	      // 定时标志
	      _self: this,
	      fontColorData: [],
	      goodsList: [],
	      loglist: [],
	      warehouseList: [],
	      supplierList: [],
	      brand_options: [],
	      orderStatus: [{
				value: {
					status: '00',
					name: '已完成'
				},
				label: '已完成'
			}, {
				value: {
					status: '14',
					name: '已取消'
				},
				label: '已取消'
			}],
	      filter: {
	        store: '全部商店',
	        order_status: {
	          status: '-1',
	          name: '全部订单'
	        },
	        original_order_number: '',
	        customer_net_name: ''
	      },
	      /* ===========对话框状态开始 =============== */
	      /* ===========对话框状态结束 =============== */
	      loading: false,
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
	      }
	    }
	  },
	  mixins: [mixin],
	  watch: {},
	  methods: {
	    // 设置表格每一行的样式
	    setRowStyle(row, index) {
	      return 'background-color:' + row.backgroundColor + ';color:' + row.fontColor + ';font-weight:' + row.bold + ';font-style:' + row.italic
	    },
	    // 导出Excel
	    exportExcel() {
	      this.$tool.exportExcel(this, 'export/OrderExcelport')
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

	    // 选择店铺
	    handleCommand(command) {
	      this.filter.store = command
	      this._loadMainList()
	    },
	    // 选择系统状态
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
	    // 搜索
	    research() {
	      this._loadMainList()
	    },
	    resetFilter() {
	    	this.filter.store = '全部商店'
	      	this.filter.order_status = {
	        	status: '-1',
	        	name: '全部订单'
	      	}
	      	this.filter.original_order_number = ''
	      	this.filter.customer_net_name = ''
	      	this._loadMainList()
	    },
	    // 查询主列表
	    _loadMainList() {
	      this.$tool.loadList(this, 'order/list', bodyInfo => {
	        this.orderList = bodyInfo.info
	      }, {
	      	'isHistory': 1,
	        'store': this.filter.store === '全部商店' ? '' : this.filter.store,
	        'orderStatus': this.filter.order_status.status === '-1' ? '' : this.filter.order_status.status,
	        'originalOrderNo': this.filter.original_order_number,
	        'onlineName': this.filter.customer_net_name
	      })
	    },
	    // 查询商店
	    queryShop() {
	      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
	        this.commands = bodyInfo.apiResult
        	this.commands.unshift({ storeName: '全部商店', id: 0 })
	      })
	    }
	  },
	  mounted() {
	    [this.queryShop, this._loadMainList].forEach(f => f())
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