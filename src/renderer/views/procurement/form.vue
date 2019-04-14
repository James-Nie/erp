<template>
  <div class="purchase-form">
    <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="94px" label-position="left">
      <div class="form-section">
        <el-form-item label="供应商" prop="supplier">
          <el-select v-model="form.supplier" placeholder="请选择供应商" class="w192">
            <el-option v-for="item in supplier_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入收货地址"></el-input>
        </el-form-item>
        <el-form-item label="采购员" prop="buyer">
          <el-select v-model="form.buyer" placeholder="请选择采购员" class="w192">
            <el-option v-for="item in buyerOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="货运方式" prop="transportation_mode">
          <el-select v-model="form.transportation_mode" placeholder="请选择货运方式" class="w192">
            <el-option value="快递"></el-option>
            <el-option value="托运"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮资" prop="postage">
          <el-input v-model="form.postage" placeholder="请输入邮资"></el-input>
        </el-form-item>
        <el-form-item label="其他金额" prop="other_amount">
          <el-input v-model="form.other_amount" placeholder="请输入其他金额"></el-input>
        </el-form-item>
        <el-form-item label="税前总货款" prop="before_tax_amount">
          <el-input v-model="form.before_tax_amount" placeholder="请输入税前总货款"></el-input>
        </el-form-item>
        <el-form-item label="税后总货款" prop="after_tax_amount">
          <el-input v-model="form.after_tax_amount" placeholder="请输入税后总货款"></el-input>
        </el-form-item>
        <el-form-item label="采购类型" prop="goods_category">
          <el-select v-model="form.goods_category" placeholder="请选择采购类型" class="w192">
            <el-option value="销售采购"></el-option>
            <el-option value="原料采购"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购总价" prop="total_amount">
          <el-input v-model="form.total_amount" placeholder="请输入采购总价" :disabled="true"></el-input>
        </el-form-item>
      </div>
      <div class="mgb15">
        <el-button type="success" @click="addProduct">添加商品</el-button>
        <el-button type="danger" icon="delete2" @click="handleDelete" :disabled="activeUuid === null">删除</el-button>
      </div>
      <el-form :model="_self">
        <el-table :data="purchaseGoodslist" class="purchase-table" stripe style="width: 100%" highlight-current-row @current-change="selected">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" align="center" width="180">
          </el-table-column>
          <el-table-column prop="model" label="规格" align="center">
          </el-table-column>
          <el-table-column prop="length" label="长度(m)" align="center">
          </el-table-column>
          <el-table-column prop="width" label="宽度(m)" align="center">
          </el-table-column>
          <el-table-column prop="purchase_price" label="采购单价" align="center">
          </el-table-column>
          <el-table-column label="采购数量" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'purchaseGoodslist['+ scope.$index +'].number'" :rules="numberRule" :show-message="false">
                <el-input size="mini" v-model="scope.row.number" placeholder="输入正整数" style="width:100px"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="goods_weight" label="货品单重" align="center">
          </el-table-column>
          <el-table-column label="采购总价" :formatter="formatPurchaseAmount" align="center">
          </el-table-column>
          <el-table-column label="采购总重" :formatter="formatPurchaseWeight" align="center">
          </el-table-column>
          <el-table-column label="到货时间" align="center">
            <template slot-scope="scope">
              <el-date-picker size="mini" v-model="scope.row.end_time" type="date" placeholder="选择日期" @change="handleChange(scope.row, $event)" style="width:120px">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.remark" style="width:100px"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="text-center purchase-order-footer">
        <el-button class="circle-btn" @click="$emit('reset', 'form')">取消</el-button>
        <el-button class="circle-btn" type="primary" @click="handleSubmit('form')">确定</el-button>
      </div>
    </el-form>
    <!--单品选择-->
    <el-dialog custom-class="box-shadow" :modal="false" :title="dialogTitle" :modal-append-to-body="false" :visible.sync="dialogVisible" size="large">
      <div class="add-product">
        <el-table :data="goodsList" ref="multipleTable" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="brand" label="品牌" align="center">
          </el-table-column>
          <el-table-column prop="model" label="规格" align="center">
          </el-table-column>
          <el-table-column prop="width" label="宽度(m)" align="center">
          </el-table-column>
          <el-table-column prop="supplier" label="供应商" align="center">
          </el-table-column>
          <el-table-column prop="retailPrice" label="零售价" align="center">
          </el-table-column>
        </el-table>
        <div class="toolbar clearfix">
          <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
        <div class="text-center">
          <el-button class="circle-btn" @click="handleCancel('multipleTable')">取消</el-button>
          <el-button type="primary" class="circle-btn" @click="handleConfirm('multipleTable')">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'procurement-form',
  props: {
    updatedForm: {
      type: Object,
      required: true
    },
    purchaseGoodslist: Array,
    formTitle: String
  },
  computed: {
    form() {
      return this.updatedForm
    }
  },
  data() {
    return {
      _self: this,
      loading: false,
      dialogTitle: '单品选择',
      dialogVisible: false,
      activeUuid: null,
      buyerOptions: [],
      goodsList: [],
      supplier_options: [],
      multipleSelection: [],
      numberRule: { validator: this.$tool.validateInteger, required: true, trigger: 'blur' },
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        goods_category: [{ required: true, message: '请输入采购类型', trigger: 'blur' }],
        supplier: [{ required: true, message: '请选择供应商名称', trigger: 'change' }],
        contacts: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, validator: this.$tool.validatePhone, trigger: 'blur' }],
        address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        buyer: [{ required: true, message: '请输入采购员', trigger: 'blur' }],
        transportation_mode: [{ required: true, message: '请输入货运方式', trigger: 'blur' }],
        postage: [{ required: true, validator: this.$tool.validateNumber('请输入邮资'), trigger: 'blur' }],
        other_amount: [{ required: true, validator: this.$tool.validateNumber('请输入其他金额'), trigger: 'blur' }],
        before_tax_amount: [{ required: true, validator: this.$tool.validateNumber('请输入税前总货款'), trigger: 'blur' }],
        after_tax_amount: [{ required: true, validator: this.$tool.validateNumber('请输入税后总货款'), trigger: 'blur' }],
        total_amount: [{ required: true, validator: this.$tool.validateNumber('请输入采购总价'), trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  watch: {
    purchaseGoodslist: {
      handler: function (val) {
        let totalAmount = 0
        val.forEach(item => {
          totalAmount += parseFloat(item.purchase_amount)
        })
        this.form.total_amount = parseFloat(totalAmount.toFixed(2))
      },
      deep: true
    }
  },
  methods: {
    // 表格单选
    selected(currentRow, oldCurrentRow) {
      this.activeUuid = currentRow && currentRow.row_uuid
    },
    // 删除选中
    handleDelete() {
      let purchaseGoodslist = this.purchaseGoodslist.filter(item => {
        if (item.row_uuid !== this.activeUuid) {
          return true
        }
      })
      this.$emit('update:purchaseGoodslist', purchaseGoodslist)
    },
    // 获取货品列表
    queryGoods() {
      this.$tool.loadList(this, 'order/goodsList', bodyInfo => {
        this.goodsList = bodyInfo.GoodsList
      }, {
      	goods_sign: 1
      })
    },
    // 添加商品
    addProduct() {
      this.queryGoods()
      this.dialogVisible = true
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 清空
    resetFields(formName) {
      this.$refs[formName].resetFields()
    },
    // 分页,刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.queryGoods()
    },
    // 清空,关闭页面
    handleCancel(formName) {
      this.$refs[formName].clearSelection()
      this.dialogVisible = false
    },
    // 确定添加单品
    handleConfirm(formName) {
      let selection = this.multipleSelection.map(item => {
        return {
          row_uuid: this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999),
          goods_uuid: item.goodsUuid,
          goods_name: item.name,
          purchase_price: item.retailPrice,
          model: item.model,
          width: item.width,
          goods_weight: item.weight,
          cost_price: item.costPrice,
          length: 1,
          number: 1,
          purchase_weight: '',
          purchase_amount: '',
          remark: '',
          end_time: ''
        }
      })
      this.$emit('update:purchaseGoodslist', this.purchaseGoodslist.concat(selection))
      this.handleCancel(formName)
    },
    // 确认供货单
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', formName)
        }
      })
    },
    // 获取总重
    formatPurchaseWeight(row, column, cellValue) {
      row.purchase_weight = parseFloat(row.number * row.goods_weight).toFixed(2)
      return row.purchase_weight
    },
    // 总价
    formatPurchaseAmount(row, column, cellValue) {
      row.purchase_amount = parseFloat(row.number * row.purchase_price).toFixed(2)
      return row.purchase_amount
    },
    // 结束时间
    handleChange(row, time) {
      row.end_time = this.$moment(time).format('YYYY-MM-DD')
    },
    // 搜索采购员
    queryBuyer() {
      this.$tool.common(this, 'user/findPosition', {
        'position': '采购员'
      }, bodyInfo => {
        this.buyerOptions = bodyInfo.UserList.map(item => ({value: item.name}))
      })
    },
    // 查询供应商
    querySupplier() {
      this.$tool.loadOptions(this, 'supplier/list', bodyInfo => {
        this.supplier_options = bodyInfo.apiResult.map(item => ({value: item.name}))
      })
    }
  },
  mounted() {
    [this.queryBuyer, this.querySupplier].forEach(f => f())
  }
}

</script>
<style lang="scss">
.purchase-form {
  .form-section {
    margin-bottom: 15px;
    .el-form-item {
      margin-right: 20px !important;
    }
  }
  .purchase-order-footer {
    margin-top: 60px;
  }

  .purchase-table {
    .el-input--mini .el-input__inner {
      text-align: center;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .purchase-order-footer {
    .el-button+.el-button {
      margin-left: 20px;
    }
  }
}

</style>
