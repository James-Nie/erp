<template>
  <div>
    <div class="mgb15">
      <el-button type="primary"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
    </div>
    <el-table :data="orderSalemanList" v-loading="loading" stripe style="width: 100%"  @selection-change="handleSelectionChange" highlight-current-row>
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="salesman" label="业务员" align="center">
      </el-table-column>
      <el-table-column prop="orderNumber" label="订单号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="goodsNumber" label="货品数" align="center">
      </el-table-column>
      <el-table-column prop="actualMoney" label="销售金额" align="center">
      </el-table-column>
      <el-table-column label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" align="center" width="180">
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
  name: 'performance-statistics',
  data() {
    return {
      loading: false,
      // 业绩统计列表
      orderSalemanList: [],
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
    // 请求第val页的商品，刷新页面
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    exportExcel() {
      this.$tool.exportExcel(this, 'export/AchievementStatisticsExcelport')
    },
    _loadMainList() {
      this.$tool.loadList(this, 'statistics/achievement', bodyInfo => {
        this.orderSalemanList = bodyInfo.OrderSalemanList
      })
    },
    // 选中数据放入multipleSelection
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  mounted() {
    this._loadMainList()
  }
}

</script>
