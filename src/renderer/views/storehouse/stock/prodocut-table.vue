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
      <el-table-column prop="width" label="宽度" align="center">
      </el-table-column>
      <el-table-column prop="length" label="长度" align="center">
      </el-table-column>
      <el-table-column prop="category" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="address" label="库位" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="库存" align="center">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center">
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
  name: 'prodocut-table',
  updatedForm: {
    type: Object,
    required: true
  },
  data() {
    return {
      loading: false,
      list: this.goodsList,
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 选中行信息
      multipleSelection: [],
      warehouseUuid: window.sessionStorage.getItem('WarehousUuid')
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
      console.log('仓库', window.sessionStorage.getItem('WarehousUuid'))
      this.$http.post('code/QrCodeList', {
        'body': this.pagination
      }).then(res => {
        // 重置键名
        let GoodsPrintQRList = res.data.body.GoodsPrintQRList
        for (let i = 0; i < GoodsPrintQRList.length; i++) {
          GoodsPrintQRList[i].goods_uuid = GoodsPrintQRList[i].goodsUuid
          GoodsPrintQRList[i].number = 1
          GoodsPrintQRList[i].stock_uuid = GoodsPrintQRList[i].stockUuid
          GoodsPrintQRList[i].warehouse_uuid = GoodsPrintQRList[i].warehouseUuid
          GoodsPrintQRList[i].supplier_name = GoodsPrintQRList[i].supplierName
          GoodsPrintQRList[i].warehouse_name = GoodsPrintQRList[i].warehouseName
          GoodsPrintQRList[i].length = '' + GoodsPrintQRList[i].length
        }
        this.list = GoodsPrintQRList
      })
    },
    // 关闭此页面，清除数据
    handleCancel () {
      this.$refs.multipleTable.clearSelection()
      this.$parent.$parent.addProductFormVisible = false
    },
    // 按照不同的formTitle，把选中的产品放到不同的页面
    handleSubmit() {
      console.log(window.sessionStorage.getItem('formTitle'))
      this.$emit('handleCloseDialog', this.multipleSelection)
      if (window.sessionStorage.getItem('formTitle') === '出库') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.$parent.$parent.productInformation.push(this.multipleSelection[i])
          this.$parent.$parent.printSign[i] = this.multipleSelection[i].sign
          if (i === this.multipleSelection.length - 1) {
            this.$parent.$parent.getPrintUuids()
          }
        }
        this.$parent.$parent.addProductFormVisible = false
      } else if (window.sessionStorage.getItem('formTitle') === '仓间调拨') {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.$parent.$parent.productInformation.push(this.multipleSelection[i])
          this.$parent.$parent.printSign[i] = this.multipleSelection[i].sign
          if (i === this.multipleSelection.length - 1) {
            this.$parent.$parent.getPrintUuids()
          }
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
