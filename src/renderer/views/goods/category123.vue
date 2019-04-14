<template>
  <div class="goods-Classification">
  	<div class="search-condition">
  		筛选条件：
  	</div>
    <div class="goods-Classification-handle mgb15" >
      <el-button type="primary" @click="handlePopupForm('add')"><i class="iconfont"></i>新建分类</el-button>
      <el-button type="primary" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-xiugai"></i>修改分类</el-button>
      <el-button type="primary" @click="deleteCategory()" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-shanchu"></i>删除分类</el-button>
    </div>
    <div class="el-tree-box">
      <!--<el-tree :data="categoryList" default-expand-all ref="el-tree" :props="props" :expand-on-click-node="false" :load="loadNode" :render-content="renderContent" lazy>
      </el-tree>-->
      <el-table border :data="categoryList" stripe  style="width: 100%" @selection-change="handleSelectionChange">
	      <el-table-column type="selection" width="55" align="center">
	      </el-table-column>
	      <el-table-column type="index" label="序号" width="100" align="center">
	      </el-table-column>
	      <el-table-column prop="categoryName" label="分类名称" align="center">
	      </el-table-column>
	      <el-table-column label="备注" align="center" prop="remark">
	      </el-table-column>
	      <el-table-column label="创建时间" :formatter="formatCreateTime" align="center">
	      </el-table-column>
	      <el-table-column label="修改时间" :formatter="formatUpdateTime" align="center">
	      </el-table-column>
	    </el-table>
    </div>
    <el-dialog custom-class="newGroup box-shadow" :title="formTitle" :visible.sync="formVisible" size="tiny" :before-close="handleClose" :modal="false">
      <el-form class="dialog-content" ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="一级分类" prop="name">
          <el-input v-model="form.oneCategoryName"></el-input>
        </el-form-item>
        <el-form-item label="二级分类" prop="name">
          <el-input v-model="form.twoCategoryName"></el-input>
        </el-form-item>
        <el-form-item label="三级分类" prop="name">
          <el-input v-model="form.threeCategoryName"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('form')">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'goods-category',
  data() {
    return {
      formVisible: false,
      formTitle: '新建分类',
      formType: 'add',
      multipleSelection: [],
      form: {
        categoryId: '',
        categoryName: '',
        remark: ''
      },
      rules: {
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      categoryList: [],
      props: {
//      label: 'category',
        children: 'children'
      }
    }
  },
  methods: {
    // 清空
    resetForm() {
      this.$refs['form'].resetFields()
      this.form = {
        categoryId: '',
        categoryName: '',
        remark: ''
      }
    },
    // 时间过滤器 将内容过滤为日期格式
    formatCreateTime(row, column) {
      return this.$moment(row.createDatetime).format('YYYY-MM-DD hh:mm:ss')
    },
    // 时间过滤器 将内容过滤为日期格式
    formatUpdateTime(row, column) {
      return this.$moment(row.updateDatetime).format('YYYY-MM-DD hh:mm:ss')
    },
    // 关闭,清空
    handleClose() {
      this.resetForm()
      this.formVisible = false
    },
    // 获取便签
    loadNode(node, resolve) {
//    this.queryList(node, resolve)
    },
    // 新建分类
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建分类'
        this.formType = 'add'
      } else {
      	this.formTitle = '修改分类'
        this.formType = 'edit'
        this.form = {
        	categoryId: this.multipleSelection[0].categoryId,
        	name: this.multipleSelection[0].categoryName,
        	remark: this.multipleSelection[0].remark
        }
      }
      this.formVisible = true
    },
    // 获取所有分类列表
    queryAllList() {
      this.$tool.common(this, 'category/list', {
    		pageIndex: 0,
    		pageSize: 100
	    }, bodyInfo => {
      	this.categoryList = bodyInfo.apiResult.map(item => {
          return {
            categoryName: item.categoryName,
            categoryId: item.id,
            remark: item.remark
          }
        })
	    })
    },
    handleAdd(data) {
      this.formTitle = '新建子分类'
      this.formType = 'add'
      this.form.p_uuid = data.categoryId
      this.formVisible = true
    },
    handleEdit() {
      this.formTitle = '编辑'
      this.formType = 'eidt'
      this.form = Object.assign({}, this.multipleSelection[0])
      this.formVisible = true
    },
    // 多选
	  handleSelectionChange(val) {
	    this.multipleSelection = val
	    console.log(this.multipleSelection)
	  },
    // 删除按钮处理函数
    handleDelete(node, data) {
      if (node.childNodes.length > 0) {
        this.$confirm('删除主类目将同时删除所有其下子类目，请确认！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCategory(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消刪除'
          })
        })
      } else {
        this.$tool.confirm(this, '删除', () => {
          this.deleteCategory(data)
        })
      }
    },
    // 删除分类
    deleteCategory() {
    	this.$http.post('category/delete', {
        'categoryId': this.multipleSelection[0].categoryId
      }).then(res => {
      	this.queryAllList()
      })
    },
    // 渲染分类列表
    renderContent (h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span style="float: right; margin-right: 20px">
            { data.depth < 2 &&
            <el-button type="text" size="mini" on-click={ (e) => {
              e.stopPropagation()
              return this.handleAdd(data)
            } }>新建子分类</el-button>
            }
            <el-button type="text" size="mini" on-click={ (e) => {
              e.stopPropagation()
              return this.handleEdit(data)
            } }>编辑</el-button>
            <el-button type="text" size="mini" on-click={ (e) => {
              e.stopPropagation()
              return this.handleDelete(node, data)
            } }>删除</el-button>
          </span>
        </span>
      )
    },
    // 判断新建，返回true
    isAddForm() {
      return this.formType === 'add'
    },
    handleSubmit(formName) {
    	console.log(112, this.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.isAddForm() ? 'category/create' : 'category/update'
          let params = this.isAddForm() ? {
          	name: this.form.name,
						remark: this.form.remark
          } : this.form
          this.$http.post(url, {
            'body': params
          }).then(res => {
            this.handleClose()
            this.queryAllList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    this.queryAllList()
  }
}

</script>
<style lang="scss">
.el-tree-box {
  height: 442px;
  overflow: auto;
}
.el-tree {
  margin-top: 15px;
  border: none;
}

.dialog-content {
  width: 80%;
  margin: auto;
}

.newGroup {
  width: 514px;
}

.el-tree-node__content {
  .el-button+.el-button {
      margin-left: 20px;
  }
}
</style>
