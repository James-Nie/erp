<template>
  <div>
    <el-form :inline="true" ref="form" :model="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-select v-model="form.name" placeholder="请选择名称">
          <el-option value="套现"></el-option>
          <el-option value="刷单"></el-option>
        </el-select>        
      </el-form-item>
      <el-form-item label="符号" prop="symbols">
        <el-input v-model="form.symbols" placeholder="请输入提取符号"></el-input>
      </el-form-item>      
      <el-form-item>
        <el-button type="primary" @click="handleClick('form')"><i class="iconfont  "></i>添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="symbolsList">
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="名称" align="center">
      </el-table-column>
      <el-table-column prop="symbols" label="符号" align="center">
      </el-table-column>      
      <el-table-column label="是否停用" align="center" :formatter="$formatter.formatDisable">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="handleUpdate(scope.row)">{{$formatter.reverseDisable(scope.row)}}</el-button>
        </template>
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
  name: 'ExtractSettings',
  data() {
    return {
      form: {
        name: '',
        symbols: ''
      },
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        name: [{required: true, message: '请选择名称', trigger: 'change'}],
        symbols: [{required: true, message: '请输入提取符号', trigger: 'blur'}]
      },
      symbolsList: []
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.querySymbols()
    },
    // 添加快捷键
    handleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$tool.common(this, 'symbols/create', this.form, bodyInfo => {
            this.querySymbols()
            this.resetForm()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    querySymbols() {
      this.$tool.loadList(this, 'symbols/list', bodyInfo => {
        this.symbolsList = bodyInfo.apiResult
      })
    },
    // 更新快捷键
    handleUpdate(row) {
      this.$tool.confirm(this, '更改状态', () => {
        this.$tool.common(this, 'symbols/disable', {
          disable: row.disable === '1' ? '2' : '1',
          symbols_uuid: row.symbolsUuid
        }, bodyInfo => {
          this.querySymbols()
        })
      })
    }
  },
  mounted() {
    this.querySymbols()
  }
}
</script>