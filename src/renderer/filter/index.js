import moment from 'moment'
import formatter from './formatter'

export default {
  install(Vue, Option) {
    Object.defineProperty(Vue, 'formatter', { value: formatter })
    Object.defineProperty(Vue.prototype, '$formatter', { value: formatter })
    Object.defineProperty(Vue, 'moment', { value: moment })
    Object.defineProperty(Vue.prototype, '$moment', { value: moment })
  }
}
