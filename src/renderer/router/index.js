import Vue from 'vue'
import Router from 'vue-router'
import Config from './config'
import store from '../store'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router(Config)

router.beforeEach((to, from, next) => {
//	if (to.path === '/') {
//		store.commit('clearPath')
//		store.commit('clearPermissions')
//		window.localStorage.removeItem('loginUserBaseInfo')
//	}
	const extendsPermissions = ['/', '/index', ...store.getters.getRouters]
	let user = window.localStorage.getItem('loginUserBaseInfo')
	if (!user && to.path !== '/') {
		next({
			gitpath: '/'
		})
	} else {
		if (extendsPermissions.includes(to.path)) {
			next()
		} else {
			Message({
				message: '没权访问此页面',
				type: 'error'
			})
			//    next(false)
			next()
		}
	}
})

export default router
