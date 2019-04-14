<template>
  <div>
    <div class="mgb15">
      <el-date-picker v-model="dateRange" type="daterange" placeholder="选择日期范围" @change="changeDate">
      </el-date-picker>
      <el-button type="primary" class="mgl10" @click="refresh"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
      <el-button type="primary" @click="filter" :disabled="!permission || multipleSelection.length !== 1 || submitReceivableButton"><i class="iconfont icon-artboard38"></i>已审</el-button>
    </div>
    <el-table :data="proOrderList" ref="multipleTable" @selection-change="handleSelectionChange" @row-click="handleRowClick" v-loading="loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
      <el-table-column prop="brand" label="品牌" align="center"></el-table-column>
      <el-table-column prop="model" label="规格" align="center"></el-table-column>
      <el-table-column prop="width" label="宽度" align="center"></el-table-column>
      <el-table-column prop="length" label="长度" align="center"></el-table-column>
      <el-table-column prop="sign" label="状态" align="center" :formatter="regionFormatter"></el-table-column>
      <el-table-column prop="number" label="数量" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column prop="endTime" label="完成时间" :formatter="$formatter.formatTime('endTime')" align="center" width="180"></el-table-column>
      <el-table-column prop="workshopName" label="车间名称" align="center"></el-table-column>
      <el-table-column prop="distributeTime" label="派单时间" align="center" :formatter="$formatter.formatTime('distributeTime')" width="180"></el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>  
  </div>
</template>
<script>
export default {
  name: 'workshop-audit',
  data() {
    return {
      loading: false,
      // 是否允许点击审核按钮
      submitReceivableButton: true,
      // 存储日期信息
      dateRange: [],
      // 选中行
      multipleSelection: [],
      // 选中个数
      selectNumber: 0,
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      },
      // 审核列表
      proOrderList: [],
      // 选中要审核的行的id数组
      product_goods_uuids: []
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/WorkshopWorkloadExcelport')
    },
    // 刷新
    refresh() {
      this._loadMainList()
      this.dateRange = []
    },
    // 过滤器，过滤审核状态
    regionFormatter (row, column) {
      const mapping = {
        '1': '待审核',
        '2': '审核成功'
      }
      return mapping[row.sign]
    },
    // 更改日期，刷新列表
    changeDate() {
      this._loadMainList()
    },
    // 选中行是否允许点击已审核按钮
    handleSelectionChange(val) {
      let sign = false
      this.multipleSelection = val
      this.selectNumber = this.multipleSelection.length
      this.product_goods_uuids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.product_goods_uuids[i] = this.multipleSelection[i].productGoodsUuid
        if (this.multipleSelection[i].sign === 2 || this.multipleSelection[i].sign === '2') {
          // 不允许
          this.submitReceivableButton = true
          sign = true
        }
        if (i === this.multipleSelection.length - 1) {
          if (sign === false) {
            // 允许
            this.submitReceivableButton = false
          }
        }
      }
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 点击表格，选中一行
    handleRowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 根据信息，获取列表
    _loadMainList() {
      let [startTime, endTime] = this.dateRange
      if (!startTime || !endTime) {
        startTime = ''
        endTime = ''
      }
      this.$tool.loadList(this, 'finance/workShop', bodyInfo => {
        this.proOrderList = bodyInfo.ProOrderList
      }, {
        'startTime': startTime,
        'endTime': endTime
      })
    },
    // 通过审核，更改状态，刷新，
    filter () {
      this.$confirm('请确认审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.post('financial/workShopAudit', {
          'body': {
            'product_goods_uuids': this.product_goods_uuids
          }
        }).then(res => {
          console.log(res)
          this._loadMainList()
          this.$message({
            type: 'success',
            message: '审核成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  mounted() {
    this._loadMainList()
  },
  computed: {
    // 获取权限信息
    permission() {
      return this.$store.getters.hasPermission('returnGoodsManageWrite')
    }
  }
}

</script>
