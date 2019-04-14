<template>
  <div>
    <el-form :inline="true" :rules="rules" :model="addForm" ref="addForm">
      <el-form-item prop="logisticsName">
        <el-input v-model="addForm.logisticsName" placeholder="物流名称"></el-input>
      </el-form-item>
      <el-form-item prop="contacts">
        <el-input v-model="addForm.contacts" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="addForm.phone" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model="addForm.address" placeholder="地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="addForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="addForm.logisticsType" placeholder="托运方式"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleAdd"><i class="iconfont  "></i>添加</el-button>
      <el-button type="danger" icon="delete2" @click="handleDelete" :disabled="multipleSelection.length !== 1">删除</el-button>
    </el-form>
    <el-table :data="LogisticsList" stripe v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="70">
      </el-table-column>
      <el-table-column prop="logisticsName" label="物流名称" align="center">
      </el-table-column>
      <el-table-column prop="contacts" label="联系人" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center">
      </el-table-column>
      <el-table-column prop="address" label="地址" align="center">
      </el-table-column>
      <el-table-column prop="logisticsType" label="托运方式" align="center">
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
      </el-table-column>
      <el-table-column label="是否停用" align="center" :formatter="$formatter.formatDisable">
      </el-table-column>
      <el-table-column label="创建时间" :formatter="formatCreateDatetime">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :page-size="pagination.pageSize" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'logistics-setting',
  data() {
    return {
      multipleSelection: [],
      LogisticsList: [],
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      addForm: {
        'logisticsName': '',
        'contacts': '',
        'phone': '',
        'address': '',
        'remark': '',
        'logisticsType': ''
      },
      rules: {
        'logisticsName': [{ required: true, message: '请输入物流名称', trigger: 'blur' }],
        'contacts': [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        'phone': [{ validator: this.$tool.validatePhone, trigger: 'blur' }],
        'address': [{ required: true, message: '请输入地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取物流信息
    queryLogisticsList() {
      this.loading = true
      this.$http.post('logistics/list', {
        'body': this.pagination
      }).then(res => {
        this.LogisticsList = res.data.apiResult
        this.pagination.total = res.data.count
        this.loading = false
      })
    },
    // 过滤器，过滤日期
    formatCreateDatetime(row, column) {
      return this.$moment(new Date(row.createDatetime)).format('YYYY-MM-DDs hh:mm:ss')
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
//    this.queryLogisticsList()
    },
    // 删除选中物流单
    handleDelete() {
      let logisticsId = this.multipleSelection[0].id
      this.$http.post('logistics/delete', {
        'id': logisticsId
      }).then(res => {
        this.queryLogisticsList()
      })
    },
    // 添加物流信息
    handleAdd() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$http.post('logistics/create', this.addForm).then(res => {
            this.addForm = {
              'logisticsName': '',
              'contacts': '',
              'phone': '',
              'address': '',
              'remark': '',
              'logisticsType': ''
            }
            this.queryLogisticsList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    this.queryLogisticsList()
  }
}

</script>
