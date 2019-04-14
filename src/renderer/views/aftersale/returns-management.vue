<template>
  <div class="returnsManagement">
    <div class="mgb15">
    <!-- 选择商店 -->
      <el-dropdown @command="handleDashBoard" trigger="click">
        <el-button style="width:100px" type="primary">{{storeName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="全部商店">全部商店</el-dropdown-item>
          <el-dropdown-item v-for="item in command" :key="item.id" :command="item.storeName">{{item.storeName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" @click="getReturnGoodsList" class="mgl10"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <!-- 有权限，选择数量为1，状态为10（待财审）时 允许点击-->
      <el-button type="primary" @click="submitAudit('通过')" :disabled="!permission || multipleSelection.length !== 1 || multipleSelection[0].orderStatus !== '10'"><i class="iconfont icon-artboard38"></i>提交审核</el-button>
      <!-- 有权限，选择数量为1，状态为10（待财审）时 允许点击 -->
      <el-button type="danger" @click="submitAudit('驳回')" :disabled="!permission || multipleSelection.length !== 1 || multipleSelection[0].orderStatus !== '10'"><i class="iconfont icon-artboard38"></i>驳回</el-button>
      <!-- 有权限，选择数量为1， 允许点击 输入退货信息-->
      <el-button type="primary" @click="dialogVisible = true" :disabled="!permission || multipleSelection.length !== 1"><i class="iconfont icon-artboard38"></i>退货信息</el-button>
      <!-- 导出数据 -->
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
    </div>
    <!-- 退货列表 -->
    <div class="table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%;textAlign:center" @selection-change="handleSelectionChange" highlight-current-row ref="multipleTable" @current-change="selected" max-height="523">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70">
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单号" style="textAlign:center" width="180">
        </el-table-column>
        <el-table-column prop="store" label="店铺名称">
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" :formatter="regionFormatter">
        </el-table-column>
        <el-table-column prop="orderType" label="订单分类">
        </el-table-column>
        <el-table-column prop="refundStatus" label="退款状态">
        </el-table-column>
        <el-table-column prop="orderDatetime" label="下单时间" width="160" :formatter="$formatter.formatTime('orderDatetime')">
        </el-table-column>
        <el-table-column prop="addressee" label="收件人">
        </el-table-column>
        <el-table-column prop="logisticsMode" label="物流">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="数量">
        </el-table-column>
        <el-table-column prop="actualMoney" label="金额">
        </el-table-column>
        <el-table-column prop="afterSalesNumber" label="退货单号" width='260'>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 底部辅助表格 -->
    <auxiliary-table type="orderManage"></auxiliary-table>
    <!-- 退货信息输入组件 -->
    <el-dialog title="退货信息" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
      <el-form ref="returnGoodsForm" :rules="rules" :model="returnGoodsForm" label-width="80px" style="width:340px;margin:auto;">
        <el-form-item label="运输方式" prop="type">
          <el-select v-model="returnGoodsForm.type">
            <el-option value="快递">快递</el-option>
            <el-option value="托运">托运</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="number">
          <el-input v-model="returnGoodsForm.number" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="物流公司" prop="logisticsCompany">
          <el-input v-model="returnGoodsForm.logisticsCompany" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="定时提醒">
          <el-date-picker type="date" placeholder="选择日期" v-model="returnGoodsForm.date1" style="width:217px;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="getReturnGoodsWybillInformation('returnGoodsForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import AuxiliaryTable from '@/components/AuxiliaryTable'
export default {
  name: 'returns-management',
  components: {
    [AuxiliaryTable.name]: AuxiliaryTable
  },
  data() {
    return {
      // 是否显示退货信息页
      dialogVisible: false,
      // 存储退货信息
      returnGoodsForm: {},
      // 存储商店列表
      command: [],
      // 存储所选择的退货单
      multipleSelection: [],
      // 商店名
      storeName: '全部商店',
      // 存储所选商店
      store: '',
      // 便签
      noteList: [],
      // 是否允许添加便签
      addNode: true,
      // 选择退货单数量
      selectNumber: 0,
      // 退货列表
      tableData: [],
      // 存储选择的退货单的order_number
      submitAuditList: [],
      // 表单验证规则
      rules: { returnGoodsNumber: [{ required: true, message: '请输入退货单号', trigger: 'blur' }],
        logisticsCompany: [{required: true, message: '请输入快递公司名称', trigger: 'blur'}],
        number: [{required: true, message: '请输入快递编号', trigger: 'blur'}],
        type: [{required: true, message: '请选择运输方式', trigger: 'blur'}]},
      // 分页数据的显示
      pagination: {
        count: 0,
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        page: 0
      }
    }
  },
  computed: {
    permission() {
      // 获取权限信息
      return this.$store.getters.hasPermission('returnGoodsManageWrite')
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/ReturnOrderExcelport')
    },
    // 点击一行时，触发辅助栏信息刷新
    selected(current) {
      this.current = current
      this.$store.commit('selected', current)
    },
    // 关闭退货信息输入框，清除输入的退货信息
    handleClose() {
      this.returnGoodsForm = {}
      this.dialogVisible = false
    },
    // 审核
    submitAudit(val) {
      // 通过不同的参数val，设置不同的审核状态
      let orderStatus
      if (val === '通过') {
        // 如果点击提交审核，订单状态改为11（退货中）
        orderStatus = 11
      } else if (val === '驳回') {
        // 如果点击驳回，订单状态改为13（退货驳回）
        orderStatus = 13
      }
      // 显示提示信息
      this.$confirm('请确认' + val + '审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 确定之后发起改变状态请求
        this.$http.post('order/changeStatus', {
          'body': {
            'user_name': this.$store.getters.getAccount.name,
            // 要改变的退货单的退货单号
            'order_number': this.submitAuditList[0],
            'order_status': orderStatus
          }
        }).then(res => {
          // 状态改变成功，刷新退后单列表
          this.getReturnGoodsList()
          // 信息提示
          this.$message({
            type: 'success',
            message: '审核' + val + '!'
          })
        })
      }).catch(() => {
        // 提示已取消
        this.$message({
          type: 'info',
          message: '已取消审核' + val
        })
      })
    },
    // 选择退后单时触发
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 刷新选择的退货单的数量
      this.selectNumber = this.multipleSelection.length
      // 存储选择的退后单号
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.submitAuditList[i] = this.multipleSelection[i].orderNumber
      }
    },
    // 过滤器，将订单状态由数字改为文字
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
      return mapping[row.orderStatus]
    },
    // 商店下拉列表
    handleDashBoard(a) {
      this.storeName = a
      // 根据所选商店,刷新退货列表
      if (this.storeName === '全部商店') {
        this.store = ''
      } else {
        this.store = this.storeName
      }
      this.getReturnGoodsList()
    },
    // 获取退货列表
    getReturnGoodsList() {
      this.$http.post('order/returnGoodsLisrt', {
        'body': {
          ...this.pagination,
          'store': this.store
        }
      }).then(res => {
        // 刷新退货列表数据
        this.tableData = res.data.body.ReturnGoodsOrderList
        // 刷新分页数据
        this.pagination.total = Math.ceil(res.data.body.count / this.pagination.pageSize)
        this.pagination.count = res.data.body.count
        this.pagination.page = res.data.body.page
      }).catch(res => {
        console.log(res)
      })
    },
    // 点击分页,获取第val页的数据,刷新列表
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.getReturnGoodsList()
    },
    // 退货信息添加
    getReturnGoodsWybillInformation(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('returnGoods/waybillInformation', {
            'body': {
              'user_name': this.$store.getters.getAccount.name,
              'order_number': this.multipleSelection[0].orderNumber,
              'transport_type': this.returnGoodsForm.type,
              'express_number': this.returnGoodsForm.number,
              'logistics_company': this.returnGoodsForm.logisticsCompany,
              'remind_time': this.returnGoodsForm.date1
            }
          }).then(res => {
            // console.log(res)
            this.handleClose()
          }).catch(res => {
            // console.log(res)
          })
        }
      })
    },
    // 获取商店列表
    getStoreList() {
      this.$http.post('store/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000
        }
      }).then(res => {
        // console.log(res)商店
        this.command = res.data.body.apiResult
      }).catch(res => {
        console.log(res)
      })
    }
  },
  mounted() {
    // 获取退货单号
    this.getReturnGoodsList()
    // 获取商店列表
    this.getStoreList()
  },
  destroyed() {
    this.$store.commit('selected', {})
    window.clearTimeout(this.timer)
  }
}

</script>
<style lang="scss">
.returnsManagement {
  .el-dialog--tiny {
    width: 480px;
  }
  .returnsManagementTextAlign {
    text-align: center;
  }
  .el-table th>.cell {
    text-align: center;
  }
  .el-table .cell {
    text-align: center;
  }
  .el-dialog__footer {
    text-align: center
  }
  .logInfo {
    width: 480px;
  }
  .el-col-8 {
    text-align:center
  }
}


</style>
