<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addQuick"><i class="iconfont  "></i>添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="saveQuick" icon="star-off">保存</el-button>
      </el-form-item> 
    </el-form>
    <el-table :data="quickList" class="quickList" v-loading="loading" highlight-current-row max-height="243" @row-click="updateQuick">
      <el-table-column type="index" label="序号" width="120" align="center">
      </el-table-column>
      <el-table-column label="快捷键内容" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.content" size="small" v-if="scope.row.editable"></el-input>
          <span v-else>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否停用" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="scope.row.disable" v-if="scope.row.disable_flag"></el-checkbox>
          <span v-else>{{$formatter.formatDisable(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteQuick(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'EditShortcuts',
  data() {
    return {
      quickList: [],
      loading: false,
      saveQuickType: 'add',
      writeable: true,
      initQuick: {
        disable: '1',
        content: '',
        editable: true,
        disable_flag: false
      }
    }
  },
  methods: {
    addQuick() {
      this.quickList.forEach((item, index) => {
        item.editable = false
        item.disable_flag = false
      })
      if (this.writeable) {
        this.quickList.push(Object.assign({}, this.initQuick))
        this.writeable = false
      } else {
        this.$message({
          message: '操作有误，请先完成添加操作',
          type: 'error'
        })
        this.quickList[this.quickList.length - 1].editable = true
      }
      this.saveQuickType = 'add'
    },
    deleteQuick(scope) {
      let row = scope.row
      let index = scope.$index
      if (!row.quick_uuid) {
        this.quickList.splice(index, 1)
        return
      }
      this.$tool.confirm(this, '快捷键内容', () => {
        this.$tool.common(this, 'quick/delete', {
          quick_uuids: [row.quick_uuid]
        }, bodyInfo => {
          this.queryQuickList()
        })
      })
    },
    // 修改便签每行数据
    updateQuick(row, event, column) {
      if (!row) return false
      this.saveQuickType = 'edit'
      this.quickList.forEach(item => {
        if (item.quick_uuid === row.quick_uuid) {
          item.disable_flag = true
          item.editable = true
        } else {
          item.disable_flag = false
          item.editable = false
        }
      })
      // 当this.writeable等于false时认为有提交的表单
      if (!this.writeable) {
        if (row.quick_uuid !== this.quickList[this.quickList.length - 1].quick_uuid) {
          this.quickList.pop()
          this.writeable = true
        } else {
          this.saveQuickType = 'add'
          row.disable_flag = false
        }
      }
    },
    // 保存快捷语
    saveQuick() {
      // this.saveQuickType默认添加操作 否则编辑操作
      if (this.saveQuickType === 'add') {
        this.$tool.common(this, 'quick/create', {
          user_name: this.$store.getters.getAccount.name,
          ...this.quickList[this.quickList.length - 1]
        }, bodyInfo => {
          this.queryQuickList()
          this.writeable = true
        })
      } else {
        let editItem = (this.quickList.filter(item => {
          if (item.editable) return true
        }))[0]
        this.$tool.common(this, 'quick/update', {
          user_name: this.$store.getters.getAccount.name,
          ...editItem
        }, bodyInfo => {
          this.queryQuickList()
        })
      }
    },
    // 查询便签列表
    queryQuickList() {
      this.loading = true
      this.$tool.loadOptions(this, 'quick/list', bodyInfo => {
        this.quickList = bodyInfo.QuickList.map(item => ({'quick_uuid': item.quickUuid, 'editable': false, ...item}))
        this.loading = false
      })
    },
    resetStatus() {
      this.queryQuickList()
    }
  },
  mounted() {
    this.queryQuickList()
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
