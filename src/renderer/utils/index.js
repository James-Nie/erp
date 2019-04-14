import validator from './validator'
import dom from './dom'
import func from './func'

const util = {
  // 判断对象是否为空 {}
  isEmptyObject: function (obj) {
    if (typeof obj !== 'object' || obj === null) return true
    return !(Object.keys(obj).length)
  },
  ...func,
  ...dom,
  ...validator
}
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue, 'tool', { value: util })
    Object.defineProperty(Vue.prototype, '$tool', { value: util })
  }
}
