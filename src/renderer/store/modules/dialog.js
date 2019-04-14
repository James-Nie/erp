const state = {
  brandManagementVisible: false,
  goodsClassificationVisible: false,
  accountVisible: false,
  logisticsVisible: false,
  storeVisible: false,
  warehouseManagementVisible: false
}

const mutations = {
  setBrandManagementVisible(state, val) {
    state.brandManagementVisible = val
  },
  setGoodsClassificationVisible(state, val) {
    state.goodsClassificationVisible = val
  },
  setAccountVisible(state, val) {
    state.accountVisible = val
  },
  setLogisticsVisible(state, val) {
    state.logisticsVisible = val
  },
  setStoreVisible(state, val) {
    state.storeVisible = val
  },
  setWarehouseManagementVisible(state, val) {
    state.warehouseManagementVisible = val
  }
}

export default {
  state,
  mutations
}
