<template>
  <el-form :inline="true" :model="stickyNotes">
    <el-form-item label="快捷选项">
      <el-select v-model="stickyNotes.content" placeholder="请选择">
        <el-option v-for="item in quickList" :key="item.value" :label="item.label" :value="item.content">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button icon="more" @click="toggleDialog"></el-button>
    </el-form-item>
    <el-input class="mgb30" type="textarea" :rows="6" placeholder="请输入内容" v-model="stickyNotes.content">
    </el-input>
    <div class="text-center">
      <el-button class="circle-btn" type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'StickyNotes',
  data() {
    return {
      self: this,
      // 便签输入数据
      stickyNotes: {
        user_name: '',
        order_number: '',
        content: ''
      },
      // 快捷键列表
      quickList: [],
      // 新建标签
      newCreateNodeList: '',
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    // 标记此页面的父页面
    selectNewCreateNodeList () {
      console.log(window.sessionStorage.getItem('createNodeParent'))
      this.newCreateNodeList = this.$tool.parentComponents(this, window.sessionStorage.getItem('createNodeParent'))
    },
    // 关闭页面
    toggleDialog() {
      this.newCreateNodeList.stickyNotesVisible = false
      window.setTimeout(() => {
        this.newCreateNodeList.shortcutEditingVisivble = true
      }, 300)
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
    },
    // 保存
    handleSave() {
      this.stickyNotes.order_number = window.localStorage.getItem('order_number')
      this.stickyNotes.user_name = this.$store.getters.getAccount.name
      console.log(this.stickyNotes)
      this.$tool.common(this, 'note/create', {
        'user_name': this.$store.getters.getAccount.name,
        ...this.stickyNotes
      }, bodyInfo => {
        this.newCreateNodeList.shortcutEditingVisivble = false
        this.newCreateNodeList.stickyNotesVisible = false
        this.newCreateNodeList.getNode(this.stickyNotes.order_number)
      })
    }
  },
  mounted() {
    this.queryQuickList()
    this.selectNewCreateNodeList()
  }
}
</script>
