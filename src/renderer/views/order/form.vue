<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" :inline="true" label-width="80px">
      <div class="panel-heading">基本信息</div>
      <section class="panel-section">
        <el-form-item label="店铺" prop="store">
          <el-select v-model="form.store" placeholder="请输入店铺名称" class="w192">
            <el-option v-for="item in storeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="salesman">
          <el-select v-model="form.salesman" placeholder="请输入业务员" class="w192">
            <el-option v-for="item in salesmans" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型" prop="order_type">
          <el-select v-model="form.order_type" placeholder="请输入平台类型" class="w192">
            <el-option v-for="item in orderTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原始订单">
          <el-input v-model="form.origin_number" placeholder="请输入原始订单"></el-input>
        </el-form-item>
      </section>
      <div class="panel-heading">客户信息</div>
      <section class="panel-section">
        <el-form-item label="姓名" prop="name">
          <el-autocomplete v-model="form.name" :fetch-suggestions="querySearch" placeholder="请输入姓名" @select="handleSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机"></el-input>
        </el-form-item>
        <el-form-item label="收件人" prop="addressee">
          <el-input v-model="form.addressee" placeholder="请输入收件人"></el-input>
        </el-form-item>
        <el-form-item label="固话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入固话"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
          <el-input v-model="form.postcode" placeholder="请输入邮编"></el-input>
        </el-form-item>
        <el-form-item label="省市区" prop="cityArray">
          <el-cascader :options="cityOptions" :props="{value: 'label'}" v-model="form.cityArray" class="w192" placeholder="请选择省市区">
          </el-cascader>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="网名">
          <el-input v-model="form.online_name" placeholder="请输入网名"></el-input>
        </el-form-item>
        <el-form-item label="买家留言">
          <el-input v-model="form.buyer_remark" placeholder="请输入买家留言"></el-input>
        </el-form-item>
      </section>
      <div class="goods-handle">
        <el-button type="success" @click="handlePopupTable('product')">添加锯条</el-button>
        <el-button type="success" @click="handlePopupTable('giveaway')">添加配件</el-button>
        <el-button type="danger" @click="handleDelete" icon="delete2" :disabled="activeUuid === null">删除</el-button>
      </div>
      <el-form :model="_self">
        <el-table :data="goodsList" highlight-current-row @selection-change="selected" class="mgb15">
        	<el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" width="70" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="brand" label="品牌" align="center">
          </el-table-column>
          <el-table-column prop="model" label="规格" align="center">
          </el-table-column>
          <el-table-column label="长度(mm)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'goodsList[' + scope.$index + '].length'" :rules="{validator: $tool.validateNumber('请输入长度'), rigger: 'blur'}" :show-message="false">
                <el-input v-model.number="scope.row.length" size="mini" class="w100" placeholder="最多两位小数"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'goodsList['+ scope.$index +'].amount'" :rules="amountRule" :show-message="false">
                <el-input v-model.number="scope.row.amount" size="mini" class="w100" placeholder="正整数"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" align="center">
          </el-table-column>
          <el-table-column prop="weight" label="单重(kg)" align="center">
          </el-table-column>
          <el-table-column label="总重(kg)" :formatter="formatAllWeight" align="center">
          </el-table-column>
          <el-table-column prop="cost_price" label="底价(米/元)" align="center">
          </el-table-column>
          <el-table-column prop="retail_price" label="原价(米/元)" align="center">
          </el-table-column>
          <el-table-column label="优惠价(米/元)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'goodsList[' + scope.$index + '].discount_price'" :rules="{validator: $tool.validateNumber('请输入优惠价'), trigger: 'blur'}" :show-message="false">
                <el-input v-model.number="scope.row.discount_price" size="mini" class="w100" placeholder="最多两位小数"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="总价(元)" align="center" :formatter="formatAllPrice">
          </el-table-column>
        </el-table>
      </el-form>
      <div class="panel-heading">结算信息</div>
      <section class="panel-section">
        <el-form-item label="总计金额">
          <el-input v-model="form.actual_money" placeholder="总计金额" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="应收金额">
          <el-input v-model="form.receivable_money" placeholder="应收金额" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="优惠金额">
          <el-input v-model="form.discount_money" placeholder="优惠金额" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="优惠折扣">
          <el-input v-model="form.discount" placeholder="优惠折扣" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="pay_type">
          <el-select v-model="form.pay_type" placeholder="请选择订单类型" class="w192">
            <el-option v-for="item in payTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付账号" prop="pay_account">
          <el-input v-model="form.pay_account" placeholder="请输入支付账号"></el-input>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoice_type">
          <el-select v-model="form.invoice_type" placeholder="请选择平台类型" class="w192">
            <el-option v-for="item in invoiceTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头" prop="invoice_title">
          <el-input v-model="form.invoice_title" placeholder="请输入发票抬头"></el-input>
        </el-form-item>
        <el-form-item label="发票内容" prop="invoice_content">
          <el-input v-model="form.invoice_content" placeholder="请输入发票内容"></el-input>
        </el-form-item>
        <el-form-item label="邮费" prop="postage">
          <el-input v-model="form.postage" placeholder="请输入邮费"></el-input>
        </el-form-item>
        <el-form-item label="货运方式" prop="logistics_mode">
          <el-select v-model="form.logistics_mode" placeholder="请选择平台类型" class="w192">
            <el-option value="快递"></el-option>
            <el-option value="托运"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客服备注">
          <el-input v-model="form.service_remark" placeholder="请输入客服备注"></el-input>
        </el-form-item>
      </section>
    </el-form>
    <div class="order-form-btn">
      <el-button class="circle-btn" @click="handleSubmit('form', '0')">保存为冻结</el-button>
      <el-button class="circle-btn" type="primary" @click="handleSubmit('form', '1')">{{submitName}}</el-button>
      <el-button class="circle-btn" @click="$emit('reset')">取消</el-button>
    </div>
    <el-dialog custom-class="box-shadow" :modal="false" :title="dialogTitle" :modal-append-to-body="false" :visible.sync="dialogVisible" size="large">
      <goods-table :goodsList="productList" @handleCloseDialog="handleCloseDialog" :title="dialogTitle"></goods-table>
    </el-dialog>
  </div>
</template>
<script>
import GoodsTable from './goods-table'
import cityOptions from '@/assets/scripts/city-data'
export default {
  name: 'OrderForm',
  components: {
    [GoodsTable.name]: GoodsTable
  },
  props: {
    updatedForm: Object,
    goodsList: Array
  },
  data() {
    return {
      _self: this,
      activeUuid: null,
      dialogTitle: '添加锯条',
      cityOptions: cityOptions,
      storeOptions: [],
      productList: [],
      invoiceTypes: [{
        value: '增值税发票'
      }, {
        value: '普票'
      }],
      orderTypes: [{
        value: '刷单'
      }, {
        value: '套现'
      }, {
        value: '线下'
      }, {
        value: '换货'
      }],
      payTypes: [{
        value: '转账'
      }, {
        value: '微信'
      }, {
        value: '支付宝'
      }],
      salesmans: [],
      amountRule: { validator: this.$tool.validateInteger, required: true, trigger: 'blur' },
      discountRule: { validator: this.$tool.validateDiscount, required: true, trigger: 'blur' },
      rules: {
        store: { required: true, message: '请选择店铺', trigger: 'change' },
        order_type: { required: true, message: '请选择订单类型', trigger: 'change' },
        salesman: { required: true, message: '请选择业务员', trigger: 'change' },
        name: { required: true, message: '请输入姓名', trigger: 'change' },
        phone: { required: true, validator: this.$tool.validatePhone, trigger: 'blur' },
        telephone: { required: true, message: '请输入固话', trigger: 'blur' },
        addressee: { required: true, message: '请输入收件人', trigger: 'blur' },
        cityArray: { type: 'array', required: true, message: '请选择省市区', trigger: 'change' },
        address: { required: true, message: '请输入地址', trigger: 'blur' },
        postcode: { required: true, validator: this.$tool.validatePostalCode, trigger: 'blur' },
        postage: { required: true, validator: this.$tool.validateNumber('请输入邮费'), trigger: 'blur' },
        pay_type: { required: true, message: '请选择支付方式', trigger: 'change' },
        pay_account: { required: true, message: '请输入支付账号', trigger: 'blur' },
        invoice_type: { required: true, message: '请选择发票类型', trigger: 'change' },
        invoice_title: { required: true, message: '请输入发票抬头', trigger: 'blur' },
        invoice_content: { required: true, message: '请输入发票内容', trigger: 'blur' },
        logistics_mode: { required: true, message: '请选择货运方式', trigger: 'change' }
      },
      dialogVisible: false,
      SubmitOrderVisible: false,
      restaurants: []
    }
  },
  computed: {
    form() {
      return this.updatedForm
    },
    submitName() {
      return this.form.formTitle === '新建订单' ? '立即下单' : '立即编辑'
    }
  },
  methods: {
    resetForm() {
      this.$refs['form'].resetFields()
    },
    // 搜索建议
    querySearch(queryString, cb) {
      this.$tool.querySearch(this, queryString, cb)
    },
    // 标记产品或者赠品
    handlePopupTable(name) {
      if (name === 'product') {
        this.dialogTitle = '添加锯条'
      } else {
        this.dialogTitle = '添加配件'
      }
      this.dialogVisible = true
    },
    // 总价
    formatAllPrice(row) {
      row.all_price = (row.length * row.amount * row.discount_price).toFixed(2)
      return row.all_price
    },
    // 总重
    formatAllWeight(row) {
      row.all_weight = (row.weight * row.amount).toFixed(2)
      return row.all_weight
    },
    // 添加锯条,转换键名,关闭页面
    handleCloseDialog(val) {
      let selection = val.map(item => {
        return {
          row_uuid: this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999),
          category_uuid: item.categoryUuid,
          brand_uuid: item.brandUuid,
          goods_uuid: item.goodsUuid,
          goods_name: item.name,
          // 零售价
          retail_price: item.retailPrice,
          // 优惠后的价格
          discount_price: item.retailPrice,
          brand: item.brand,
          model: item.model,
          width: item.width,
          category: item.category,
          weight: item.weight,
          supplier: item.supplier,
          cost_price: item.costPrice,
          length: 1,
          sign: this.dialogTitle === '添加锯条' ? 1 : 2,
          amount: 1,
          all_weight: '',
          all_price: ''
        }
      })
      this.$emit('update:goodsList', this.goodsList.concat(selection))
    },
    // 表格单选
    selected(currentRows) {
      this.activeUuid = currentRows.length > 0 ? currentRows : null
    },
    // 删除单行数据
    handleDelete() {
      let goodsList = this.goodsList.filter(item => {
        let flag = true
        this.activeUuid.forEach((value, index, array) => {
          if (item.row_uuid === value.row_uuid) {
            flag = false
            return false
          }
        })
        return flag
      })
      this.$emit('update:goodsList', goodsList)
    },
    handleSubmit(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submit', status)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 查询商店
    queryShop() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.storeOptions = bodyInfo.apiResult.map(item => ({ label: item.storeName, value: item.storeName }))
      })
    },
    // 查询操作人
    querySalesmans() {
      this.$tool.common(this, 'user/list', {
        'userType': 1
      }, bodyInfo => {
        this.salesmans = bodyInfo.apiResult.map(item => ({ label: item.name, value: item.id }))
      })
    },
    // 查询顾客信息
    queryCustomer() {
      this.$tool.loadOptions(this, 'customer/list', bodyInfo => {
        this.restaurants = bodyInfo.apiResult.map(item => {
          return {
          	id: item.id,
            value: item.realName || item.id,
            address: item.address,
            telephone: item.telephone,
            phone: item.phone,
            addressee: item.name,
            postcode: item.postcode,
            netName: item.netName,
            cityArray: [item.province, item.city, item.county]
          }
        })
      })
    },
    // 选择名字后,将该顾客信息放到对应输入框
    handleSelect(item) {
      this.form.address = item.address
      this.form.telephone = item.telephone
      this.form.phone = item.phone
      this.form.addressee = item.addressee
      this.form.postcode = item.postcode
      this.form.cityArray = item.cityArray
    }
  },
  watch: {
    // 产品数据改变随着改变总价
    goodsList: {
      handler: function (val, oldVal) {
        let actualAmount = 0
        let receivableAmount = 0
        val.forEach(item => {
          actualAmount += parseFloat(item.length * item.amount * item.retail_price)
          receivableAmount += parseFloat(item.all_price)
        })
        this.form.actual_money = parseFloat(actualAmount.toFixed(2))
        this.form.receivable_money = parseFloat(receivableAmount.toFixed(2))
        this.form.discount_money = parseFloat((actualAmount - receivableAmount).toFixed(2))
        this.form.discount = parseFloat(((receivableAmount / actualAmount) * 10).toFixed(2)) || ''
      },
      deep: true
    }
  },
  mounted() {
    [this.queryShop, this.querySalesmans, this.queryCustomer].forEach(f => f())
  }
}

</script>
<style lang="scss">
.goods-handle {
  margin-top: 15px;
  margin-bottom: 15px;
}
.order-form-btn {
  margin-top: 60px;
  text-align: center;
  .el-button+.el-button {
    margin-left: 20px;
  }
  .circle-btn {
    width: 100px;
  }
}

.el-table {
  .el-input__inner {
    text-align: center;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}

</style>
