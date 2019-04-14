<template>
  <div class="goodsFiles">
    <el-table :data="goodsList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="id" label="货品编号" align="center">
      </el-table-column>
      <el-table-column prop="goodsName" label="名称" align="center">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="width" label="宽度(mm)" align="center">
      </el-table-column>
      <el-table-column prop="weight" label="单重(kg)" align="center">
      </el-table-column>
      <!--<el-table-column prop="costPrice" label="真实财务成本(元)" align="center">
      </el-table-column> -->
      <el-table-column prop="categoryName" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center">
      </el-table-column>
      <el-table-column prop="retailPrice" label="零售价(元)" align="center">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="total, sizes, prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!--新建编辑表单-->
    <el-dialog custom-class="goods-Form" :title="formTitle" :visible.sync="formVisible" :before-close="handleClose">
      <pricelist-form ref="goodsFilesForm" :updated_form="form" :categoryOptions="categoryOptions" :formTitle="formTitle"></pricelist-form>
    </el-dialog>
  </div>
</template>
<script>
import PricelistForm from './form'
export default {
  name: 'pricelist',
  components: {
    [PricelistForm.name]: PricelistForm
  },
  data() {
    return {
      loading: false,
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      },
      goodsList: [],
      multipleSelection: []
    }
  },
  watch: {
    // 刷新页面
    '$store.state.common.dateTime': function() {
      this._loadMainList()
    }
  },
  methods: {
    // 保存选中行信息
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 页面条数修改
    handleSizeChange(val) {
    	this.pagination.pageSize = val
      this._loadMainList()
    },
    // 分页,刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取商品列表
    _loadMainList() {
      this.$tool.loadList(this, 'goods/list', bodyInfo => {
        this.goodsList = bodyInfo.apiResult
      }, {
        goodsSign: 1
      })
    }
  },
  mounted() {
    this._loadMainList()
  }
}

</script>
<style lang="scss">
.goodsFiles {
  .goods-Form {
    width: 810px;
  }
}

</style>
