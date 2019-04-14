export default {
  // 校验数字
  validateNumber(message) {
    return (rule, value, callback) => {
      if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(value)) {
        callback(new Error(message))
      } else {
        callback()
      }
    }
  },
  // 校验授信额度
  validateQuota(message) {
    return (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入授信额度'))
      } else if (!/^\d+$/.test(value)) {
        callback(new Error(message))
      } else {
        callback()
      }
    }
  },
  // 校验手机号
  validatePhone(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入手机号'))
    } else if (!/^1[0-9]{10}$/.test(value)) {
      callback(new Error('手机号有误'))
    } else {
      callback()
    }
  },
  // 校验折扣
  validateDiscount(rule, value, callback) {
    if (value > 0 && value <= 10) {
      callback()
    } else {
      callback(new Error('折扣必须在0-10之间'))
    }
  },
  // 校验正整数
  validateInteger(rule, value, callback) {
    if (/^\d+$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正整数'))
    }
  },
  // 校验邮箱
  validatePostalCode(rule, value, callback) {
    if (value === '') {
      callback(new Error('邮编不能为空'))
    } else if (!/^[0-9]{6}$/.test(value)) {
      callback(new Error('邮编由0-9六位数字组成'))
    } else {
      callback()
    }
  }
}
