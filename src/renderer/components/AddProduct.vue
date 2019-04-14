<template>
  <div class="add-product">
    <el-table :data="list" ref="multipleTable" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="brand" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="category" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="width" label="宽度" align="center">
      </el-table-column>
      <el-table-column prop="supplier" label="供应商" align="center">
      </el-table-column>
      <el-table-column prop="purchasingPrice" label="采购价" align="center">
      </el-table-column>
      <el-table-column prop="costPrice" label="成本价" align="center">
      </el-table-column>
      <el-table-column prop="retailPrice" label="零售价" align="center">
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
  name: 'AddProduct',
  props: {
    goodsList: Array
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
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    _loadGoods() {
      this.$tool.loadList(this, 'order/goodsList', bodyInfo => {
        for (let i = 0; i < bodyInfo.GoodsList.length; i++) {
          bodyInfo.GoodsList[i].amount = 1
          bodyInfo.GoodsList[i].length = 1
          bodyInfo.GoodsList[i].goods_uuid = bodyInfo.GoodsList[i].goodsUuid
          bodyInfo.GoodsList[i].number = bodyInfo.GoodsList[i].amount
          bodyInfo.GoodsList[i].total = bodyInfo.GoodsList[i].amount * bodyInfo.GoodsList[i].retailPrice
          bodyInfo.GoodsList[i].goods_name = bodyInfo.GoodsList[i].name
          bodyInfo.GoodsList[i].brand_uuid = bodyInfo.GoodsList[i].brandUuid
          bodyInfo.GoodsList[i].category_uuid = bodyInfo.GoodsList[i].categoryUuid
          bodyInfo.GoodsList[i].retail_price = bodyInfo.GoodsList[i].retailPrice
          bodyInfo.GoodsList[i].warehouse_name = 'beijing'
        }
        this.list = bodyInfo.GoodsList
        console.log(this.list)
      }, {
      	goods_sign: 1
      })
    },
    handleCancel () {
      this.$refs.multipleTable.clearSelection()
      this.$parent.$parent.addProductFormVisible = false
      this.$parent.$parent.$parent.addProductFormVisible = false
    },
    handleSubmit() {
      this.$emit('handleCloseDialog', this.multipleSelection)
      if (window.sessionStorage.getItem('formTitle') === '新建售后单' || window.sessionStorage.getItem('formTitle') === '编辑售后单') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.$parent.$parent.$parent.productInformation.push(this.multipleSelection[i])
        }
        this.$parent.$parent.$parent.addProductFormVisible = false
      } else if (window.sessionStorage.getItem('formTitle') === '新建无名件' || window.sessionStorage.getItem('formTitle') === '编辑无名件') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.$parent.$parent.productInformation.push(this.multipleSelection[i])
        }
        this.handleCancel()
      }
    }
  },
  mounted () {
    this._loadGoods()
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
