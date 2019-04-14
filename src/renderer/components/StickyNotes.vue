<template>
  <el-form :inline="true" :model="stickyNotes">
    <el-form-item label="快捷选项">
      <el-select v-model="stickyNotes.content" placeholder="请选择">
        <el-option v-for="item in quickList" :key="item.value" :label="item.label" :value="item.value">
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
      stickyNotes: {
        user_name: '',
        order_number: '',
        content: ''
      },
      quickList: [],
      newCreateNodeList: ''
    }
  },
  methods: {
    selectNewCreateNodeList () {
      if (window.sessionStorage.getItem('createNodeParent') === 'After') {
        this.newCreateNodeList = this.$tool.parentComponents(this, 'AfterSalesManagement')
      } else if (window.sessionStorage.getItem('createNodeParent') === 'NameLess') {
        this.newCreateNodeList = this.$tool.parentComponents(this, 'UnknownThings')
      } else if (window.sessionStorage.getItem('createNodeParent') === 'Return') {
        this.newCreateNodeList = this.$tool.parentComponents(this, 'ReturnsManagement')
      } else if (window.sessionStorage.getItem('createNodeParent') === 'Customer') {
        this.newCreateNodeList = this.$tool.parentComponents(this, 'OrderManagement')
      } else if (window.sessionStorage.getItem('createNodeParent') === 'Memory') {} else {}
    },
    toggleDialog() {
      this.newCreateNodeList.stickyNotesVisible = false
      window.setTimeout(() => {
        this.newCreateNodeList.shortcutEditingVisivble = true
      }, 300)
    },
    queryQuickList() {
      this.$tool.loadList(this, 'quick/list', bodyInfo => {
        this.quickList = bodyInfo.QuickList.map(item => ({'value': item.content}))
        this.pagination.total = bodyInfo.total
      })
    },
    handleSave() {
      this.stickyNotes.order_number = window.localStorage.getItem('order_number')
      this.stickyNotes.user_name = this.$store.getters.getAccount.name
      console.log(this.$store.getters.getAccount)
      this.$tool.common(this, 'note/create', {
        'user_name': this.$store.getters.getAccount.name,
        ...this.stickyNotes
      }, bodyInfo => {
        this.stickyNotes.content = ''
        this.newCreateNodeList.shortcutEditingVisivble = false
        this.newCreateNodeList.stickyNotesVisible = false
      })
    }
  },
  mounted() {
    this.queryQuickList()
    this.selectNewCreateNodeList()
  }
}
</script>
