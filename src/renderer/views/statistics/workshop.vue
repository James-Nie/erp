<template>
  <div>
    <div class="mgb15">
      <el-button type="primary"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <el-table :data="productionGoodsList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" highlight-current-row>
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
      <el-table-column prop="number" label="数量" align="center">
      </el-table-column>
      <el-table-column prop="productionUuid" label="单号" align="center" width='200'>
      </el-table-column>
      <el-table-column prop="workshopName" label="车间组别" align="center">
      </el-table-column>
      <el-table-column label="完成时间" :formatter="$formatter.formatTime('endTime')" align="center">
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
  name: 'workshop-statistics',
  data() {
    return {
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      loading: false,
      // 选中行信息
      multipleSelection: [],
      // 车间列表
      productionGoodsList: []
    }
  },
  methods: {
    exportExcel() {
      this.$tool.exportExcel(this, 'export/WorkshopExcelport')
    },
    // 请求第val页的商品，刷新页面
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    _loadMainList() {
      this.$tool.loadList(this, 'statistics/workShop', bodyInfo => {
        this.productionGoodsList = bodyInfo.ProductionGoodsList
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
