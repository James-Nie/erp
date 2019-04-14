<template>
  <el-container>
	  <!--顶部导航栏-->
    <trade-menu class="header m15" style="border-bottom: 1px solid #FFD0D0D0"></trade-menu>
	  <el-container style="margin-left: 16px;padding-top: 0;">
	    <!--动态增减标签页-->
	    <el-header style="height: 16px;margin: 18px;">
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
import TradeMenu from './trade-menu'
import RouterTabs from './router-tabs'
import Dialog from './dialog'

export default {
  name: 'Index',
  components: {
    [TradeMenu.name]: TradeMenu,
    [RouterTabs.name]: RouterTabs,
    [Dialog.name]: Dialog
  }
}
</script>
