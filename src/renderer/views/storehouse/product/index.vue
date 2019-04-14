<template>
  <div class="inventory-management">
    <div class="mgb15">
    <!-- 选择仓库 -->
      <el-dropdown @command="handleDashBoard" trigger="click">
        <el-button type="primary">{{filter.warehouseName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item command="全部小组">全部小组</el-dropdown-item>
          <el-dropdown-item v-for="item in commands" :key="item.warehouseUuid" :command="item.warehouseUuid">{{item.warehouseName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="handleOrderStatus" trigger="click">
        <el-button type="primary">{{filter.order_status.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item command="全部状态">全部状态</el-dropdown-item>
          <el-dropdown-item v-for="item in productOrderStatus" :key="item.id" :command="item.id">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" class="mgl10" @click="newProduct('in')"><i class="iconfont  "></i>新建</el-button>
      <el-button type="primary" class="mgl10" @click="reApply" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-tongguo"></i>重新提交</el-button>
      <el-button type="primary" @click="retract" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-chehui"></i>撤回</el-button>
      <el-button type="primary" @click="deleteProduct" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-shanchu"></i>删除</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="orderList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" highlight-current-row max-height="523">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70">
        </el-table-column>
        <el-table-column prop="id" label="生产单号">
        </el-table-column>
        <el-table-column label="生产单状态" :formatter="$formatter.formatProductOrder">
        </el-table-column>
        <el-table-column prop="createUser" label="下单人">
        </el-table-column>
        <el-table-column prop="workshopName" label="车间组">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column prop="orderNo" label="关联订单号">
        </el-table-column>
        <el-table-column :formatter="$formatter.formatTime('createDatetime')" label="下单时间">
        </el-table-column>
        <el-table-column :formatter="$formatter.formatTime('productDatetime')" label="生产时间">
        </el-table-column>
        <el-table-column :formatter="$formatter.formatTime('updateDatetime')" label="最后更新时间">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-tabs type="border-card" class="auxiliary-table">
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
      <product-form ref="productForm" :updatedForm="form" :formType="formType"></product-form>
    </el-dialog>
  </div>
</template>
<script>
import ProductForm from './productForm'
export default {
  name: 'stock-management',
  components: {
    [ProductForm.name]: ProductForm
  },
  data() {
    return {
      // 出库页面
      outboundVisible: false,
      // 是否等待
      loading: false,
      // 等待入库
      loadingOfWarehousing: false,
      // 等待出库
      loadingOfOutbound: false,
      // 选中行信息
      multipleSelection: [],
      formTitle: '',
      formType: '',
      orderList: [],
      // 传递到下一页内容
      form: {},
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 根据仓库获取库存信息
      filter: {
      	warehouseName: '全部小组',
        warehouseUuid: '',
    		order_status: {
	          status: '-1',
	          name: '全部状态'
	        }
      },
      // 出库数据
      outbound: [],
      // 入库数据
      warehousing: [],
      // 仓库名
      commands: [],
      productOrderStatus: this.$store.getters.getProductOrderStatus
    }
  },
  methods: {
    // 关闭页面
    handleClose() {
      this.outboundVisible = false
      this.$refs.productForm.resetting()
      this.$message({
        showClose: true,
        message: '已取消' + window.sessionStorage.getItem('formTitle')
      })
    },
    handleDashBoard(command) {
      // 根据仓库id选出仓库名
      this.filter.warehouseUuid = command
      if (this.filter.warehouseUuid === '全部小组') {
        this.filter.warehouseName = '全部小组'
      } else {
        for (let i = 0; i < this.commands.length; i++) {
          if (this.commands[i].warehouseUuid === this.filter.warehouseUuid) {
            this.filter.warehouseName = this.commands[i].warehouseName
          }
        }
      }
      this.queryProductionList(command)
    },
    handleOrderStatus(command) {
      // 根据状态id选出状态名
      this.filter.order_status.status = command
      if (this.filter.order_status.status === '全部状态') {
        this.filter.order_status.name = '全部状态'
      } else {
        for (let i = 0; i < this.productOrderStatus.length; i++) {
          if (this.productOrderStatus[i].id === this.filter.order_status.status) {
            this.filter.order_status.name = this.productOrderStatus[i].label
          }
        }
      }
      this.queryProductionList(command)
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.queryProductionList()
    },
    // 新建生产单
    newProduct(type) {
      this.formTitle = type === 'in' ? '备用开单' : '修改生产单'
      this.formType = type
      window.sessionStorage.setItem('formTitle', this.formTitle)
      this.form = Object.assign({}, {
        // 是每次进入出库页面都清除上次内容
        'shopUuid': this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999),
        'position': '出库原因'
      })
      this.outboundVisible = true
    },
    retract() {
    	this.$http.post('production/retract', {
        'body': {
          productionOrderNo: this.multipleSelection[0].id
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '撤回成功'
        })
        this.queryProductionList()
      })
    },
    reApply() {
    	this.$http.post('production/reApply', {
        'body': {
          productionOrderNo: this.multipleSelection[0].id
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '重新提交成功'
        })
        this.queryProductionList()
      })
    },
    deleteProduct() {
    	this.$http.post('production/retract', {
        'body': {
          productionOrderNo: this.multipleSelection[0].id
        }
      }).then(res => {
        this.$message({
            type: 'success',
            message: '撤回成功'
          })
        this.queryProductionList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取生产单列表
    queryProductionList(store) {
      this.loading = true
      if (store === '全部小组') {
        store = ''
      }
      this.filter.warehouseUuid = store
      let status
      if (this.filter.order_status.status === '全部状态') {
      	status = ''
      } else {
      	status = parseInt(this.filter.order_status.status)
      }
      this.$tool.loadList(this, 'production/orderList', bodyInfo => {
        this.orderList = bodyInfo.info
      }, {
    		status: status
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
    this.queryProductionList()
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
