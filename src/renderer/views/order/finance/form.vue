<template>
  <el-form inline ref="form" :model="form" :rules="rules" label-width="107px">
    <el-form-item label="店铺" prop="storeType">
      <el-select v-model="form.storeType" placeholder="请选择" class="w192">
        <el-option v-for="item in store_options" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="发票类型" prop="invoiceType">
      <el-select v-model="form.invoiceType" placeholder="请选择" class="w192">
        <el-option v-for="item in invoice_options" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="发票号码" prop="invoiceNumber">
      <el-input v-model="form.invoiceNumber" placeholder="发票号码" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="发票代码" prop="invoiceCode">
      <el-input v-model="form.invoiceCode" placeholder="发票代码" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="单位名称" prop="unitName">
      <el-input v-model="form.unitName" placeholder="单位名称" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="注册地址" prop="registerAddress">
      <el-input v-model="form.registerAddress" placeholder="注册地址" class="w192">
      </el-input>
    </el-form-item>
    <el-form-item label="注册电话" prop="registerPhone">
      <el-input v-model="form.registerPhone" placeholder="注册电话" class="w192">
      </el-input>
    </el-form-item>
    <el-form-item label="发票金额" prop="invoiceAmount">
      <el-input v-model="form.invoiceAmount" placeholder="发票金额" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="税务登记代码" prop="taxCode">
      <el-input v-model="form.taxCode" placeholder="税务登记代码" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="开户银行" prop="acountBank">
      <el-input v-model="form.acountBank" placeholder="开户银行" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="开户账号" prop="acountNumber">
      <el-input v-model="form.acountNumber" placeholder="开户账号" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="收票人手机" prop="recieverPhone">
      <el-input v-model="form.recieverPhone" placeholder="收票人手机" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="收票人姓名" prop="recieverName">
      <el-input v-model="form.recieverName" placeholder="收票人姓名" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="收票人地址" prop="recieverAddress">
      <el-input v-model="form.recieverAddress" placeholder="收票人地址" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="收款人" prop="payee">
      <el-input v-model="form.payee" placeholder="收款人" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="复核人" prop="reviewer">
      <el-input v-model="form.reviewer" placeholder="复核人" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="开票人" prop="ticketHolder">
      <el-input v-model="form.ticketHolder" placeholder="开票人" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remarks">
      <el-input v-model="form.remarks" placeholder="备注" class="w192"></el-input>
    </el-form-item>
    <el-form-item label="原始单号" prop="orignalNumber">
      <el-input v-model="form.orignalNumber" placeholder="原始单号" disabled class="w192"></el-input>
    </el-form-item>
    <div class="finance-form-footer">
      <el-button @click="resetForm" class="circle-btn">取 消</el-button>
      <el-button type="primary" @click="handleSubmitForm('form')" class="circle-btn">保 存</el-button>
    </div>
  </el-form>
</template>
<script>
import mixin from '@/mixins'
export default {
  name: 'finance-form',
  props: {
    formTitle: String,
    orignalNumber: [String, Number]
  },
  data() {
    return {
      store_options: ['淘宝', '京东', '线下'],
      invoice_options: ['普通发票', '普通增值税发票', '专用增值税发票'],
      form: {
      	storeType: '',
      	invoiceType: '',
      	invoiceNumber: '',
      	invoiceCode: '',
      	unitName: '',
      	registerAddress: '',
      	registerPhone: '',
      	invoiceAmount: '',
      	taxCode: '',
      	acountBank: '',
      	acountNumber: '',
      	recieverPhone: '',
      	recieverName: '',
      	recieverAddress: '',
      	payee: '',
      	reviewer: '',
      	ticketHolder: '',
      	remarks: '',
      	orignalNumber: this.orignalNumber
      },
      rules: {
        storeType: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        invoiceType: [{ required: true, message: '请选择发票类型', trigger: 'change' }],
        invoiceNumber: [{ required: true, message: '请输入发票号码', trigger: 'blur' }],
        invoiceCode: [{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        invoiceAmount: [{ required: true, message: '请输入发票金额', trigger: 'blur' }],
        recieverPhone: [{ required: true, message: '请输入收票人手机', trigger: 'blur' }],
        recieverName: [{ required: true, message: '请输入收票人姓名', trigger: 'blur' }],
        recieverAddress: [{ required: true, message: '请输入收票人地址', trigger: 'blur' }]
      }
    }
  },
  mixins: [mixin],
  // 获取数据
  computed: {},
  methods: {
    // 根据formTitle，向不同接口传递数据
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'invoice/create'
          this.$http.post(url, {
            'body': this.form
          }).then(res => {
            this.resetForm()
            this.$parent.$parent._loadMainList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 清空
    clearFields() {
      this.$refs['form'].resetFields()
      this.form = {
      	storeType: '',
      	invoiceType: '',
      	invoiceNumber: '',
      	invoiceCode: '',
      	unitName: '',
      	registerAddress: '',
      	registerPhone: '',
      	invoiceAmount: '',
      	taxCode: '',
      	acountBank: '',
      	acountNumber: '',
      	recieverPhone: '',
      	recieverName: '',
      	recieverAddress: '',
      	payee: '',
      	reviewer: '',
      	ticketHolder: '',
      	remarks: '',
      	orignalNumber: ''
      }
    },
    // 关闭清空
    resetForm() {
      this.clearFields()
      this.$parent.$parent.formVisible = false
    }
  },
  mounted() {
    this.queryBrands()
    this.querySuppliers()
  }
}

</script>
<style lang="scss">
.finance-form {
  .plain-btn {
    border-radius: 24px;
  }
  .finance-form-footer {
    text-align: center;
    margin-top: 30px;
  }
  .el-button+.el-button {
    margin-left: 20px;
  }
}

</style>
