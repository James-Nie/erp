<template>
  <div class="inventory-management">
    <div class="mgb15">
    <!-- 选择仓库 -->
      <el-dropdown @command="handleDashBoard" trigger="click">
        <el-button type="primary">{{warehouseName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item command="全部仓库">全部仓库</el-dropdown-item>
          <el-dropdown-item v-for="item in commands" :key="item.warehouseUuid" :command="item.warehouseUuid">{{item.warehouseName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" class="mgl10" @click="outboundShow('in')" :disabled="!permission"><i class="iconfont icon-qianru1"></i>入库</el-button>
      <el-button type="primary" class="mgl10" @click="outboundShow('out')" :disabled="!permission"><i class="iconfont icon-qianchu1"></i>出库</el-button>
      <el-button type="primary" @click="warehouseMobilise" :disabled="!permission"><i class="iconfont icon-ccgl-chukuguanli-5"></i>仓间调拨</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="StockList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" highlight-current-row max-height="523">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70">
        </el-table-column>
        <el-table-column label="货品编码">
        </el-table-column>
        <el-table-column label="货品名称">
        </el-table-column>
        <el-table-column prop="brand" label="品牌">
        </el-table-column>
        <el-table-column prop="model" label="规格">
        </el-table-column>
        <el-table-column prop="length" label="长度(mm)">
        </el-table-column>
        <el-table-column prop="category" label="分类">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商">
        </el-table-column>
        <el-table-column prop="address" label="库位">
        </el-table-column>
        <el-table-column label="可用库存">
        </el-table-column>
        <el-table-column label="锁定库存">
        </el-table-column>
        <el-table-column prop="amount" label="总库存">
        </el-table-column>
        
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-tabs type="border-card" class="auxiliary-table">
      <!--<el-tab-pane label="日志">
        <el-table :data="logsData" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="200">
          </el-table-column>
          <el-table-column prop="operator" label="操作员">
          </el-table-column>
          <el-table-column prop="content" label="内容">
          </el-table-column>
          <el-table-column prop="time" label="时间">
          </el-table-column>
        </el-table>
      </el-tab-pane>-->
      <el-tab-pane label="入库明细">
        <el-table :data="warehousing" v-loading="loadingOfWarehousing" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="brand" label="品牌">
          </el-table-column>
          <el-table-column prop="model" label="规格">
          </el-table-column>
          <el-table-column prop="oneMan" label="操作人">
          </el-table-column>
          <el-table-column prop="reasonOfStorage" label="内容">
          </el-table-column>
          <el-table-column label="时间" :formatter="formatCreateDatetime">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="出库明细">
        <el-table :data="outbound" v-loading="loadingOfOutbound" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="brand" label="品牌">
          </el-table-column>
          <el-table-column prop="model" label="规格">
          </el-table-column>
          <el-table-column prop="oneMan" label="操作人">
          </el-table-column>
          <el-table-column prop="reasonOfStorage" label="内容">
          </el-table-column>
          <el-table-column label="时间" :formatter="formatCreateDatetime">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="formTitle" size="full" :visible.sync="outboundVisible" :before-close="handleClose">
      <outbound :updatedForm="form" :formType="formType"></outbound>
    </el-dialog>
    <el-dialog title="仓间调拨" size="full" :visible.sync="warehouseMobiliseVisible" :before-close="handleClose">
      <warehouse-mobilise :updatedForm="form"></warehouse-mobilise>
    </el-dialog>
  </div>
</template>
<script>
import Outbound from './outbound'
import WarehouseMobilise from './mobilise'
export default {
  name: 'stock-management',
  components: {
    [Outbound.name]: Outbound,
    [WarehouseMobilise.name]: WarehouseMobilise
  },
  data() {
    return {
      // 出库页面
      outboundVisible: false,
      // 仓间调拨页面
      warehouseMobiliseVisible: false,
      // 是否等待
      loading: false,
      // 等待入库
      loadingOfWarehousing: false,
      // 等待出库
      loadingOfOutbound: false,
      // 仓库名
      warehouseName: '全部仓库',
      // 仓库id
      warehouseUuid: '',
      // 选中行信息
      multipleSelection: [],
      formTitle: '',
      formType: '',
      StockList: [],
      // 传递到下一页内容
      form: {},
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 根据仓库获取库存信息
      filter: {
        warehouseUuid: '',
        brand: '',
        model: '',
        category: '',
        startNum: '',
        endNum: ''
      },
      // 获取出入库明细的index和size
      paginationOfDetail: {
        pageIndex: 1,
        pageSize: 10
      },
      // 出库数据
      outbound: [],
      // 入库数据
      warehousing: [],
      // 仓库名
      commands: []
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/StockStatisticsExcelport')
    },
    // 关闭页面
    handleClose() {
      this.outboundVisible = false
      this.warehouseMobiliseVisible = false
      this.$message({
        showClose: true,
        message: '已取消' + window.sessionStorage.getItem('formTitle')
      })
    },
    handleDashBoard(command) {
      // this.shopName = a
      // 根据仓库id选出仓库名
      this.warehouseUuid = command
      if (this.warehouseUuid === '全部仓库') {
        this.warehouseName = '全部仓库'
      } else {
        for (let i = 0; i < this.commands.length; i++) {
          if (this.commands[i].warehouseUuid === this.warehouseUuid) {
            this.warehouseName = this.commands[i].warehouseName
          }
        }
      }
      this.queryStockList(command)
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.queryStockList()
    },
    // 进入仓间调拨
    warehouseMobilise() {
      this.warehouseMobiliseVisible = true
      window.sessionStorage.setItem('formTitle', '仓间调拨')
      this.form = Object.assign({}, {
        // 是每次进入仓间调拨页面都清除上次内容
        'shopUuid': this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999)
      })
    },
    // 进入出库
    outboundShow(type) {
      console.log(this.multipleSelection)
      this.formTitle = type === 'in' ? '入库' : '出库'
      this.formType = type
      console.log(222, this.formType)
      window.sessionStorage.setItem('formTitle', this.formTitle)
      this.form = Object.assign({}, {
        // 是每次进入出库页面都清除上次内容
        'shopUuid': this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999),
        'position': '出库原因'
      })
      this.outboundVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取仓库库存列表
    queryStockList(store) {
      this.loading = true
      if (store === '全部仓库') {
        store = ''
      }
      this.filter.warehouseUuid = store
      this.filter.warehouse_uuid = store
      this.$tool.loadList(this, 'stock/list', bodyInfo => {
        this.StockList = bodyInfo.StockList
      }, this.filter)
    },
    // 获取出入库详情
    queryStockDetail (type) {
      let loading = type === '1' ? 'loadingOfOutbound' : 'loadingOfWarehousing'
      this[loading] = true
      this.$http.post('stock/detail', {
        'body': {
          type,
          ...this.paginationOfDetail
        }
      }).then(res => {
        this[type] = res.data.body.StockDetailList
        if (type === 1) {
          this.warehousing = res.data.body.StockDetailList
        }
        if (type === 2) {
          this.outbound = res.data.body.StockDetailList
        }
        this[loading] = false
      })
    },
    // 过滤器，过滤日期
    formatCreateDatetime(row, column) {
      if (row.createDatetime) {
        return this.$moment(new Date(row.createDatetime)).format('YYYY-MM-DD hh:mm:ss')
      }
      return '---'
    },
    // 获取仓库列表
    _loadStore() {
      this.$tool.loadOptions(this, 'warehouse/select', bodyInfo => {
        this.commands = bodyInfo.WarehouseList
        console.log(this.commands)
      })
    }
  },
  mounted() {
    const detailType = {
      OUTBOUND: 1,
      WAREHOUSING: 2
    }
    this.queryStockList()
    // 出库，入库明细
    this.queryStockDetail(detailType.OUTBOUND)
    this.queryStockDetail(detailType.WAREHOUSING)
    this._loadStore()
  },
  computed: {
    permission() {
      // 获取权限
      return this.$store.getters.hasPermission('stockWrite')
    }
  }
}

</script>
