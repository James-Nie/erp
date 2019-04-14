<template>
  <div>
    <label>请选择</label>
    <el-select v-model="content" placeholder="请选择" class="mgl15">
      <el-option v-for="item in reasons" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-button icon="more" class="more-btn" @click="handleEdit"></el-button>
    <div class="text-center cancel-footer">
      <el-button class="circle-btn" @click="resetForm">取 消</el-button>
      <el-button class="circle-btn" type="primary" @click="handleCancel">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CancelReason',
  props: {
    orderNumber: Object
  },
  computed: {
    number() {
      return this.orderNumber.id
    }
  },
  data() {
    return {
      content: '',
      reasons: []
    }
  },
  methods: {
    resetForm() {
      this.content = ''
      this.$parent.$parent.cancelReasonVisible = false
    },
    handleEdit() {
      let OrderManagement = this.$tool.parentComponents(this, 'OrderManagement')
      window.setTimeout(() => {
        OrderManagement.cancelReasonVisible = false
      }, 300)
      OrderManagement.editReasonVisible = true
    },
    handleCancel() {
      if (this.content === '') {
        this.$message({
          message: '取消原因不能为空',
          type: 'error'
        })
        return
      }
      console.log(this.number)
      this.$http.post('order/cancel', {
        'body': {
          'orderNo': this.number
        }
      }).then(res => {
        this.resetForm()
        this.$tool.parentComponents(this, 'OrderManagement')._loadMainList()
      })
    },
    _loadOptions() {
      this.$tool.loadOptions(this, 'reason/list', bodyInfo => {
        this.reasons = bodyInfo.ReasonList.map(item => ({ label: item.id, value: item.id }))
      })
    }
  },
  mounted() {
    this._loadOptions()
  }
}
</script>

