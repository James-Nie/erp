<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" inline>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="form.warehouseName" placeholder="仓库名称" :disabled="!permission"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleAdd"  :disabled="!permission"><i class="iconfont  "></i>添加</el-button>
      <el-button type="danger" @click="handleDelete" :disabled="!permission || this.multipleSelection.length <= 0" icon="delete2">删除</el-button>
      <el-button type="primary" @click="handleEdit" :disabled="!permission || multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>编辑</el-button>
      <el-button type="primary" @click="handleSave" icon="star-off" :disabled="!permission">保存</el-button>
    </el-form>
    <el-table :data="warehouseList" v-loading="loading" border highlight-current-row @current-change="handleRowClick" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="仓库名" align="center">
       <template slot-scope="scope">
          <el-input v-model="scope.row.warehouseName" size="large" v-if="scope.row.editabled"></el-input>
          <span v-else>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间" :formatter="$formatter.formatTime('updateDatetime')" align="center">
      </el-table-column>
      <el-table-column label="创建时间" :formatter="$formatter.formatTime('createDatetime')" align="center">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'storehouse-management',
  data() {
    return {
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      // 仓库输入规则
      rules: {
        warehouseName: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }]
      },
      loading: false,
      form: {
        warehouseName: ''
      },
      // 仓库列表
      warehouseList: [],
      // 操作仓库id数组
      warehouseUuid: [],
      // 选中行
      multipleSelection: []
    }
  },
  methods: {
    // 编辑仓库
    handleEdit() {
      let row = this.multipleSelection[0]
      row.editabled = true
    },
    // 保存
    handleSave() {
      let rowInfo = this.multipleSelection[0]
      this.$http.post('warehouse/update', {
        'body': rowInfo
      }).then(res => {
        this.queryList()
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // 将选中的仓库id放入warehouseUuid
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.warehouseUuid[i] = this.multipleSelection[i].warehouseUuid
      }
    },
    // 获取仓库列表
    queryList() {
      this.loading = true
      this.$http.post('warehouse/select', {
        'body': this.pagination
      }).then(res => {
        console.log(res)
        this.loading = false
        let bodyInfo = res.data.body
        this.warehouseList = bodyInfo.WarehouseList.map(item => ({'warehouseUuid': item.warehouseUuid, 'editabled': false, ...item}))
        this.pagination.total = bodyInfo.total
      })
    },
    // 添加
    handleAdd() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post('warehouse/create', {
            'body': this.form
          }).then(res => {
            this.form.warehouseName = ''
            this.queryList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除选中仓库
    handleDelete() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('warehouse/delete', {
          'body': {
            warehouseUuids: this.warehouseUuid
          }
        }).then(res => {
          this.queryList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  mounted() {
    this.queryList()
  },
  computed: {
    // 获取权限信息
    permission() {
      return this.$store.getters.hasPermission('warehouseManageWrite')
    }
  }
}

</script>
