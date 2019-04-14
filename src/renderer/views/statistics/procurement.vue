<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" class="mgl10" @click="_loadMainList"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" class="mgl10" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <el-table :data="purchaseGoodsList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="brand" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="width" label="宽" align="center">
      </el-table-column>
       <el-table-column prop="purchaseUuid" label="采购单号" align="center" width='180'>
      </el-table-column>
      <el-table-column prop="category" label="货品类别" align="center">
      </el-table-column>
      <el-table-column prop="number" label="采购数量" align="center">
      </el-table-column>
      <el-table-column label="采购时间" :formatter="$formatter.formatTime('createDatetime')" align="center" width="200">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'procurement-statistics',
  data() {
    return {
      loading: false,
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 选中行信息
      multipleSelection: [],
      // 采购列表
      purchaseGoodsList: []
    }
  },
  methods: {
    exportExcel() {
      this.$tool.exportExcel(this, 'export/RepairStatisticsExcelport')
    },
    // 请求第val页的商品，刷新页面
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    _loadMainList() {
      this.$tool.loadList(this, 'statistics/purchase', bodyInfo => {
        this.purchaseGoodsList = bodyInfo.PurchaseGoodsList
      })
    },
    // 存储选中信息
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  mounted() {
    this._loadMainList()
  }
}

</script>
