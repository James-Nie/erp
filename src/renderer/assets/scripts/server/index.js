import axios from 'axios'
import { Message } from 'element-ui'
// import router from '@/router'

const Axios = axios.create({
  baseURL: 'http://116.62.223.112/erp',
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  timeout: 5000
})

// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // 若是有做鉴权token , 就给头部带上token
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token
    }
    return config
  },
  error => {
    Message({
      // 饿了么的消息弹窗组件,类似toast
      showClose: true,
      type: 'error',
      message: error.data.body.description
    })
    return Promise.reject(error.data.body)
  }
)

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    // 对响应数据做些事
    if (res.data) {
      Message({
        // 饿了么的消息弹窗组件,类似toast
        showClose: true,
        // 自己根据业务规则修改
        message: res.data.body.description,
        type: res.data.body.result ? 'error' : 'success'
      })
      if (res.data.body.result) {
        return Promise.reject(res.data.body)
      }
    }
    return res
  }
  /*
  ,
  error => {
    // 用户登录的时候会拿到一个基础信息,比如用户名,token,过期时间戳
    // 直接丢localStorage或者sessionStorage
    if (!window.localStorage.getItem('loginUserBaseInfo')) {
      // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
      router.push({
        path: '/login'
      })
    } else {
      // 若是有基础信息的情况下,判断时间戳和当前的时间,若是当前的时间大于服务器过期的时间
      // 乖乖的返回去登录页重新登录
      let lifeTime = JSON.parse(window.localStorage.getItem('loginUserBaseInfo')).lifeTime * 1000
      let nowTime = new Date().getTime()
      console.log(nowTime, lifeTime)
      console.log(nowTime > lifeTime)
      if (nowTime > lifeTime) {
        Message({
          showClose: true,
          message: '登录状态信息过期,请重新登录',
          type: 'error'
        })
        router.push({
          path: '/login'
        })
      } else {
        // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
        if (error.response.status === 403) {
          router.push({
            path: '/error/403'
          })
        }
        if (error.response.status === 500) {
          router.push({
            path: '/error/500'
          })
        }
        if (error.response.status === 502) {
          router.push({
            path: '/error/502'
          })
        }
        if (error.response.status === 404) {
          router.push({
            path: '/error/404'
          })
        }
      }
    }
    // 返回 response 里的错误信息
    let errorInfo = error.data.body.result ? error.data.body.discription : error.data.body
    return Promise.reject(errorInfo)
  }
  */
)

export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue, 'http', { value: Axios })
    Object.defineProperty(Vue.prototype, '$http', { value: Axios })
  }
}
