<template>
  <el-container>
	  <!--顶部导航栏-->
    <top-header class="header m15"></top-header>
	  <el-container>
	    <!--动态增减标签页-->
	    <el-header>
	    	<router-tabs></router-tabs>
	    </el-header>
    	<!--页面内容-->
	    <el-main>
	    	<router-view></router-view>
	    </el-main>
	    <!--全局对话框-->
	    <el-footer>
	    	<dialog-mangement></dialog-mangement>
	    </el-footer>
	  </el-container>
	</el-container>    
</template>
<script>
import TopHeader from './top-header'
import RouterTabs from './router-tabs'
import Dialog from './dialog'

export default {
  name: 'Index',
  components: {
    [TopHeader.name]: TopHeader,
    [RouterTabs.name]: RouterTabs,
    [Dialog.name]: Dialog
  }
}
</script>
