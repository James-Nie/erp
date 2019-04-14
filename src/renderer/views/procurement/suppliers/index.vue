<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" @click="handlePopupForm('add')"><i class="iconfont  "></i>新建供应商</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
      <el-button type="success" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1">修改供应商</el-button>
      <el-button type="danger" @click="handleDelete" :disabled="multipleSelection.length === 0">删除供应商</el-button>
    </div>
    <div class="table-wrapper">
      <el-table ref="multipleTable" :data="supplierList" stripe style="width: 100%" @selection-change="handleSelectionChange" @current-change="selected">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="name" label="供应商名称" align="center">
        </el-table-column>
        <el-table-column prop="contacts" label="供应商联系方式" align="center">
        </el-table-column>
        <el-table-column prop="address" label="供应商地址" align="center">
        </el-table-column>
        <el-table-column label="创建时间" :formatter="$formatter.formatTime('createDatetime')" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-tabs v-model="activeIndex" type="border-card" class="auxiliary-table">
      <el-tab-pane label="日志" name="log">
        <el-table :data="log" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" align="center" width="70">
          </el-table-column>
          <el-table-column prop="operator" label="操作员" align="center" width="100">
          </el-table-column>
          <el-table-column prop="content" label="内容" align="center">
          </el-table-column>
          <el-table-column label="时间" :formatter="$formatter.formatTime('createDatetime')" align="center" width="180">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog custom-class="supplier-form" :title="formTitle" :visible.sync="formVisible" @close="resetForm('form')">
      <el-form :inline="true" ref="form" :rules="rules" :model="form" label-position="left" label-width="93px">
        <div class="clearfix">
          <el-form-item label="供应商名称" class="fl" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="联系人" class="fr">
            <el-input v-model="form.contacts"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="手机号" class="fl" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="地址" class="fr">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="备注" class="fl">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="信用额度" class="fr">
            <el-input v-model="form.credit_line"></el-input>
          </el-form-item>
        </div>   
        <div class="text-center supplier-footer">
          <el-button class="circle-btn" @click="resetForm('form')">取消</el-button>
          <el-button class="circle-btn" type="primary" @click="handleSubmit('form')">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'suppliers-management',
  data() {
    return {
      formVisible: false,
      supplierList: [],
      multipleSelection: [],
      formTitle: '新建供应商',
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      form: {
        user_name: this.$store.getters.getAccount.name,
        name: '',
        contacts: '',
        phone: '',
        address: '',
        remark: '',
        credit_line: ''
      },
      rules: {
        name: { required: true, message: '请输入供应商名字', trigger: 'blur' },
        phone: { validator: this.$tool.validatePhone, trigger: 'blur' }
      },
      current: {},
      log: [],
      activeIndex: 'log'
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    exportExcel() {
      this.$tool.exportExcel(this, 'export/SupplierExcelport')
    },
    // 删除选中
    handleDelete() {
      // 获取选中的id,放入数组supplierUuids
      let supplierIds = this.multipleSelection.map(item => item.id)
      this.$tool.common(this, 'supplier/batchDelete', {
        'supplierIds': supplierIds
      }, bodyInfo => {
        this._loadMainList()
      })
    },
    // 清空,关闭页面
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {
        user_name: this.$store.getters.getAccount.name,
        name: '',
        contacts: '',
        phone: '',
        address: '',
        remark: '',
        credit_line: ''
      }
      this.formVisible = false
    },
    // 新建或者更新供应商页面的提交
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.formTitle === '新建供应商' ? 'supplier/create' : 'supplier/update'
          this.$tool.common(this, url, {
            ...this.form
          }, bodyInfo => {
            this.resetForm('form')
            this._loadMainList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 打开新建或者编辑供应商
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建供应商'
      } else if (formName === 'edit') {
        if (this.multipleSelection.length === 1) {
          let updatedForm = this.multipleSelection[0]
          this.form = Object.assign({}, {
            user_name: this.$store.getters.getAccount.name,
            supplierUuid: updatedForm.supplierUuid,
            name: updatedForm.name,
            contacts: updatedForm.contacts,
            phone: updatedForm.phone,
            address: updatedForm.address,
            remark: updatedForm.remark,
            credit_line: updatedForm.creditLine
          })
        }
        this.formTitle = '编辑供应商'
      }
      this.formVisible = true
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    _loadMainList() {
      this.$tool.loadList(this, 'supplier/list', bodyInfo => {
        this.supplierList = bodyInfo.apiResult
      })
    },
    // 点击一行
    selected(current) {
      this.current = current
      this.queryLog()
    },
    // 获取日志
    queryLog() {
      this.$tool.loadOptions(this, 'order/loglist', bodyInfo => {
        this.log = bodyInfo.LogOrderList
        console.log(bodyInfo.LogOrderList)
      }, {
        'order_number': this.current.supplierUuid
      })
    }
  },
  mounted() {
    this._loadMainList()
  }
}

</script>

<style lang="scss">
.supplier-form {
  width: 650px;
}

.supplier-footer {
  margin-top: 30px;
  .el-button+.el-button {
    margin-left: 20px;
  }
}
</style>
