<template>
  <div class="el-tabs el-tabs--card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item v-for="item in tabItems">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'RouterTabs',
  data() {
    return {
      activetabItems: 'homepage'
    }
  },
  computed: {
    tabItems() {
      return this.$store.state.tab.menuLevel
    }
  }
}

</script>
<style lang="scss">
.el-tabs--card {
  >.el-tabs__header {
    .el-tabs__item {
      &.router-link-active {
        border: 1px solid #d1dbe5;
        border-bottom-color: #fff;
        border-radius: 4px 4px 0 0;
        color: #20a0ff;
      }
    }
  }
}

</style>
