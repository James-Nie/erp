<template>
  <div class="goods-Classification">
    <div class="goods-Classification-handle">
      <el-button type="success" @click="handlePopupForm('add')"><i class="iconfont icon-xinjian"></i>新建分类</el-button>
    </div>
    <div class="el-tree-box">
      <el-tree :data="categoryList" default-expand-all ref="el-tree" :props="props" :expand-on-click-node="false" :load="loadNode" :render-content="renderContent" lazy>
      </el-tree>
    </div>
    <el-dialog custom-class="newGroup box-shadow" :title="formTitle" :visible.sync="formVisible" size="tiny" :before-close="handleClose" :modal="false">
      <el-form class="dialog-content" ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="分类名字" prop="category">
          <el-input v-model="form.name"></el-input>
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
      form: {
        id: '',
        name: '',
        parentId: '',
        remark: '',
        depth: ''
      },
      rules: {
        category: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      categoryList: [],
      props: {
        label: 'category',
        children: 'children'
      }
    }
  },
  methods: {
    // 清空
    resetForm() {
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: '',
        parentId: '',
        remark: '',
        depth: ''
      }
    },
    // 关闭,清空
    handleClose() {
      this.resetForm()
      this.formVisible = false
    },
    // 获取便签
    loadNode(node, resolve) {
      this.queryList(node, resolve)
    },
    // 新建分类
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建分类'
        this.formType = 'add'
      }
      this.formVisible = true
    },
    // 获取所有分类列表
    queryAllList() {
      this.queryList({ level: 0, data: {} }, list => {
        this.categoryList = list
      })
    },
    handleAdd(data) {
      this.formTitle = '新建子分类'
      this.formType = 'add'
      this.form.parentId = data.categoryUuid
      this.formVisible = true
    },
    handleEdit(data) {
      this.formTitle = '编辑'
      this.formType = 'eidt'
      this.form = Object.assign({}, data)
      this.formVisible = true
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
    deleteCategory(data) {
      this.$tool.common(this, 'category/delete', {
        'categoryId': data.id
      }, bodyInfo => {
        this.$store.commit('setDateTime', this.$moment().format('YYYY-MM-DD HH:mm:ss'))
        this.queryAllList()
      })
    },
    // 渲染分类列表
    renderContent (h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.name}</span>
          </span>
          <span style="float: right; margin-right: 20px">
            { !data.parentId &&
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.isAddForm() ? 'category/create' : 'category/update'
          this.$http.post(url, this.form).then(res => {
            this.handleClose()
            this.queryAllList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    queryList(node, resolve) {
      this.$http.post('category/list', {
        'categoryId': node.data.id,
        'pageIndex': 0,
        'pageSize': 20
      }).then(res => {
        let categoryList = res.data.apiResult.map(item => {
          return {
            name: item.name,
            id: item.id,
            parentId: item.parentId,
            remark: item.remark
          }
        })
        resolve(categoryList)
      })
    }
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
