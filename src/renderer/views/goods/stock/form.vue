<template>
  <el-form inline ref="form" :model="form" :rules="rules" label-width="82px">
    <el-form-item label="原料名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入名称" class="w160">
      </el-input>
    </el-form-item>
    <el-form-item label="品牌" prop="brandId">
      <el-select class="w160" v-model="form.brandId" placeholder="请选择品牌">
        <el-option v-for="item in brand_options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="仓库" prop="storageLocation">
      <el-select class="w160" v-model="form.storageLocation" placeholder="请选择仓库">
        <el-option v-for="item in brand_options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="规格齿型" prop="toothSharp">
      <el-input v-model="form.toothSharp" placeholder="请输入齿形" class="w160">
      </el-input>
    </el-form-item>
    <el-form-item label="宽度" prop="width">
      <el-input v-model="form.width" placeholder="最多带两位小数" class="w160">
        <template slot="append">mm</template>
      </el-input>
    </el-form-item>
    <el-form-item label="最低持有" prop="minHoldValue">
      <el-input v-model="form.minHoldValue" placeholder="最多带两位小数" class="w160">
      </el-input>
    </el-form-item>
    <el-form-item label="采购值" prop="defaultAddValue">
      <el-input v-model="form.defaultAddValue" placeholder="请输入默认采购值" class="w160">
      </el-input>
    </el-form-item>
    <el-form-item label="单位重量" prop="weight">
      <el-input v-model="form.weight" placeholder="最多带两位小数" class="w160">
        <template slot="append">Kg</template>
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
  name: 'stock-form',
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
      category_options: [],
      goods_types: [
      	{
      		id: 0,
      		name: '其他'
      	},
      	{
      		id: 1,
      		name: '锯条'
      	},
      	{
      		id: 2,
      		name: '配件'
      	},
      	{
      		id: 3,
      		name: '赠品'
      	},
      	{
      		id: 4,
      		name: '锯床'
      	},
      	{
      		id: 5,
      		name: '锯骨机'
      	}
      ],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      rules: {
//      brandId: [{ required: false, type: 'number', message: '选择品牌', trigger: 'change' }],
//      toothSharp: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        name: [{ required: true, message: '输入货品名称', trigger: 'blur' }],
        width: [{required: true, validator: this.$tool.validateNumber('请输入正确的宽度'), trigger: 'blur'}]
      }
    }
  },
  mixins: [mixin],
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
    // 获取分类列表
    queryCategorys(uuids) {
      this.$tool.common(this, 'category/list', {
        'pageIndex': 1,
        'pageSize': 10000
      }, bodyInfo => {
      	this.category_options = bodyInfo.apiResult
      })
    },
    queryBrands() {
      this.$tool.common(this, 'brand/list', {
        'pageIndex': 1,
        'pageSize': 10000
      }, bodyInfo => {
      	this.brand_options = bodyInfo.apiResult
      })
    },
    // 保存。根据不同的formTitle向不同接口提交数据
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.formTitle === '新建货品' ? 'stock/create' : 'stock/update'
          this.$tool.common(this, url, {
            name: this.form.name,
        		brandId: this.form.brandId,
        		toothSharp: this.form.toothSharp,
        		width: parseInt(this.form.width),
        		minHoldValue: parseInt(this.form.minHoldValue),
        		defaultAddValue: parseInt(this.form.defaultAddValue),
        		storageLocation: this.form.storageLocation
          }, bodyInfo => {
            // 提交成功，关闭页面，刷新
            this.handleClose()
            this.$parent.$parent._loadMainList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearFields() {
      this.$refs['form'].resetFields()
    },
    handleClose() {
      this.clearFields()
      this.$parent.$parent.formVisible = false
    }
  },
  mounted() {
    this.queryBrands()
    this.queryCategorys()
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
.el-form-item {
    margin-bottom: 10px;
}

</style>
