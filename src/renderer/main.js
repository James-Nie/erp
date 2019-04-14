import Vue from 'vue'
import axiosPlugin from './server'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import filter from './filter'
import utils from './utils'
import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(axiosPlugin)
Vue.use(filter)
Vue.use(utils)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
