<template>
  <el-form inline ref="form" :model="form" :rules="rules" label-width="107px">
    <el-form-item label="品牌" prop="brand_uuid">
      <el-select v-model="form.brand_uuid" placeholder="请选择" class="w192">
        <el-option v-for="item in brand_options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="规格" prop="model">
      <el-input v-model="form.model" placeholder="请输入规格" class="w192">
      </el-input>
    </el-form-item>
    <el-form-item label="宽度" prop="width">
      <el-input v-model="form.width" placeholder="最多带两位小数" class="w192">
        <template slot="append">mm</template>
      </el-input>
    </el-form-item>
    <el-form-item label="最大料头尺寸" prop="head_size">
      <el-input v-model="form.head_size" placeholder="请输入料头设置" class="w192">
        <template slot="append">mm</template>
      </el-input>
    </el-form-item>
    <el-form-item label="销售成本" prop="retail_price">
      <el-input v-model="form.retail_price" placeholder="最多带两位小数" class="w192">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="真实财务成本" prop="cost_price">
      <el-input v-model="form.cost_price" placeholder="最多带两位小数" class="w192">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="供应商" prop="supplier">
      <el-select v-model="form.supplier" placeholder="请选择" class="w192">
        <el-option v-for="item in supplier_options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <div class="sawblade-Form-footer">
      <el-button @click="resetForm" class="circle-btn">取 消</el-button>
      <el-button type="primary" @click="handleSubmitForm('form')" class="circle-btn">保 存</el-button>
    </div>
  </el-form>
</template>
<script>
import mixin from '@/mixins'
export default {
  name: 'sawblade-form',
  props: {
    formTitle: String,
    updated_form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      brand_options: [],
      supplier_options: [],
      rules: {
        brand_uuid: [{ required: true, message: '请选择品牌名称', trigger: 'change' }],
        model: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        width: [{ required: false }],
        head_size: [{ required: false }],
        tooth: [{ required: true, message: '请输入料头设置', trigger: 'blur' }],
        supplier: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        retail_price: [{ required: true, validator: this.$tool.validateNumber('请输入销售成本'), trigger: 'blur' }],
        cost_price: [{ required: true, validator: this.$tool.validateNumber('请输入真实财务成本'), trigger: 'blur' }]
      }
    }
  },
  mixins: [mixin],
  // 获取数据
  computed: {
    form: {
      get() {
        return this.updated_form
      },
      set(newValue) {
        Object.assign(this, newValue)
      }
    }
  },
  methods: {
    // 根据formTitle，向不同接口传递数据
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.formTitle === '新建锯条' ? 'saw/create' : 'saw/update'
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
      this.$parent.$parent.form = {
        sawUuid: '',
        brand: '',
        model: '',
        width: '',
        supplier: '',
        retail_price: ''
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
.sawblade-Form {
  .plain-btn {
    border-radius: 24px;
  }
  .sawblade-Form-footer {
    text-align: center;
    margin-top: 30px;
  }
  .el-button+.el-button {
    margin-left: 20px;
  }
}

</style>
