<template>
  <div>
    <el-dialog title="仓库管理" custom-class="warehouse-management-dialog" :visible="$store.state.dialog.warehouseManagementVisible" :before-close="handleClose('setWarehouseManagementVisible')">
      <storehouse-management></storehouse-management>
    </el-dialog>
    <el-dialog title="账号设置" custom-class="account-dialog" size="tiny" :visible="$store.state.dialog.accountVisible" :before-close="closeAccount" @close="closeAccount">
      <el-form class="accountForm" :rules="rules" ref="accountForm" :model="accountForm" label-position="left" label-width="80px">
        <el-form-item label="旧密码" prop="old_pass">
          <el-input type="password" v-model="accountForm.old_pass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pass">
          <el-input type="password" v-model="accountForm.new_pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="new_pass_two" required>
          <el-input type="password" v-model="accountForm.new_pass_two"></el-input>
        </el-form-item>
        <p class="account-note">
          请使用安全密码：1、至少使用8个字符，包括字母、<br/>数字等符号组合。2、新密码不能与原来密码相同。
        </p>
        <div class="account-footer">
          <el-button class="circle-btn" @click="$store.commit('setAccountVisible', false)">取 消</el-button>
          <el-button class="circle-btn" type="primary" @click="changePassword('accountForm')">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="物流设置" custom-class="logistics-dialog" size="large" :visible="$store.state.dialog.logisticsVisible" :before-close="handleClose('setLogisticsVisible')">
      <logistics-setting></logistics-setting>
    </el-dialog>
    <el-dialog title="店铺设置" custom-class="strategy-dialog" :visible="$store.state.dialog.storeVisible" :before-close="handleClose('setStoreVisible')">
      <store-setting></store-setting>
    </el-dialog>
    <el-dialog title="订单拆分" size="large" custom-class="order-split-dialog" :visible="$store.state.dialog.orderSplitVisible" :before-close="handleClose('setOrderSplitVisible')">
      <order-split></order-split>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import Logistics from '@/views/setting/logistics'
import StoreSetting from '@/views/setting/store'
import StorehouseManagement from '@/views/storehouse'
export default {
  name: 'dialog-mangement',
  components: {
    [Logistics.name]: Logistics,
    [StoreSetting.name]: StoreSetting,
    [StorehouseManagement.name]: StorehouseManagement
  },
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.accountForm.new_pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      accountForm: {
        old_pass: '',
        new_pass: '',
        new_pass_two: ''
      },
      rules: {
        old_pass: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
        new_pass: [{required: true, message: '请输入密码', trigger: 'blur'}],
        new_pass_two: [{message: '请再次输入密码', validator: confirmPassword, trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 关闭并清空账号设置页
    closeAccount() {
      this.$refs['accountForm'].resetFields()
      this.$store.commit('setAccountVisible', false)
    },
    // 关闭页面
    handleClose(visible) {
      return () => {
        this.$store.commit(visible, false)
      }
    },
    changePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('user/updatePassword', {
            'body': {
              account: this.$store.getters.getAccount.account,
              ...this.accountForm
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>

<style lang="scss">
.account-dialog {
  width: 450px;
  .accountForm {
    margin: auto;
    width: 322px;
    .account-note {
      line-height: 22px;
      color: #f75f5f;
    }
    .account-footer {
      margin-top: 30px;
      text-align: center;
    }
    .el-button+.el-button {
      margin-left: 20px;
    }
  }
}

.goods-classification-dialog {
  height: 600px;
}
</style>