<template>
  <div class="wrapper">
    <h1>思普后台管理系统</h1>
    <el-form class="login-form" ref="form" :model="form" :rules="rules" label-width="84px" label-position="top">
      <p class="login_welcome zh">欢迎使用</p>
      <p class="login_welcome cn">Welcome use sipu system</p>
      <el-form-item label="账号" prop="account">
        <el-autocomplete v-model="form.account" :fetch-suggestions="querySearch" placeholder="请输入账号" @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" @keyup.enter.native="loginIn('form')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.rememberMe">记住密码</el-checkbox>
      </el-form-item>
      <el-button type="primary" class="submit-btn" @click="loginIn('form')" :loading="loading">登录</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      loading: false,
      // 是否记住密码
      form: {
        account: '',
        password: '',
        rememberMe: false
      },
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 账号保存的记录
    restaurants() {
      let loginHistory = JSON.parse(window.localStorage.getItem('loginHistory'))
      let restaurants = loginHistory.map(item => ({value: item.account, password: item.password}))
      return loginHistory.length > 0 ? restaurants : []
    }
  },
  methods: {
    // 选中账号
    handleSelect(item) {
      this.form.password = item.password
    },
    // element-ui检索搜索框方法
    querySearch(queryString, cb) {
      if (this.restaurants.length > 0) {
        this.$tool.querySearch(this, queryString, cb)
      } else {
        cb(this.restaurants)
      }
    },
    // 登录
    loginIn(formName) {
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
        	this.$http.post('user/loginIn', this.form).then(res => {
//          this.form.name = res.data.body.name
            // 取到localStorage里面的数据
            let loginHistory = JSON.parse(window.localStorage.getItem('loginHistory')) || []
            // 如果选择记住密码, 则把密码存入localStorage里面
            if (this.form.rememberMe) {
              if (!loginHistory.some(item => this.$tool.isEqual(item, this.form))) {
                loginHistory.push(this.form)
                window.localStorage.setItem('loginHistory', JSON.stringify(loginHistory))
              }
            } else {
              // 如果历史记录包含账号, 则删除它
              if (loginHistory.some(item => this.$tool.isEqual(item, this.form))) {
                loginHistory = loginHistory.filter(item => !this.$tool.isEqual(item, this.form))
                window.localStorage.setItem('loginHistory', JSON.stringify(loginHistory))
              }
            }
            // 把账户信息存入vuex里, 方便其他接口调用
            this.$store.commit('setAccount', this.form)
            // 可用权限数组
            let permissions = []
//          let jurisdiction = res.data.body.info
//          for (let keyName in jurisdiction) {
//            if (jurisdiction[keyName] === 2) {
//              permissions.push(keyName)
//            }
//          }
            permissions.push('orderFinanceRead')
            permissions.push('orderHistoryRead')
            permissions.push('orderOriginalRead')
            permissions.push('productOrderManageRead')
            this.$store.commit('setPermissions', permissions)
            this.loading = false
            this.$router.push({
              path: 'index'
            })
          }).catch(error => {
            this.loading = false
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    // 获取历史记录把最后登录的信息放入登录框中
    let leng = this.restaurants.length
    let lastChild = this.restaurants[leng - 1]
    if (lastChild) {
      this.form.account = lastChild.value
      this.form.password = lastChild.password
      this.form.rememberMe = true
    }
  }
}

</script>
<style lang="scss">
html,
body,
#app,
.wrapper {
  width: 100%;
  height: 100%;
}

.wrapper {
  .el-form-item.is-required .el-form-item__label:before {
    content: ''
  }
  background: url('../assets/images/bg.png');
  background-size: 100% 100%;
  h1 {
  	float: left;
    font-family: PingFangSC-Semibold;
		font-size: 48px;
		color: #FFFFFF;
		text-shadow: 0 6px 9px rgba(126,99,86,0.48);
		position: relative;
		top: 30%;
    left: 20%;
  }
  .el-form {
  	position: relative;
    font-size: 28px;
    width: 388px;
    height: 367px;
    background-color: #fff;
		box-shadow: 0 14px 18px 0 rgba(12,31,62,0.66);
		border-radius: 8px;
		padding-left: 31px;
		top: 30%;
		left: 25%;
    float: left;    
  }
  .login_welcome {
		color: #9999AA;
		letter-spacing: 0.56px;
		line-height: 30px;
  }
  .zh{
  	padding-top: 31px;
  	font-size: 30px;
  	font-weight: 600;
  }
  
  .cn{
  	font-size: 12px;
  	padding-top: 6px;
  	padding-bottom: 30px;
  }
  .el-form-item {
    width: 328px;
    margin: 0 0 15px 0;

    .el-form-item__label {
      font-size: 12px;
    }

    .el-form-item__content {
      line-height: 30px;
    }

    .el-input__inner {
      height: 30px;
      width: 328px;
      font-size: 14px;
      border: none;
      border-bottom: 1px solid rgba(-17,172,-17,0.2);
      border-radius: 0;
    }
  }

  .submit-btn {
  	position: absolute;
    width: 114px;
    height: 42px;
    font-size: 16px;
    bottom: 20px;
    right: 30px;
  }

  .el-checkbox__label {
		font-size: 12px;
		color: #9999AA;
		letter-spacing: 0.26px;
  }

  .el-checkbox__inner {
    width: 14px;
    height: 14px;
    border-radius: 0;
  }

  .el-select .el-input .el-input__icon {
    font-size: 16px;
  }

  .el-checkbox__inner::after {
    left: 3px;
    top: 0px;
    height: 8px;
    width: 4px;
  }
}

</style>
