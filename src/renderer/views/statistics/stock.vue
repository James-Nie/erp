<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" class="mgl10"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
    </div>
    <el-table :data="stockDetailList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" highlight-current-row max-height="523">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="brand" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="length" label="长度" align="center">
      </el-table-column>
      <el-table-column prop="width" label="宽度" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="数量" align="center">
      </el-table-column>
       <el-table-column prop="weight" label="重量" align="center">
      </el-table-column>
      <el-table-column prop="category" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="warehouseName" label="所在仓库" align="center">
      </el-table-column>
      <el-table-column label="创建时间" :formatter="$formatter.formatTime('createDatetime')" align="center" width="180">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>  
  </div>
</template>
<script>
export default {
  name: 'stock-statistics',
  data() {
    return {
      loading: false,
      // 库存列表
      stockDetailList: [],
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 选中行信息
      multipleSelection: []
    }
  },
  methods: {
    exportExcel() {
      this.$tool.exportExcel(this, 'export/StockStatisticsExcelport')
    },
    // 请求第val页的商品，刷新页面
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    _loadMainList() {
      this.$tool.loadList(this, 'statistics/stockDetail', bodyInfo => {
        this.stockDetailList = bodyInfo.StockList
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
