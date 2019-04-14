<template>
  <div>
    <div class="mgb15">
      <el-button type="primary"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <!-- 货品售卖统计列表 -->
    <el-table :data="orderGoodsSaleList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" highlight-current-row>
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="brand" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="width" label="宽度" align="center">
      </el-table-column>
      <el-table-column prop="length" label="长度" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="数量" align="center">
      </el-table-column>
      <el-table-column prop="allWeight" label="重量" align="center">
      </el-table-column>
      <el-table-column prop="category" label="类型" align="center">
      </el-table-column>
      <el-table-column prop="allPrice" label="销售金额" align="center">
      </el-table-column>
      <el-table-column label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" align="center" width="180">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>  
  </div>
</template>
<script>
export default {
  name: 'goods-sold-statistics',
  data() {
    return {
      // 是否等待
      loading: false,
      // 分页
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 选中的嘻信息
      multipleSelection: [],
      // 货品售卖列表
      orderGoodsSaleList: []
    }
  },
  methods: {
    // 请求第val页的商品，刷新页面
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取货品售卖列表
    _loadMainList() {
      this.$http.post('statistics/goodsSale', {
        'body': {
          ...this.pagination
        }
      }).then(res => {
        console.log(res)
        this.orderGoodsSaleList = res.data.body.OrderGoodsSaleList
      })
    },
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/SaleOfGoodsExcelport')
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
