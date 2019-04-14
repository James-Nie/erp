<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" class="mgl10" @click="_loadMainList"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <!-- 维修单列表 -->
    <el-table :data="repairGoodsList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="repairUuid" label="维修单" align="center" width='180'>
      </el-table-column>
      <el-table-column prop="brand" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="width" label="宽" align="center">
      </el-table-column>
      <el-table-column prop="length" label="长" align="center">
      </el-table-column>
      <el-table-column prop="number" label="数量" align="center">
      </el-table-column>
      <el-table-column prop="money" label="维修金额" align="center">
      </el-table-column>
      <el-table-column prop="successNumber" label="成功数量" align="center">
      </el-table-column>
      <el-table-column prop="failNumber" label="失败数量" align="center">
      </el-table-column>
      <el-table-column label="维修完成时间" :formatter="$formatter.formatTime('endTime')" align="center" width="180">
      </el-table-column>      
    </el-table>
    <!-- 分页 -->
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'maintenance-statistics',
  data() {
    return {
      // 是否等待
      loading: false,
      // 维修列表
      repairGoodsList: [],
      // 分页
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 选中行的信息
      multipleSelection: []
    }
  },
  methods: {
    // 请求第val页的商品，刷新页面
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取维修单列表
    _loadMainList() {
      this.$tool.loadList(this, 'statistics/repair', bodyInfo => {
        this.repairGoodsList = bodyInfo.RepairGoodsList
      })
    },
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/RepairStatisticsExcelport')
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
