<template>
  <div>
    <el-form inline class="customerForm" ref="customerForm" :rules="rules" :model="form" label-width="80px" label-position="right">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" class="w192" placeholder="请选择性别">
          <el-option value="男"></el-option>
          <el-option value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机"></el-input>
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input v-model="form.country" placeholder="请输入国家"></el-input>
      </el-form-item>
      <el-form-item label="省市区" prop="cityArray">
        <el-cascader :options="cityOptions" :props="{value: 'label'}" v-model="form.cityArray" class="w192" placeholder="请输入省市区">
        </el-cascader>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="授信额度" prop="quota">
        <el-input v-model="form.quota" placeholder="请输入授信额度"></el-input>
      </el-form-item>
      <el-form-item label="客户类型" prop="type">
        <el-input v-model="form.type" placeholder="请输入客户类型"></el-input>
      </el-form-item>
      <el-form-item label="网名" prop="net_name">
        <el-input v-model="form.net_name" placeholder="请输入网名"></el-input>
      </el-form-item>
      <el-form-item label="固话">
        <el-input v-model="form.telephone" placeholder="请输入固话"></el-input>
      </el-form-item>
      <el-form-item label="旺旺">
        <el-input v-model="form.wangwang" placeholder="请输入旺旺"></el-input>
      </el-form-item>
      <el-form-item label="QQ">
        <el-input v-model="form.qq" placeholder="请输入QQ"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" placeholder="请输入Email"></el-input>
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-input v-model="form.postcode" placeholder="请输入邮编"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="停用">
        <el-checkbox true-label="2" false-label="1" v-model="form.disable"></el-checkbox>
      </el-form-item>
      <div class="customerfiles-footer">
        <el-button class="circle-btn" @click="handleClose">取消</el-button>
        <el-button class="circle-btn" type="primary" @click="handleSubmit('customerForm')">确认</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import cityOptions from '@/assets/scripts/city-data'
export default {
  name: 'customer-form',
  props: {
    updatedForm: Object,
    formTitle: String
  },
  // 获取客户页面传递过来的数据
  computed: {
    form: {
      get() {
        return this.updatedForm
      },
      set(val) {
        Object.assign(this.updatedForm, val)
      }
    }
  },
  data() {
    return {
      // 城市数组
      cityOptions: cityOptions,
      // 表单验证数组
      rules: {
        name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        sex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        phone: [{ required: true, validator: this.$tool.validatePhone, trigger: 'blur' }],
        country: [{ required: true, message: '请输入国家', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        cityArray: [{ type: 'array', required: true, message: '请选择省市区', trigger: 'change' }],
        type: [{ required: true, message: '请输入客户类型', trigger: 'blur' }],
        quota: [{ required: true, validator: this.$tool.validateQuota('请输入大于零的整数'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 清除数据
    clearFields() {
      this.$refs['customerForm'].resetFields()
    },
    // 清除并关闭数据
    handleClose() {
      this.clearFields()
      this.$tool.parentComponents(this, 'CustomerFiles').customerVisible = false
    },
    // 提交。
    handleSubmit(formName) {
      console.log(this.form.disable)
      this.$refs[formName].validate((valid) => {
        console.log(this.form)
        if (valid) {
          let [province, city, county] = this.form.cityArray
          let url = this.formTitle === '新建客户' ? 'customer/create' : 'customer/update'
          this.$tool.common(this, url, {
            ...this.form,
            'user_name': this.$store.getters.getAccount.name,
            province,
            city,
            county
          }, bodyInfo => {
            this.handleClose()
            this.$tool.parentComponents(this, 'CustomerFiles').queryCustomer()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取城市列表
    getCityArray () {
      this.form.cityArray = []
      this.form.cityArray = [
        this.form.province,
        this.form.city,
        this.form.county
      ]
      console.log(this.form.cityArray)
    }
  },
  mounted() {
    this.getCityArray()
  }
}

</script>
<style lang="scss">
.customerfiles-footer {
  text-align: center;
  margin-top: 60px;
}

.customerForm {
  width: 980px;
  margin: auto;
  .el-form-item {
    margin-left: 30px;
  }
  .el-button+.el-button {
    margin-left: 20px;
  }
}

</style>
