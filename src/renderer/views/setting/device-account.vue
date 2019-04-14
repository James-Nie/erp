<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" @click="handlePopupForm('add')"><i class="iconfont  "></i>添加账号</el-button>
      <el-button type="primary" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>编辑账号</el-button>
      <el-button type="danger" icon="delete2" :disabled="multipleSelection.length === 0" @click="handleDelete">删除账号</el-button>
    </div>
    <el-table :data="accountList" stripe v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
      <el-table-column label="是否停用" :formatter="$formatter.formatDisable" align="center"></el-table-column>
      <el-table-column label="设备类型" prop="type" align="center"></el-table-column>
      <el-table-column label="账号" prop="account" align="center"></el-table-column>
      <el-table-column label="密码" prop="password" align="center"></el-table-column>
      <el-table-column label="修改人" prop="reviseName" align="center"></el-table-column>
      <el-table-column label="创建时间" :formatter="$formatter.formatTime('createDatetime')" align="center"></el-table-column>
      <el-table-column label="修改时间" :formatter="$formatter.formatTime('updateDatetime')" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="changeDisable(scope.row)">{{$formatter.reverseDisable(scope.row)}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog :title="formTitle" custom-class="device-dialog" :visible.sync="formVisible" size="tiny" :before-close="handleClose">
      <el-form ref="form" class="device-form" :rules="rules" :model="form" label-width="80px" label-position="left">
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="form.type">
            <el-option label="平板" value="平板"></el-option>
            <el-option label="PDA" value="PDA"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="车间" prop="workshop_uuid" v-if="form.type === '平板'">
          <el-select v-model="form.workshop_uuid" placeholder="请选择车间">
            <el-option v-for="item in workshopOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouse_uuid" v-if="form.type === 'PDA'">
          <el-select v-model="form.warehouse_uuid" placeholder="请选择仓库">
            <el-option v-for="item in warehouseOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="device-form-footer">
          <el-button class="circle-btn" @click="handleClose">取消</el-button>
          <el-button class="circle-btn" type="primary" @click="handleSubmit('form')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'device-account',
  data() {
    return {
      loading: false,
      formTitle: '新建账号',
      formVisible: false,
      accountList: [],
      workshopOptions: [],
      warehouseOptions: [],
      form: {
        account: '',
        password: '',
        type: '平板',
        workshop_uuid: '',
        warehouse_uuid: '',
        name: this.$store.getters.getAccount.name,
        equipment_uuid: ''
      },
      rules: {
        account: {required: true, message: '请输入账号', trigger: 'blur'},
        password: {required: true, message: '请输入密码', trigger: 'blur'},
        type: {required: true, message: '请选择设备类型', trigger: 'blur'},
        workshop_uuid: {required: true, message: '请选择车间', trigger: 'blur'},
        warehouse_uuid: {required: true, message: '请选择仓库', trigger: 'blur'}
      },
      searchForm: {
        type: ''
      },
      multipleSelection: [],
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    'form.type': function(val) {
      if (val === '平板') {
        this.warehouse_uuid = void 0
      }
      if (val === 'PDA') {
        this.workshop_uuid = void 0
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页查看员工列表
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.queryAccountList()
    },
    // 设置该账号为停用状态
    changeDisable(row) {
      this.$confirm('确认更改停用状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('account/disable', {
          'body': {
            'equipment_uuid': row.equipmentUuid,
            'name': this.$store.getters.getAccount.name,
            'disable': row.disable === '1' ? '2' : '1'
          }
        }).then(res => {
          this.queryAccountList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据formName的不同，向新页面传递不同参数
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建账号'
      } else if (formName === 'edit') {
        let updatedForm = this.multipleSelection[0]
        this.formTitle = '编辑账号'
        this.form = Object.assign({}, {
          account: updatedForm.account,
          password: updatedForm.password,
          workshop_uuid: updatedForm.workshopUuid,
          type: updatedForm.type,
          name: this.$store.getters.getAccount.name,
          equipment_uuid: updatedForm.equipmentUuid
        })
      }
      this.formVisible = true
    },
    // 清空页面
    clearFields() {
      this.form = {
        account: '',
        password: '',
        type: '平板',
        workshop_uuid: '',
        warehouse_uuid: '',
        name: this.$store.getters.getAccount.name,
        equipment_uuid: ''
      }
      this.$refs.form.resetFields()
    },
    // 清空，关闭页面
    handleClose() {
      this.clearFields()
      this.formVisible = false
    },
    // 根据新建或者编辑的不同向不同URL传递数据
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.formTitle === '新建账号' ? 'account/create' : 'account/update'
          this.$tool.common(this, url, this.form, bodyInfo => {
            this.queryAccountList()
            this.handleClose()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除选中账号
    handleDelete() {
      let equipmentUuids = this.multipleSelection.map(item => item.equipmentUuid)
      this.$http.post('account/delete', {
        'body': {
          'equipment_uuids': equipmentUuids,
          'name': this.form.name
        }
      }).then(res => {
        this.queryAccountList()
      })
    },
    // 请求账号列表
    queryAccountList() {
      this.loading = true
      this.$http.post('account/list', {
        'body': {
          type: this.searchForm.type,
          ...this.pagination
        }
      }).then(res => {
        this.accountList = res.data.body.AccountList
        this.pagination.total = res.data.body.total
        this.loading = false
      })
    },
    // 请求车间列表
    loadWorkshopOptions() {
      this.$tool.loadOptions(this, 'workshop/list', bodyInfo => {
        this.workshopOptions = bodyInfo.apiResult.map(item => {
          return {
            label: item.workshopName,
            value: item.workshopUuid
          }
        })
      }, {
	      	workshop_name: ''
	      })
    },
    // 请求车间列表
    queryWarehouse() {
      this.$tool.loadOptions(this, 'warehouse/select', bodyInfo => {
        this.warehouseOptions = bodyInfo.WarehouseList.map(item => {
          return {
            value: item.warehouseUuid,
            label: item.warehouseName
          }
        })
      })
    }
  },
  mounted() {
    [this.queryAccountList, this.loadWorkshopOptions, this.queryWarehouse].forEach(f => f())
  }
}

</script>
<style lang="scss">
.device-dialog {
  width: 420px;
  .device-form {
    margin: auto;
    width: 298px;
  }
  .device-form-footer {
    text-align: center;
    margin-top: 30px;
    .el-button+.el-button {
      margin-left: 20px;
    }
  }
}

</style>
