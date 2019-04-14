<template>
  <div>
    <div class="mgb15">
      <el-button type="success" class="mgl10" @click="refresh"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
      <el-button type="primary" icon="message" @click="deliverGoodsVisible = true" :disabled="multipleSelection.length === 0">发货</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="waitDeliverOrderList" ref="multipleTable" v-loading="loading" highlight-current-row stripe style="width: 100%" @current-change="selected" @selection-change="handleSelectionChange" max-height="523">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column prop="afterSalesNumber" label="售后单号" align="center">
        </el-table-column>
        <el-table-column prop="name" label="客户名称" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" align="center">
        </el-table-column>
        <el-table-column prop="associatedOrders" label="关联订单" align="center">
        </el-table-column>
        <el-table-column prop="salesman" label="业务员" align="center">
        </el-table-column>
        <el-table-column prop="typeNumber" label="产品种类" align="center">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="产品总量" align="center">
        </el-table-column>
        <el-table-column prop="actualMoney" label="总价" align="center">
        </el-table-column>
        <el-table-column prop="discountMoney" label="金额" align="center">
        </el-table-column>
        <el-table-column prop="orderState" label="订单状态" align="center">
        </el-table-column>
        <el-table-column label="收货时间" :formatter="$formatter.formatTime('goodsReceiptTime')" align="center" width="180">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 发货表单 -->
    <el-dialog title="物流信息" custom-class="deliver-goods-dialog" :visible.sync="deliverGoodsVisible" size="tiny" @close="closeDeliverGoods">
      <el-form class="deliver-goods-form" ref="deliverGoods" :rules="deliverRules" :model="deliverGoods" label-width="110px" label-position="left">
        <el-form-item label="物流类型" prop="logistics_mode">
          <el-select v-model="deliverGoods.logistics_mode" placeholder="请选择" class="w192">
            <el-option value="快递"></el-option>
            <el-option value="托运"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logistics_number">
          <el-input v-model="deliverGoods.logistics_number" class="w192"></el-input>
        </el-form-item>
        <el-form-item label="定时提现时间">
          <el-date-picker v-model="deliverGoods.remind_time" type="datetime" placeholder="选择日期时间" @change="changeRemindTime">
          </el-date-picker>
        </el-form-item>
        <div class="deliver-goods-footer">
          <el-button class="circle-btn" @click="resetForm('deliverGoods')">取消</el-button>
          <el-button class="circle-btn" type="primary" @click="addDeliverGoods('deliverGoods')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 底部辅助表格 -->
    <auxiliary-table></auxiliary-table>
  </div>
</template>
<script>
import AuxiliaryTable from '@/components/AuxiliaryTable'
export default {
  name: 'afterale-shipping',
  components: {
    [AuxiliaryTable.name]: AuxiliaryTable
  },
  data() {
    return {
      // 发货页面
      deliverGoodsVisible: false,
      // 待发货列表
      waitDeliverOrderList: [],
      current: {},
      loading: false,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      multipleSelection: [],
      // 物流信息
      deliverGoods: {
        logistics_mode: '',
        logistics_number: '',
        remind_time: ''
      },
      deliverRules: {
        logistics_mode: [{ required: true, message: '请选择物流类型', trigger: 'change' }],
        logistics_number: [{ required: true, message: '请输入物流单号', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 刷新
    refresh() {
      this.filter.store = ''
      this._loadMainList()
    },
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/OrderWaitDeliverExcelport')
    },
    // 定时提现时间改变时改变提醒内容
    changeRemindTime(val) {
      this.deliverGoods.remind_time = val
    },
    // 点击一行，改刷新辅助页面数据
    selected(current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 提交。
    addDeliverGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$tool.common(this, 'order/deliverGoods', {
            'user_name': this.$store.getters.getAccount.name,
            'order_uuid': this.current.orderUuid,
            'logistics_mode': this.deliverGoods.logistics_mode,
            'logistics_number': this.deliverGoods.logistics_number,
            'remind_time': this.deliverGoods.remind_time
          }, bodyInfo => {
            // 成功之后，清空数据，关闭页面
            this.resetForm()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 清空发货表单
    closeDeliverGoods() {
      this.deliverGoods = {
        logistics_mode: '',
        logistics_number: '',
        remind_time: ''
      }
    },
    // 清空数据，关闭页面
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.deliverGoodsVisible = false
    },
    // 获取商店列表
    queryShop() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.commands = bodyInfo.apiResult
      })
    },
    // 分页， 刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取售后发货列表
    _loadMainList() {
      this.$tool.loadList(this, 'afterSalesOrder/waitDeliverlist', bodyInfo => {
        this.waitDeliverOrderList = bodyInfo.WaitDeliverOrderList
      }, {
        'order_status': '7'
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
