import moment from 'moment'

export default {
  formatType(row, column) {
    const typeMap = {
      '1': '订单发货',
      '2': '售后发货',
      '3': '退货',
      '4': '换货'
    }
    return typeMap[row.type]
  },
  // 格式化采购单状态
  formatPurchaseOrder(row, column) {
    const status = {
      '0': '冻结',
      '1': '待审核',
      '2': '审核通过',
      '3': '终审通过',
      '4': '审核驳回',
      '5': '收货成功',
      '6': '待退货',
      '7': '退货成功'
    }
    return status[row.currentStatus]
  },
  // 是否付款
  formatMoneySign(row, column) {
    const status = {
      '1': '未付款',
      '2': '已付款'
    }
    return status[row.moneySign]
  },
  // 是否退款
  formatRefundSign(row, column) {
    const status = {
      '1': '未退款',
      '2': '已退款'
    }
    return status[row.refundSign]
  },
  formatOrederProductType(row, column) {
    const statusMap = {
      '1': '未领料',
      '2': '已领料',
      '3': '已打印',
      '4': '重新生产'
    }
    return statusMap[row.type]
  },
  formatDisable(row, column) {
    const disableMap = {
      '1': '未停用',
      '2': '已停用'
    }
    return disableMap[row.disable]
  },
  reverseDisable(row, column) {
    const reverseMap = {
      '1': '停用',
      '2': '启用'
    }
    return reverseMap[row.disable]
  },
  // 订单模块
  formatOrderStatus(row, column) {
    const status = {
      '0': '新建',
      '1': '待审核',
      '2': '驳回',
      '3': '待财审',
      '4': '财审驳回',
      '5': '审核通过',
      '6': '已冻结',
      '7': '待生产',
      '8': '生产中',
      '9': '待发货',
      '10': '已发货',
      '90': '已完成',
      '91': '取消'
    }
    return status[row.orderStatus]
  },
  // 原始订单状态
  formatSystemStatus(row, column) {
    const status = {
      '0': '冻结',
      '1': '待审核',
      '2': '驳回',
      '3': '待财审',
      '4': '审核通过',
      '5': '待生产',
      '6': '生产中',
      '7': '待发货',
      '8': '已发货',
      '9': '已签收',
      '10': '申请退货',
      '11': '退货中',
      '12': '完成退货',
      '13': '退货驳回',
      '14': '取消',
      '15': '待销售审核'
    }
    return status[row.systemStatus]
  },
  formatAuditStatus(row, column) {
    const auditStatus = {
      '1': '未提交',
      '2': '审核中',
      '3': '财务通过',
      '4': '终审通过',
      '5': '驳回'
    }
    return auditStatus[row.auditStatus]
  },
  formatRefundStatus(row, column) {
    return row.refundStatus || '---'
  },
  formatTime(identifiers) {
    return (row, column) => {
      if (row[identifiers]) {
        return moment(new Date(row[identifiers])).format('YYYY-MM-DD HH:mm:ss')
      }
      return '---'
    }
  },
  formatGenerateStatus(row, column) {
    const generateMap = {
      '1': '未领料',
      '2': '已领料',
      '3': '已打印',
      '4': '重新生产'
    }
    return generateMap[row.type]
  },
  // 标旗
  formatSellerFlag(row, column) {
    const status = {
      '0': '全部标旗',
      '1': '红旗',
      '2': '黄旗',
      '3': '绿旗',
      '4': '蓝旗',
      '5': '紫旗'
    }
    return status[row.sellerFlag]
  },
  // 格式化生产单状态
  formatProductOrder(row, column) {
    const status = {
      '0': '待生产',
      '1': '已撤回',
      '2': '待领料',
      '3': '待打印',
      '90': '已完成'
    }
    return status[row.orderStatus]
  },
  // 格式化生产单状态
  formatGoodsType(row, column) {
    const status = {
      0: '其他',
      1: '锯条',
      2: '配件',
      3: '赠品',
      4: '锯床',
      5: '锯骨机'
    }
    return status[row.goodsType]
  }
}
