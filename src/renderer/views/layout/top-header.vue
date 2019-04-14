<!--顶部导航栏-->
<template>
	<el-container>
	<el-header>
	    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
		  	<el-menu-item index="1">思普锯业</el-menu-item>
		  	<el-menu-item index="2">交易管理</el-menu-item>
		  	<el-menu-item index="3">数据管理</el-menu-item>
		</el-menu>
	</el-header>
	<el-main>
	    <router-view></router-view>
	</el-main>
	</el-container>
</template>
<script>
  export default {
    name: 'top-header',
    data() {
      return {
        activeIndex: 'homepage'
      }
    }
  }
</script>

<style lang="scss">

</style>