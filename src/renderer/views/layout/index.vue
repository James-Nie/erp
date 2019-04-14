<template>
  <el-container>
	<el-header>
	    <el-menu default-active="homepage" mode="horizontal" @select="handleSelect">
		  	<el-menu-item index="homepage">
		  		<router-link to="/index">思普锯业</router-link>
		  	</el-menu-item>
		  	<el-menu-item index="tradeManagment">
		  		<router-link to="/trade">交易管理</router-link>
		  	</el-menu-item>
		  	<el-menu-item index="dataManagment">
		  		<router-link to="/data">数据管理</router-link>
		  	</el-menu-item>
		</el-menu>
	  <div class="login-information">
	    <el-tooltip class="item" effect="dark" :content="userName" placement="top">
	      <span>{{userName}}</span>
	    </el-tooltip>
	    <span @click="exit">退出</span>
	  </div>
	</el-header>
	<el-main>
	    <router-view></router-view>
	</el-main>
	</el-container>   
</template>
<script>

export default {
  name: 'Index',
  computed: {
    userName() {
      return this.$store.getters.getAccount.name
    }
  },
  methods: {
    // 导航改变处理事件
    handleSelect(key, keyPath, item) {
      let tabItem = {
          name: item.$el.textContent,
          level: 1
        }
        this.$store.commit('updateMenuLevel', tabItem)
    },
    // 退出
      exit() {
      	this.$http.post('user/loginOut', {
      	}).then(res => {
	      	this.$router.push({
	          path: '/'
	        })
	        this.$store.commit('clearPath')
	        window.localStorage.removeItem('loginUserBaseInfo')
      	})
      }
  }
}
</script>
<style lang="scss">
.login-information{
	float: right;
	width:150px;
	
}
.el-main{
	background: #F1F1F1;
	padding-top: 1px;
}
.el-menu-item{
	padding: 0;
}
.el-menu--horizontal>.el-menu-item a{
	display: inline-block;
	height: 100%;
	width: 100%;
  padding: 0 20px;
}
</style>