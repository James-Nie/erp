<template>
  <div>
    <div class="mgb15">
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
          {{filter.store}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in commands" :key="item.id" :command="item.storeName">{{item.storeName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="success" class="mgl10" @click="refresh"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" icon="message" @click="deliverGoodsVisible = true" :disabled="multipleSelection.length !== 1">发货</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="waitDeliverOrderList" ref="multipleTable" v-loading="loading" highlight-current-row stripe style="width: 100%" @current-change="selected" @selection-change="handleSelectionChange" max-height="523">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单号" align="center">
        </el-table-column>
        <el-table-column prop="store" label="店铺名称" align="center">
        </el-table-column>
        <el-table-column label="订单状态" :formatter="$formatter.formatOrderStatus" align="center">
        </el-table-column>
        <el-table-column prop="orderType" label="订单分类" align="center">
        </el-table-column>
        <el-table-column prop="refundStatus" label="退款状态" align="center">
        </el-table-column>
        <el-table-column label="下单时间" align="center" :formatter="$formatter.formatTime('orderDatetime')" width="180">
        </el-table-column>
        <el-table-column prop="name" label="收件人" align="center">
        </el-table-column>
        <el-table-column prop="logisticsMode" label="物流" align="center">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="数量" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 发货表单 -->
    <el-dialog title="物流信息" custom-class="deliver-goods-dialog" :visible.sync="deliverGoodsVisible" size="tiny" @close="resetForm('deliverGoods')">
      <el-form class="deliver-goods-form" ref="deliverGoods" :rules="deliverRules" :model="deliverGoods" label-width="110px" label-position="left">
        <el-form-item label="物流类型" prop="logistics_mode">
          <el-select v-model="deliverGoods.logistics_mode" placeholder="请选择" class="w192">
            <el-option value="快递"></el-option>
            <el-option value="托运"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logistics_number">
          <el-input v-model="deliverGoods.logistics_number" class="w192" placeholder="请输入物流单号"></el-input>
        </el-form-item>
        <el-form-item label="物流公司" prop="logistics_company">
          <el-input v-model="deliverGoods.logistics_company" class="w192" placeholder="请输入物流公司"></el-input>
        </el-form-item>
        <el-form-item label="定时提现时间">
          <el-date-picker v-model="deliverGoods.remind_time" type="datetime" placeholder="选择日期时间" @change="changeRemindTime">
          </el-date-picker>
        </el-form-item>
        <div class="deliver-goods-footer">
          <el-button class="circle-btn" @click="deliverGoodsVisible = false">取消</el-button>
          <el-button class="circle-btn" type="primary" @click="addDeliverGoods('deliverGoods')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 底部辅助表格 -->
    <auxiliary-table type="shippingManagement"></auxiliary-table>
  </div>
</template>
<script>
import AuxiliaryTable from '@/components/AuxiliaryTable'
export default {
  name: 'shipping-management',
  components: {
    [AuxiliaryTable.name]: AuxiliaryTable
  },
  data() {
    return {
      // 商店列表
      commands: [],
      // 发货页面
      deliverGoodsVisible: false,
      // 待发货列表
      waitDeliverOrderList: [],
      current: {},
      // 商店
      filter: {
        store: '全部商店'
      },
      loading: false,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      // 选中行信息
      multipleSelection: [],
      // 物流信息
      deliverGoods: {
        logistics_mode: '',
        logistics_number: '',
        remind_time: '',
        logistics_company: ''
      },
      deliverRules: {
        logistics_mode: [{ required: true, message: '请选择物流类型', trigger: 'change' }],
        logistics_number: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
        logistics_company: [{ required: true, message: '请输入物流公司', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 刷新
    refresh() {
      this.filter.store = '全部商店'
      this._loadMainList()
    },
    // 根据商店刷新发货管理列表
    handleCommand(command) {
      this.filter.store = command
      this._loadMainList()
    },
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/OrderWaitDeliverExcelport')
    },
    // 设置提醒时间
    changeRemindTime(val) {
      this.deliverGoods.remind_time = val
    },
    // 点击一行，刷新辅助表格
    selected(current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    // 将选中行信息放入multipleSelection
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 确认添加物流信息
    addDeliverGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$tool.common(this, 'order/deliverGoods', {
            'user_name': this.$store.getters.getAccount.name,
            'order_uuid': this.current.orderUuid,
            ...this.deliverGoods
          }, bodyInfo => {
            this.deliverGoodsVisible = false
            this._loadMainList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭页面，清除数据
    resetForm(formName) {
      this.deliverGoods = {
        logistics_mode: '',
        logistics_number: '',
        logistics_company: '',
        remind_time: ''
      }
      this.$refs[formName].resetFields()
    },
    // 获取商店列表
    queryShop() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.commands = bodyInfo.apiResult
      })
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取待发货商品列表
    _loadMainList() {
      this.$tool.loadList(this, 'order/waitDeliverlist', bodyInfo => {
        this.waitDeliverOrderList = bodyInfo.WaitDeliverOrderList
      }, {
        'order_status': '7',
        'store': this.filter.store === '全部商店' ? '' : this.filter.store
      })
    }
  },
  mounted() {
    this.queryShop()
    this._loadMainList()
  },
  destroyed() {
    this.$store.commit('selected', {})
  }
}

</script>
<style lang="scss">
.deliver-goods-form {
  width: 314px;
  margin: auto;
}

.deliver-goods-dialog {
  width: 500px;
}

.deliver-goods-footer {
  margin-top: 60px;
  text-align: center;
  .el-button+.el-button {
    margin-left: 20px;
  }
}

</style>
