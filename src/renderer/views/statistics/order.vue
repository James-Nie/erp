<template>
  <div>
    <div class="mgb15">
    <!-- 选择商店 -->
      <el-dropdown @command="handleCommand">
        <el-button type="primary" style="width: 100px">
          {{storeName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="全部商店">全部商店</el-dropdown-item>
          <el-dropdown-item v-for="item in commands" :key="item.id" :command="item.storeName">{{item.storeName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" @click="_loadMainList" class="mgl10"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <!-- 订单列表 -->
    <div class="table-wrapper">
      <el-table :data="orderList" stripe style="width: 100%" highlight-current-row @current-change="selected" @selection-change="handleSelectionChange" max-height="523">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单号" align="center" width="200">
        </el-table-column>
        <el-table-column prop="store" label="店铺名称" align="center">
        </el-table-column>
        <el-table-column label="订单状态" align="center" :formatter="$formatter.formatOrderStatus">
        </el-table-column>
        <el-table-column prop="moneySign" label="发货状态" align="center" :formatter="regionReceivable">
        </el-table-column>
        <el-table-column prop="orderType" label="订单分类" align="center">
        </el-table-column>
        <el-table-column prop="refundStatus" label="退款状态" align="center">
        </el-table-column>
        <el-table-column label="下单时间" :formatter="$formatter.formatTime('orderDatetime')" align="center" width="180">
        </el-table-column>
        <el-table-column prop="addressee" label="收件人" align="center">
        </el-table-column>
        <el-table-column prop="logisticsMode" label="物流" align="center">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="数量" align="center">
        </el-table-column>
        <el-table-column prop="actualMoney" label="金额" align="center">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 底部辅助表格 -->
    <auxiliary-table type="orderStatistics"></auxiliary-table>
  </div>
</template>
<script>
import AuxiliaryTable from '@/components/AuxiliaryTable'
export default {
  name: 'order-statistics',
  components: {
    [AuxiliaryTable.name]: AuxiliaryTable
  },
  data() {
    return {
      // 订单列表
      orderList: [],
      // 商店列表
      commands: [],
      // 当前的商店名称
      storeName: '全部商店',
      // 选中行的信息
      multipleSelection: [],
      // 当前商店的id
      shopUuid: '',
      // 商店
      store: '',
      // 是否等待
      loading: false,
      // 分页
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  methods: {
    // 点击一行
    selected(current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/OrderStatisticsExcelport')
    },
    // 过滤器，将数字转为文字
    regionReceivable(row, column) {
      const mapping = {
        '1': '未发货',
        '2': '已发货'
      }
      return mapping[row.moneySign]
    },
    // 点击商店
    handleCommand(command) {
      // 设置当前的商店
      if (command === '全部商店') {
        this.store = ''
      } else {
        this.store = command
      }
      this.pagination.pageIndex = 1
      this.storeName = command
      this._loadMainList()
    },
    // 选中数据放入multipleSelection
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 请求第val页的商品，刷新页面
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 请求商店列表
    queryShop() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.commands = bodyInfo.apiResult
      })
    },
    _loadMainList() {
      this.$tool.loadList(this, 'statistics/order', bodyInfo => {
        this.orderList = bodyInfo.apiResult
      }, this.store)
    }
  },
  mounted() {
    [this.queryShop, this._loadMainList].forEach(f => f())
  },
  destroyed () {
    this.$store.commit('selected', {})
  }
}

</script>
