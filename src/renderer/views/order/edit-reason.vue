<template>
  <div>
    <el-form :inline="true" :model="form" ref="form" :rules="rules">
      <el-form-item label="原因" prop="content">
        <el-input v-model="form.content" placeholder="输入原因"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleAdd('form')"><i class="iconfont  "></i>添加</el-button>
      </el-form-item>
      <el-button type="danger" @click="handleDelete" icon="delete2" :disabled="multipleSelection.length === 0">删除</el-button>
    </el-form>
    <el-table :data="reasonList" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="content" label="原因" :true-label="2" :false-label="1" align="center">
      </el-table-column>
      <el-table-column label="停用" align="center" :formatter="$formatter.formatDisable">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="handleUpdate(scope.row)">{{$formatter.reverseDisable(scope.row)}}</el-button>
        </template>
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
  name: 'EditReason',
  data() {
    return {
      form: {
        content: ''
      },
      rules: {
        content: [{required: true, message: '请输入原因', trigger: 'change'}]
      },
      reasonList: [],
      multipleSelection: [],
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.loadReason()
    },
    handleAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$tool.common(this, 'reason/create', this.form, bodyInfo => {
            this.form.content = ''
            this.loadReason()
          })
        }
      })
    },
    handleUpdate(row) {
      this.$tool.confirm(this, '更改状态', () => {
        this.$tool.common(this, 'reason/disable', {
          'reason_uuid': row.reasonUuid,
          'disable': row.disable === 1 ? 2 : 1
        }, bodyInfo => {
          this.loadReason()
        })
      })
    },
    handleDelete() {
      let uuids = this.multipleSelection.map(item => item.reasonUuid)
      this.$tool.common(this, 'reason/delete', {'reason_uuids': uuids}, bodyInfo => {
        this.OrderGoodsList = bodyInfo.OrderGoodsList
        this.loadReason()
      })
    },
    loadReason() {
      this.$tool.loadList(this, 'reason/list', bodyInfo => {
        this.reasonList = bodyInfo.ReasonList
      })
    }
  },
  mounted() {
    this.loadReason()
  }
}

</script>
