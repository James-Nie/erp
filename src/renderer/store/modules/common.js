const state = {
	current: {},
	dateTime: '',
	orderStatus: [{
		value: {
			status: '',
			name: '全部订单'
		},
		label: '全部订单'
	}, {
		value: {
			status: '0',
			name: '新建'
		},
		label: '新建'
	}, {
		value: {
			status: '1',
			name: '待审核'
		},
		label: '待审核'
	}, {
		value: {
			status: '2',
			name: '驳回'
		},
		label: '驳回'
	}, {
		value: {
			status: '3',
			name: '待财审'
		},
		label: '待财审'
	}, {
		value: {
			status: '4',
			name: '财审驳回'
		},
		label: '财审驳回'
	}, {
		value: {
			status: '5',
			name: '审核通过'
		},
		label: '审核通过'
	}, {
		value: {
			status: '6',
			name: '已冻结'
		},
		label: '已冻结'
	}, {
		value: {
			status: '7',
			name: '待生产'
		},
		label: '待生产'
	}, {
		value: {
			status: '8',
			name: '生产中'
		},
		label: '生产中'
	}, {
		value: {
			status: '9',
			name: '待发货'
		},
		label: '待发货'
	}, {
		value: {
			status: '10',
			name: '已发货'
		},
		label: '已发货'
	}, {
		value: {
			status: '90',
			name: '已完成'
		},
		label: '已完成'
	}, {
		value: {
			status: '91',
			name: '取消'
		},
		label: '取消'
	}],
	sellerFlag: [{
		label: '全部标旗',
		id: '0'
	},
	{
		label: '红旗',
		id: '1'
	},
	{
		label: '黄旗',
		id: '2'
	},
	{
		label: '绿旗',
		id: '3'
	},
	{
		label: '蓝旗',
		id: '4'
	},
	{
		label: '紫旗',
		id: '5'
	}],
	productOrderStatus: [{
		label: '待生产',
		id: '0'
	},
	{
		label: '已撤回',
		id: '1'
	},
	{
		label: '待领料',
		id: '2'
	},
	{
		label: '待打印',
		id: '3'
	},
	{
		label: '已完成',
		id: '90'
	}]
}

const getters = {
  getOrderStatus(state) {
    return state.orderStatus
  },
  getSellerFlag(state) {
    return state.sellerFlag
  },
  getProductOrderStatus(state) {
    return state.productOrderStatus
  }
}

const mutations = {
	selected(state, current) {
		state.current = current
	},
	setDateTime(dateTime) {
		state.dateTime = dateTime
	}
}

export default {
	state,
	mutations,
	getters
}
