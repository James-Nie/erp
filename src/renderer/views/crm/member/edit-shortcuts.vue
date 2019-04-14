<template>
  <div>
    <el-form :inline="true" :model="editShortcuts">
      <el-form-item label="快捷键内容">
        <el-input v-model="editShortcuts.content" placeholder="请输入快捷键内容"></el-input>
      </el-form-item>   
      <el-form-item>
        <el-button type="primary" @click="handleAdd"><i class="iconfont  "></i>添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave" icon="star-off">保存</el-button>
      </el-form-item>      
      <el-form-item>
        <el-button type="primary" @click="handleEdit" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>编辑</el-button>
      </el-form-item>   
      <el-form-item>
        <el-button type="danger" @click="handleDelete" icon="delete2" :disabled="multipleSelection.length === 0">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="quickList" class="quickList" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" width="120" align="center">
      </el-table-column>
      <el-table-column label="快捷键内容" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.content" size="small" v-if="scope.row.editabled"></el-input>
          <span v-else>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="停用" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="scope.row.disable" v-if="scope.row.editabled"></el-checkbox>
          <span v-else>{{$formatter.formatDisable(scope.row)}}</span>
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
  name: 'EditShortcuts',
  data() {
    return {
      // 选中行信息
      multipleSelection: [],
      // 快捷键列表
      quickList: [],
      loading: false,
      // 编辑快捷键输入信息
      editShortcuts: {
        user_name: this.$store.getters.getAccount.name,
        order_number: '',
        content: ''
      },
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val
      this.queryQuickList()
    },
    // 添加
    handleAdd() {
      console.log(this.editShortcuts)
      this.$http.post('quick/create', {
        'body': this.editShortcuts
      }).then(res => {
        console.log(this.editShortcuts)
        this.editShortcuts.content = ''
        this.queryQuickList()
      })
    },
    // 删除
    handleDelete() {
      let quickUuids = this.multipleSelection.map(item => item.quickUuid)
      this.$http.post('quick/delete', {
        'body': {
          'quick_uuids': quickUuids
        }
      }).then(res => {
        this.queryQuickList()
      })
    },
    // 编辑
    handleEdit() {
      let row = this.multipleSelection[0]
      row.editabled = true
    },
    // 保存
    handleSave() {
      let rowInfo = this.multipleSelection[0]
      console.log(rowInfo)
      this.$http.post('quick/update', {
        'head': this.$store.getters.getAccount,
        'body': rowInfo
      }).then(res => {
        this.queryQuickList()
      }).catch(res => {
        console.log(res)
      })
    },
    // 获取快捷键列表
    queryQuickList() {
      this.loading = true
      this.$http.post('quick/list', {
        'body': this.pagination
      }).then(res => {
        let bodyInfo = res.data.body
        this.quickList = bodyInfo.QuickList.map(item => ({'quick_uuid': item.quickUuid, 'editabled': false, ...item}))
        this.pagination.total = bodyInfo.total
        this.loading = false
      })
    }
  },
  mounted() {
    this.queryQuickList()
    this.editShortcuts.order_number = window.localStorage.getItem('order_number')
  }
}

</script>

<style lang="scss">
.quickList {
  .el-input--small .el-input__inner {
    text-align: center;
  }
}
</style>
