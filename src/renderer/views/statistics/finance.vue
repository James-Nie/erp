<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" @click="_loadMainList" class="mgl10"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
    </div>
    <el-table :data="orderGoodsShowList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" highlight-current-row max-height="523">
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
      <el-table-column prop="allWeight" label="重量" align="center">
      </el-table-column>
      <el-table-column prop="category" label="类型" align="center">
      </el-table-column>
      <el-table-column prop="allPrice" label="金额" align="center">
      </el-table-column>
      <el-table-column prop="orderNumber" label="订单号" align="center" width="180">
      </el-table-column>
      <el-table-column label="收支款时间" :formatter="$formatter.formatTime('payDatetime')" align="center" width="180">
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
  name: 'finance-statistics',
  data() {
    return {
      // 等待
      loading: false,
      // 财务统计列表
      orderGoodsShowList: [],
      // 分页
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 存储选中的财务信息
      multipleSelection: []
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/FinanceExcelport')
    },
    // 根据分页，请求第val页的数据，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取财务统计列表
    _loadMainList() {
      this.$tool.loadList(this, 'statistics/finance', bodyInfo => {
        this.orderGoodsShowList = bodyInfo.OrderGoodsShowList
      })
    },
    // 选中的数据放进multipleSelection里
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  mounted() {
    this._loadMainList()
  }
}

</script>
