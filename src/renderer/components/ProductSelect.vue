<template>
  <div class="add-product">
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="index" label="品牌">
      </el-table-column>
      <el-table-column prop="index" label="规格">
      </el-table-column>
      <el-table-column prop="index" label="长度">
      </el-table-column>
      <el-table-column prop="index" label="宽度">
      </el-table-column>
      <el-table-column prop="index" label="分类">
      </el-table-column>
      <el-table-column prop="index" label="所在仓库">
      </el-table-column>
      <el-table-column prop="index" label="供应商">
      </el-table-column>
      <el-table-column prop="index" label="采购价">
      </el-table-column>
      <el-table-column prop="index" label="数量">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-count="total" :current-page="pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <div class="text-center">
      <el-button class="circle-btn">取消</el-button>
      <el-button type="primary" class="circle-btn">确认</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProductSelect',
  data() {
    return {
      tableData: []
    }
  }
}

</script>
<style lang="scss">
.add-product {
  .el-button+.el-button {
    margin-left: 20px;
  }
}

</style>
