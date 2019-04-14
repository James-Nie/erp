const state = {
  // 账户权限
  permissions: JSON.parse(window.sessionStorage.getItem('permissions')) || []
}
const mutations = {
  // 清空权限数组
  clearPermissions(state) {
    state.permissions = []
    window.sessionStorage.removeItem('permissions')
  },
  // 设置权限数组
  setPermissions(state, permissions) {
    state.permissions = permissions
    window.sessionStorage.setItem('permissions', JSON.stringify(permissions))
  }
}

// 权限映射路由表
const routerPermissions = {
  sawManageRead: '/sawblade-management',
  goodsArchiveRead: '/fittings-management',
  codeRead: '/qrcode',
  priceListRead: '/pricelist',
  orderManageRead: '/order-management',
  orderAuditRead: '/order-audit',
  orderOriginalRead: '/order-original',
  orderFinanceRead: '/order-original',
  orderHistoryRead: '/order-history',
  afterSalesRead: ['/after-receivable', '/aftersale-management'],
  namelessPartRead: '/unknown-things',
  financialAuditRead: '/financial-audit',
  returnGoodsManageRead: '/returns-management',
  repairGatheringRead: '/maintenance-statistics',
  deliveryManageRead: '/shipping-management',
  purchaseListManageRead: '/procurement-management',
  supplierManageRead: '/suppliers-management',
  supplierGoodsRead: '/suppliers-goods',
  purchaseListAuditRead: '/procurement-audit',
  stockManageRead: '/stock-management',
  productOrderManageRead: 'product-order-management',
  payableManageRead: '/copewith-management',
  invoiceManageRead: '/invoice-management',
  customerFileRead: '/customer-files',
  memberManageRead: '/member-management',
  purchaseStatisticsRead: '/procurement-statistics',
  orderStatisticsRead: '/order-statistics',
  stockStatisticsRead: '/stock-statistics',
  achievementStatisticsRead: '/performance-statistics',
  saleStatisticsRead: '/goods-sold-statistics',
  workshopStatisticsRead: '/workshop-statistics',
  financialStatisticsRead: '/finance-statistics',
  afterSalesStatisticsRead: '/after-statistics',
  settingRead: '/device-account',
  employeeManageRead: '/employees-management',
  strategySettingRead: '/strategy',
  deliverRead: '/afterale-shipping',
  financeRead: ['/workshop-audit', '/receivables-management']
}

const getters = {
  // 判断是否有权限
  hasPermission: (state) => (name) => {
//  return state.permissions.includes(name)
		return true
  },
  getRouters: (state) => {
    const permissions = state.permissions
    let permissionArr = []
    for (let item of permissions) {
      if (Array.isArray(routerPermissions[item])) {
        permissionArr = permissionArr.concat(routerPermissions[item])
      } else if (typeof item === 'string') {
        permissionArr.push(routerPermissions[item])
      } else {
        continue
      }
    }
    return permissionArr
  }
}

export default {
  state,
  getters,
  mutations
}
