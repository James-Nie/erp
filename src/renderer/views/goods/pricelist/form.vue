<template>
  <el-form inline ref="form" :model="form" :rules="rules" label-width="110px">
    <el-form-item label="品牌" prop="brand_uuid">
      <el-select class="w192" v-model="form.brand_uuid" placeholder="请选择品牌">
        <el-option v-for="item in brand_options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="规格" prop="model">
      <el-input v-model="form.model" placeholder="请输入规格" class="w192">
      </el-input>
    </el-form-item>
    <el-form-item label="供应商" prop="supplier">
      <el-select class="w192" v-model="form.supplier" placeholder="请选择供应商">
        <el-option v-for="item in supplier_options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="零售价" prop="retail_price">
      <el-input v-model="form.retail_price" placeholder="最多带两位小数" class="w192">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="分类" prop="categoryArray">
      <el-cascader :options="categoryOptions" :show-all-levels="false" v-model="form.categoryArray" @active-item-change="handleItemChange" :props="props" class="w192"></el-cascader>
    </el-form-item>
    <el-form-item label="单重" prop="weight">
      <el-input v-model="form.weight" placeholder="最多带两位小数" class="w192">
        <template slot="append">kg</template>
      </el-input>
    </el-form-item>
    <el-form-item label="真实财务成本" prop="cost_price">
      <el-input v-model="form.cost_price" placeholder="最多带两位小数" class="w192">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="宽度" prop="width">
      <el-input v-model="form.width" placeholder="最多带两位小数" class="w192">
        <template slot="append">m</template>
      </el-input>
    </el-form-item>
    <div class="text-center goods-files-footer">
      <el-button @click="handleClose" class="circle-btn">取 消</el-button>
      <el-button type="primary" @click="handleSubmitForm('form')" class="circle-btn">保 存</el-button>
    </div>
  </el-form>
</template>
<script>
import mixin from '@/mixins'
export default {
  name: 'pricelist-form',
  props: {
    formTitle: String,
    categoryOptions: Array,
    updated_form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      brand_options: [],
      supplier_options: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      rules: {
        brand_uuid: [{ required: true, message: '请输入品牌', trigger: 'change' }],
        model: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        supplier: [{ required: true, message: '请输入供应商', trigger: 'change' }],
        retail_price: [{ required: true, validator: this.$tool.validateNumber('请输入零售价'), trigger: 'blur' }],
        cost_price: [{ required: true, validator: this.$tool.validateNumber('请输入真实财务成本'), trigger: 'blur' }],
        weight: [{ required: true, validator: this.$tool.validateNumber('请输入单重'), trigger: 'blur' }],
        width: [{ validator: this.$tool.validateNumber('请输入宽度'), trigger: 'blur' }],
        categoryArray: [{type: 'array', required: true, message: '请选择分类', trigger: 'change'}]
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
      set(val) {
        Object.assign(this.form, val)
      }
    }
  },
  methods: {
    // 分类改变时，获取改变的值，提交刷新
    handleItemChange(uuids) {
      let activeUuid = uuids[uuids.length - 1]
      let activeItem = this.$tool.querySelector(this.categoryOptions, 'value', activeUuid)[0]
      this.$tool.common(this, 'category/list', {
        depth: activeItem.depth + 1,
        categoryUuid: activeItem.value
      }, bodyInfo => {
        const child = activeItem.depth === 0 ? {
          'children': []
        } : {}
        activeItem.children = bodyInfo.categoryList.map((item, index) => {
          return {
            'index': index,
            'label': item.category,
            'value': item.categoryUuid,
            'depth': item.depth,
            ...child
          }
        })
      })
    },
    // 保存。根据不同的formTitle向不同接口提交数据
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.formTitle === '新建配件管理' ? 'goods/create' : 'goods/update'
          let categoryUuid = this.form.categoryArray[this.form.categoryArray.length - 1]
          this.$tool.common(this, url, {
            category_uuid: categoryUuid,
            ...this.form
          }, bodyInfo => {
            this.handleClose()
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
    },
    // 关闭页面,清空数据
    handleClose() {
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
.goods-files-footer {
  margin-top: 30px;
  .el-button+.el-button {
    margin-left: 20px;
  }
}

</style>
