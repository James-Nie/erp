<template>
  <div class="add-product">
    <el-table :data="list" ref="multipleTable" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="id" label="货品编码" align="center">
      </el-table-column>
      <el-table-column prop="goodsName" label="货品名称" align="center">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="categoryName" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center">
      </el-table-column>
      <el-table-column prop="retailPrice" label="零售价(米/元)" align="center">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <div class="text-center">
      <el-button class="circle-btn" @click="handleCancel">取消</el-button>
      <el-button type="primary" class="circle-btn" @click="handleSubmit">确认</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GoodsTable',
  props: {
    goodsList: Array,
    title: String
  },
  data() {
    return {
      loading: false,
      list: this.goodsList,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      multipleSelection: []
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pagination.pageIndex = val
      this._loadGoods()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    _loadGoods() {
      this.$tool.loadList(this, 'goods/list', bodyInfo => {
        this.list = bodyInfo.info
      }, {
      	goodsType: this.title === '添加锯条' ? 1 : 2
      })
    },
    handleCancel () {
      this.$refs.multipleTable.clearSelection()
      this.$parent.$parent.dialogVisible = false
    },
    handleSubmit() {
      this.$emit('handleCloseDialog', this.multipleSelection)
      this.handleCancel()
    }
  },
  mounted () {
    this._loadGoods()
  },
  watch: {
  	title: {
      handler: function (val, oldVal) {
        this._loadGoods()
      },
      deep: true
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
