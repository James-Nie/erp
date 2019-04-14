<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" @click="_loadMainList"><i class="icon-shuaxin1 iconfont"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="icon-daochu iconfont"></i>导出</el-button>
    </div>
    <!-- 售后单列表 -->
    <el-table :data="afterSalesOrderList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" highlight-current-row>
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="afterSalesNumber" label="售后单号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="name" label="客户名称" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center" width="120">
      </el-table-column>
      <el-table-column prop="associatedOrders" label="关联订单" align="center" width="180">
      </el-table-column>
      <el-table-column prop="salesman" label="业务员" align="center">
      </el-table-column>
      <el-table-column prop="typeNumber" label="产品种类" align="center">
      </el-table-column>
      <el-table-column prop="goodsNumber" label="货品总数" align="center">
      </el-table-column>
      <el-table-column prop="actualMoney" label="金额" align="center">
      </el-table-column>
      <el-table-column prop="discountMoney" label="优惠价格" align="center">
      </el-table-column>
      <el-table-column prop="orderState"  label="订单状态" align="center" :formatter="regionFormatter">
      </el-table-column>
      <el-table-column label="完成时间" :formatter="$formatter.formatTime('goodsReceiptTime')" align="center">
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
  name: 'aftersale-statistics',
  data() {
    return {
      // 等待
      loading: false,
      // 售后单列表数组
      afterSalesOrderList: [],
      // 分页
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 选中的售后单信息
      multipleSelection: []
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/AfterSalesStatisticsExcelport')
    },
    // 过滤器，将状态由数字转换成文字
    regionFormatter(row, column) {
      const mapping = {
        '0': '冻结',
        '1': '待审核',
        '2': '驳回',
        '3': '待财审',
        '4': '审核通过',
        '5': '代生产',
        '6': '生产中',
        '7': '待发货',
        '8': '已发货',
        '9': '已签收',
        '10': '申请退货',
        '11': '退货中',
        '12': '完成退货',
        '13': '退货驳回',
        '14': '取消'
      }
      return mapping[row.orderState]
    },
    // 获取售后单
    _loadMainList() {
      this.$tool.loadList(this, 'statistics/afterSales', bodyInfo => {
        this.afterSalesOrderList = bodyInfo.AfterSalesOrderList
      })
    },
    // 获取第val页的数据并刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
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
