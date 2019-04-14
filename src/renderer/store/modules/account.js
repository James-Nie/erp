const state = JSON.parse(window.localStorage.getItem('loginUserBaseInfo')) || {
  'account': '',
  'password': '',
  'name': ''
}

const getters = {
  getAccount(state) {
    return state
  }
}

const mutations = {
  setAccount(state, opt) {
    window.localStorage.setItem('loginUserBaseInfo', JSON.stringify(opt))
    Object.assign(state, opt)
  },
  removeAccount(state) {
    window.localStorage.removeItem('loginUserBaseInfo')
    state = {
      'account': '',
      'password': '',
      'name': ''
    }
  }
}

export default {
  state,
  mutations,
  getters
}
