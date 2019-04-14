<template>
  <div>
    <div class="mgb15">
      <el-dropdown @command="commandOrderStatus" class="mgl10">
        <el-button type="primary">
          {{filter.order_status.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in orderStatus" :key="item.value.status" :command="item.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" class="mgl10" @click="refresh"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
      <el-button type="primary" @click="handlePopupForm('add')"><i class="iconfont  "></i>新建</el-button>
      <el-button type="primary" @click="purchasingEntry" :disabled="multipleSelection.length === 0"><i class="iconfont icon-qianru1"></i>采购录入</el-button>
      <el-button type="primary" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>修改</el-button>
      <el-button type="primary" @click="submissionAudit" :disabled="multipleSelection.length === 0"><i class="iconfont icon-artboard38"></i>提交审核</el-button>
      <el-button type="danger" :disabled="multipleSelection.length === 0" @click="auditPurchase('0')"><i class="iconfont icon-dongjiefene"></i>冻结</el-button>
      <el-button type="danger" :disabled="multipleSelection.length === 0" @click="auditPurchase('1')"><i class="iconfont icon-jiedong01"></i>解冻</el-button>
      <el-button type="danger" @click="handleDelete" :disabled="multipleSelection.length === 0"><i class="iconfont icon-quxiao"></i>取消</el-button>
      <el-button type="danger" :disabled="multipleSelection.length === 0" @click="auditPurchase('5')"><i class="iconfont icon-tuihuo"></i>申请退货</el-button>
      <el-button type="danger" :disabled="multipleSelection.length === 0" @click="auditPurchase('6')"><i class="iconfont icon-tuihuo"></i>退货</el-button>
    </div>
    <div class="table-wrapper">
      <el-table v-loading="loading" ref="multipleTable" @selection-change="handleSelectionChange" highlight-current-row @current-change="selected" :data="purchaseList" stripe style="width: 100%" max-height="523">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="purchaseUuid" label="采购单号" align="center" width="180">
        </el-table-column>
        <el-table-column prop="supplier" label="供应商" align="center">
        </el-table-column>
        <el-table-column label="当前状态" :formatter="$formatter.formatPurchaseOrder" align="center">
        </el-table-column>
        <el-table-column prop="buyer" label="采购员" align="center">
        </el-table-column>
        <el-table-column prop="transportationMode" label="货运方式" align="center">
        </el-table-column>
        <el-table-column prop="otherAmount" label="其他费用" align="center">
        </el-table-column>
        <el-table-column prop="beforeTaxAmount" label="税前总金额" align="center">
        </el-table-column>
        <el-table-column prop="afterTaxAmount" label="税后总金额" align="center">
        </el-table-column>
        <el-table-column prop="typeNumber" label="货品种类数" align="center">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="货品总数" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!--底部辅助表格-->
    <auxiliary-table type="purchase"></auxiliary-table>
    <el-dialog :title="formTitle" :visible.sync="purchaseVisible" size="full" @close="resetForm('form')">
      <procurement-form :formTitle="formTitle" :purchaseGoodslist.sync="purchaseGoodslist" :updatedForm="form" @submit="handleSubmit" @reset="resetForm" ref="purchase-form"></procurement-form>
    </el-dialog>
  </div>
</template>
<script>
import AuxiliaryTable from '@/components/AuxiliaryTable'
import ProcurementForm from './form'
export default {
  name: 'procurement-management',
  components: {
    [AuxiliaryTable.name]: AuxiliaryTable,
    [ProcurementForm.name]: ProcurementForm
  },
  data() {
    return {
      loading: false,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      filter: {
        order_status: {
          name: '全部订单',
          status: '-1'
        }
      },
      orderStatus: [{
        label: '冻结',
        value: {
          name: '冻结',
          status: '0'
        }
      }, {
        label: '待审核',
        value: {
          name: '待审核',
          status: '1'
        }
      }, {
        label: '审核通过',
        value: {
          name: '审核通过',
          status: '2'
        }
      }, {
        label: '审核驳回',
        value: {
          name: '审核驳回',
          status: '3'
        }
      }, {
        label: '收货成功',
        value: {
          name: '收货成功',
          status: '4'
        }
      }, {
        label: '待退款',
        value: {
          name: '待退款',
          status: '5'
        }
      }, {
        label: '退款成功',
        value: {
          name: '退款成功',
          status: '6'
        }
      }, {
        label: '待退货',
        value: {
          name: '待退货',
          status: '7'
        }
      }, {
        label: '退货成功',
        value: {
          name: '退货成功',
          status: '8'
        }
      }],
      current: {},
      purchaseGoodslist: [],
      formTitle: '新建采购单',
      purchaseList: [],
      multipleSelection: [],
      purchaseVisible: false,
      form: {
        user_name: this.$store.getters.getAccount.name,
        purchase_uuid: '',
        supplier: '',
        contacts: '',
        phone: '',
        address: '',
        buyer: '',
        remark: '',
        transportation_mode: '',
        postage: '',
        other_amount: '',
        before_tax_amount: '',
        after_tax_amount: '',
        total_amount: ''
      }
    }
  },
  methods: {
    // 单选
    selected(current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    // 检查用户名是否是订单业务员
    checkBuyer() {
      if (this.$store.getters.getAccount.name !== this.current.buyer) {
        this.$message({
          type: 'error',
          message: '登录账户必须是订单的采购员'
        })
        return false
      }
      return true
    },
    // 检查退款
    checkRefund() {
      if (this.current.refundSign === 2) {
        this.$message({
          type: 'error',
          message: '已退款状态订单不能操作'
        })
        return false
      }
      return true
    },
    // 检查付款
    checkMoney() {
      if (this.current.moneySign === 1) {
        this.$message({
          type: 'error',
          message: '未付款订单不能点击已退货按钮'
        })
        return false
      }
      return true
    },
    // 更改采购单状态
    auditPurchase(status) {
      if (!this.checkBuyer()) return false
      if (!this.checkRefund()) return false
      this.$tool.confirm(this, '更改采购单状态', () => {
        let purchaseUuids = this.multipleSelection.map(item => item.purchaseUuid)
        this.$tool.common(this, 'purchase/auditPurchase', {
          purchaseUuids: purchaseUuids,
          current_status: status
        }, bodyInfo => {
          this._loadMainList()
        })
      })
    },
    // 采购录入
    purchasingEntry() {
      if (this.current.currentStatus !== '2') {
        this.$message({
          type: 'error',
          message: '只有订单状态为审核通过，才能点击终审通过按钮'
        })
        return false
      }
      if (!this.checkRefund()) return false
      this.$tool.common(this, 'purchase/input', {
        purchaseUuid: this.current.purchaseUuid,
        current_status: '4'
      }, bodyInfo => {
        this._loadMainList()
      })
    },
    // 提交审核
    submissionAudit() {
      if (!this.checkBuyer()) return false
      if (!this.checkRefund()) return false
      this.$tool.confirm(this, '提交审核', () => {
        let purchaseUuids = this.multipleSelection.map(item => item.purchaseUuid)
        this.$tool.common(this, 'purchase/submissionAudit', {
          'purchaseUuids': purchaseUuids
        }, bodyInfo => {
          this._loadMainList()
        })
      })
    },
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/PurchaseExcelport')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    resetForm(formName) {
      this.form = {
        user_name: this.$store.getters.getAccount.name,
        purchase_uuid: '',
        supplier: '',
        contacts: '',
        phone: '',
        address: '',
        buyer: '',
        transportation_mode: '',
        postage: '',
        other_amount: '',
        before_tax_amount: '',
        after_tax_amount: '',
        total_amount: '',
        remark: ''
      }
      this.purchaseGoodslist = []
      this.$refs['purchase-form'].resetFields(formName)
      this.purchaseVisible = false
    },
    handleSubmit(formName) {
      let url = this.formTitle === '新建采购单' ? 'purchase/create' : 'purchase/update'
      this.$tool.common(this, url, {
        ...this.form,
        'goods_list': this.purchaseGoodslist
      }, bodyInfo => {
        this.resetForm(formName)
        this._loadMainList()
      })
    },
    // 取消
    handleDelete() {
      if (!this.checkBuyer()) return false
      if (!this.checkRefund()) return false
      let purchaseUuids = this.multipleSelection.map(item => item.purchaseUuid)
      this.$tool.common(this, 'purchase/delete', {
        'purchaseUuid': purchaseUuids
      }, bodyInfo => {
        this._loadMainList()
      })
    },
    // 弹出新建编辑
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建采购单'
      } else if (formName === 'edit') {
        if (!this.checkRefund()) return false
        if (this.multipleSelection.length === 1) {
          this.$tool.common(this, 'purchase/find', {
            'purchase_uuid': this.current.purchaseUuid
          }, bodyInfo => {
            let {purchase, PurchaseGoodslist} = bodyInfo
            this.form = Object.assign({}, {
              user_name: this.$store.getters.getAccount.name,
              goods_category: purchase.goodsCategory,
              purchase_uuid: purchase.purchaseUuid,
              supplier: purchase.supplier,
              contacts: purchase.contacts,
              phone: purchase.phone,
              address: purchase.address,
              buyer: purchase.buyer,
              transportation_mode: purchase.transportationMode,
              postage: purchase.postage,
              other_amount: purchase.otherAmount,
              before_tax_amount: purchase.beforeTaxAmount,
              after_tax_amount: purchase.afterTaxAmount,
              total_amount: purchase.totalAmount,
              remark: purchase.remark
            })
            this.purchaseGoodslist = PurchaseGoodslist.map(item => {
              return {
                row_uuid: this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999),
                model: item.model,
                goods_name: item.goodsName,
                goods_uuid: item.goodsUuid,
                goods_weight: item.goodsWeight,
                number: item.number,
                purchase_amount: item.purchaseAmount,
                purchase_weight: item.purchaseWeight,
                purchase_price: item.purchasePrice,
                length: item.length,
                width: item.width
              }
            })
            this.formTitle = '编辑采购单'
          })
        }
      }
      this.purchaseVisible = true
    },
    _loadMainList() {
      this.$tool.loadList(this, 'purchase/list', bodyInfo => {
        this.purchaseList = bodyInfo.OrderList
      }, {
        order_state: this.filter.order_status.status === '-1' ? '' : this.filter.order_status.status
      })
    },
    commandOrderStatus(command) {
      this.filter.order_status = command
      this._loadMainList()
    },
    // 分页查询
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 刷新
    refresh() {
      this.filter.order_status = {
        status: '-1',
        name: '全部订单'
      }
      this._loadMainList()
    }
  },
  mounted() {
    this._loadMainList()
  }
}

</script>

<style lang="scss">
@media print {
  .table-wrapper {
    .el-table {
      width: 100%;
    }
  }
}  
</style>