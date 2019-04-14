export default {
  // 向上遍历查询父组件
  parentComponents(component, name) {
    while (component.$options.name !== name) {
      component = component.$parent
    }
    return component
  },
  // 向上遍历查询父节点
  parents(node, tagName) {
    if (typeof tagName !== 'string') {
      return false
    }
    while (node.nodeName !== tagName.toUpperCase()) {
      node = node.parentNode
    }
    return node
  },
  // 切换class名称
  toggleClass(node, className) {
    let nodeClass = ' ' + node.className + ' '
    let changeClass = ' ' + className + ' '
    if (nodeClass.indexOf(changeClass) === -1) {
      node.className += (' ' + className)
    } else {
      node.className = nodeClass.replace(new RegExp(changeClass), '')
    }
  },
  // 阻止事件冒泡
  stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    e.cancelBubble = true
  },
  /**
   * 切换两个函数
   * @param {Object} [context] [上下文对象]
   * @param {Object} [cb1] [回调函数1]
   * @param {Object} [cb2] [回调函数2]
   */
  toggle(context, cb1, cb2) {
    if (typeof cb1 !== 'function' || typeof cb2 !== 'function') {
      return false
    }
    if (context.checked) {
      context.checked = false
      cb1()
    } else {
      context.checked = true
      cb2()
    }
  },
  // 判断类型
  isType(obj, type) {
    return Object.prototype.toString.call(obj) === '[object ' + type + ']'
  },
  // {}一个对象根据属性名搜索结果集
  findAttribute(obj, attr) {
    let attrs = []
    let iterator = (obj, attr) => {
      if (this.isType(obj, 'Array')) {
        for (let item of obj) {
          iterator(item, attr)
        }
      } else if (this.isType(obj, 'Object')) {
        for (let key in obj) {
          if (key === attr) {
            attrs.push(obj[attr])
          } else {
            iterator(obj[key], attr)
          }
        }
      }
    }
    iterator(obj, attr)
    return attrs
  },
  // {} 一个对象根据属性名搜索到值所对应对象结果集
  querySelector(obj, attr, val) {
    let objArr = []
    let iterator = (obj, attr) => {
      if (this.isType(obj, 'Array')) {
        for (let item of obj) {
          iterator(item, attr)
        }
      } else if (this.isType(obj, 'Object')) {
        for (let key in obj) {
          if (key === attr) {
            if (obj[key] === val) {
              objArr.push(obj)
            }
          } else {
            iterator(obj[key], attr)
          }
        }
      }
    }
    iterator(obj, attr)
    return objArr
  }
}
