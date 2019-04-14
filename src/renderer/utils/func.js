// axios加载列表的主要方法
const loadList = (context, url, cb, param = {}) => {
  context.loading = true
  context.$http.post(url, {
    pageIndex: context.pagination.pageIndex,
    pageSize: context.pagination.pageSize,
    ...param
  }).then(res => {
    let bodyInfo = res.data
    cb && cb(bodyInfo)
    context.pagination.pageIndex = bodyInfo.page
    context.loading = false
  })
}

// 加载element下拉框选项的主要方法
const loadOptions = (context, url, cb, param = {}) => {
  context.$http.post(url, {
    'body': {
      'pageIndex': 1,
      'pageSize': 1000,
      ...param
    }
  }).then(res => {
    let bodyInfo = res.data
    cb && cb(bodyInfo)
  })
}

// 加载数据的通用方法
const common = (context, url, param = {}, cb) => {
  context.$http.post(url, param).then(res => {
    cb && cb(res.data)
  })
}

// 封装的element提示方法
const confirm = (context, message, cb) => {
  context.$confirm(`是否确认${message}?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cb && cb()
  }).catch(() => {
    context.$message({
      type: 'info',
      message: `已取消${message}`
    })
  })
}

// 导出的功能函数
const exportExcel = (context, url) => {
  confirm(context, '导出', () => {
    window.location.href = process.env.baseURL + '/' + url
  })
}

/**
 * 更新订单的状态
 * @param {Obejct} [context] [上下文对象]
 * @param {String} [orderStatus] [订单状态]
 * @param {String} [message] [提示消息]
 */
const updateOrderStatus = (context, orderStatus, message) => {
  confirm(context, message, () => {
    context.$tool.common(context, 'order/changeStatus', {
      'user_name': context.$store.getters.getAccount.name,
      'order_number': context.current.orderNumber,
      'order_status': orderStatus
    }, bodyInfo => {
      context._loadMainList()
    })
  })
}

// 冻结订单
const frozenOrder = (context, orderNo) => {
  context.$tool.confirm(context, '冻结订单', () => {
    context.$tool.common(context, 'order/frozen', {
      'orderNo': orderNo
    }, bodyInfo => {
      context._loadMainList()
    })
  })
}

// 解冻订单
const thawOrder = (context, orderNo) => {
  if (context.current.orderStatus !== '0') {
    context.$message({
      type: 'error',
      message: '订单不是冻结状态'
    })
    return false
  }
  context.$tool.confirm(context, '解冻订单', () => {
    context.$tool.common(context, 'order/unfrozen', {
      'orderNo': orderNo
    }, bodyInfo => {
      context._loadMainList()
    })
  })
}

// 过滤规则
const createFilter = (queryString) => {
	return (restaurant) => {
	   try {
	  	return (restaurant.value.indexOf(queryString.toLowerCase()) === 0)
	  } catch (e) {
	  	console.log('eee', e)
	  }
	}
}
// element远程搜索加载远程资源的处理函数
const querySearch = (context, queryString, cb) => {
  let restaurants = context.restaurants || []
  let results = queryString ? restaurants.filter(createFilter(queryString)) : restaurants
  // 调用 callback 返回建议列表的数据
  cb(results)
}

// isEqual: 判断两个对象是否键值对应相等
const isEqual = (a, b) => {
  // 如果a和b本来就全等
  if (a === b) {
    // 判断是否为0和-0
    return a !== 0 || 1 / a === 1 / b
  }
  // 判断是否为null和undefined
  if (a == null || b == null) {
    return a === b
  }
  // 接下来判断a和b的数据类型
  let classNameA = toString.call(a)
  let classNameB = toString.call(b)
  // 如果数据类型不相等, 则返回false
  if (classNameA !== classNameB) {
    return false
  }
  // 如果数据类型相等，再根据不同数据类型分别判断
  switch (classNameA) {
    case '[object RegExp]':
    case '[object String]':
      // 进行字符串转换比较
      return '' + a === '' + b
    case '[object Number]':
      // 进行数字转换比较，判断是否为NaN
      if (isNaN(a)) {
        return +a !== +b
      }
      // 判断是否为0或-0
      return +a === 0 ? 1 / +a === 1 / b : +a === +b
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b
  }
  // 如果是对象类型
  if (classNameA === '[object Object]') {
    // 获取a和b的属性长度
    let propsA = Object.keys(a) // Object.getOwnPropertyNames(a)返回所有属性(包括非枚举)
    let propsB = Object.keys(b) // Object.keys(b)返回所有属性组成数组(不包括非枚举)
    if (propsA.length !== propsB.length) {
      return false
    }
    for (let i = 0; i < propsA.length; i++) {
      let propName = propsA[i]
      // 如果对应值不相等，则返回false
      if (a[propName] !== b[propName]) {
        return false
      }
    }
    return true
  }
  // 如果是数组类型
  if (classNameA === '[Object Array]') {
    if (a.toString() === b.toString()) {
      return true
    }
    return false
  }
}

export default {
  loadList,
  loadOptions,
  common,
  confirm,
  exportExcel,
  updateOrderStatus,
  frozenOrder,
  thawOrder,
  querySearch,
  isEqual
}

