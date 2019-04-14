<template>
  <div class="brand-management">
    <div class="mgb15">
      <el-button :plain="true" type="success" @click="handlePopupForm('add')" :disabled="!brandManageRead">新建品牌</el-button>
      <el-button :plain="true" type="warning" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1">修改品牌</el-button>
      <el-button :plain="true" type="danger" @click="handleDelete" :disabled="multipleSelection.length === 0">删除品牌</el-button>
      <el-button :plain="true" type="primary" @click="exportExcel">导出</el-button>
    </div>
    <div class="search-condition">
    	<el-form inline ref="searchForm" :model="searchForm" label-width="80px">
        <el-form-item label="搜索条件:">
          <el-input v-model="searchForm.name" class="w160"></el-input>
        </el-form-item>
        <el-button :plain="true" type="primary" @click="search">搜索</el-button>
     </el-form>
  	</div>
    <el-table border :data="brandList" v-loading="loading" stripe @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称" align="center">
      </el-table-column>
      <el-table-column label="品牌简称" align="center" :formatter="formatsShortName">
      </el-table-column>
      <el-table-column label="创建时间" :formatter="formatCreateTime" align="center">
      </el-table-column>
      <el-table-column label="最后修改人" :formatter="formatModifier" align="center">
      </el-table-column>
      <el-table-column prop="last_modified_time" label="最后修改时间" :formatter="formatUpdateDatetime" align="center">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" 
      	layout="total, sizes, prev, pager, next" 
      	:page-size="pagination.pageSize" 
      	:total="pagination.total" 
      	:current-page.sync="pagination.pageIndex" 
      	@size-change="handleSizeChange"
      	@current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog custom-class="add-brand-Form box-shadow" :title="formTitle" :modal="false" :visible.sync="formVisible" size="tiny" :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="品牌名称" prop="brand">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌简称">
          <el-input v-model="form.shortName"></el-input>
        </el-form-item>
        <el-form-item label="是否停用">
          <el-checkbox :true-label="trueLabel" :false-label="falseLabel" v-model="form.disable"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleClose" size="medium" style="margin-left:90px;">取 消</el-button>
          <el-button type="primary" @click="handleSubmitForm('form')" size="medium" style="margin-left:33px;">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'brands-management',
  data() {
    return {
      formTitle: '新建品牌',
      loading: false,
      trueLabel: 2,
      falseLabel: 1,
      pagination: {
        pageIndex: 1,
        pageSize: 10
      },
      form: {
      	brandId: '',
        name: '',
        shortName: '',
        disable: '1'
      },
      searchForm: {
        name: ''
      },
      multipleSelection: [],
      formVisible: false,
      rules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
      },
      brandList: []
    }
  },
  computed: {
    // 获取权限信息
    brandManageRead() {
      return this.$store.getters.hasPermission('brandManageWrite')
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/BrandExcelport')
    },
    // 新建或者编辑
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建品牌'
      } else if (formName === 'edit') {
        if (this.multipleSelection.length === 1) {
          this.form.name = this.multipleSelection[0].name
          this.form.shortName = this.multipleSelection[0].shortName
          this.form.disable = this.multipleSelection[0].disable
          this.form.brandId = this.multipleSelection[0].id
        }
        this.formTitle = '编辑品牌'
      }
      this.formVisible = true
    },
    // 根据不同formTitle 向不同url提交数据
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.formTitle === '新建品牌' ? 'brand/create' : 'brand/update'
          this.$http.post(url, this.form).then(res => {
            this.handleClose()
            this.queryList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 过滤器 没有内容则显示---
    formatsShortName(row, column) {
      return row.shortName || '---'
    },
    // 时间过滤器 将内容过滤为日期格式,没有内容则显示---
    formatUpdateDatetime(row, column) {
      if (row.updateDatetime) {
        return this.$moment(new Date(row.updateDatetime)).format('YYYY-MM-DD hh:mm:ss')
      }
      return '---'
    },
    // 过滤器 没有内容则显示---
    formatModifier(row, column) {
      return row.name || '---'
    },
    // 时间过滤器 将内容过滤为日期格式
    formatCreateTime(row, column) {
      return this.$moment(row.createDatetime).format('YYYY-MM-DD hh:mm:ss')
    },
    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 每页多少条
    handleSizeChange(val) {
    	this.pagination.pageSize = val
      this.queryList()
    },
    // 分页,刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.queryList()
    },
    // 删除选中行
    handleDelete() {
      let brandIds = this.multipleSelection.map(item => item.id)
      this.$http.post('brand/batchDelete', {
          'brandIds': brandIds
      }).then(res => {
        this.multipleSelection = []
        this.queryList()
      })
    },
    // 关闭并清空
    handleClose() {
      this.formVisible = false
      this.$refs['form'].resetFields()
      this.form = {
      	brandId: '',
        name: '',
        shortName: '',
        disable: '1'
      }
    },
    // 获取品牌列表
    queryList() {
      this.loading = true
      this.$http.post('brand/list', {
        ...this.pagination,
        disable: 1
      }).then(res => {
        this.brandList = res.data.apiResult
        this.loading = false
        this.$http.post('brand/list', {
	        'body': {
	        	pageIndex: 1,
		        pageSize: 1000
	        }
	      }).then(res => {
	        this.pagination.total = res.data.apiResult.length
	      })
      })
    }
  },
  mounted() {
    this.queryList()
  }
}
</script>

<style lang="scss">
.add-brand-Form {
  width: 600px;
  .el-form {
    width: 540px;
    .el-form-item {
			margin-bottom: 16px;
		}
  }
  .el-dialog__body {
    padding-bottom: 0;
  }
}
</style>
