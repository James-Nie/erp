<!-- 底部辅助表格 -->
<template>
  <el-tabs v-model="activeIndex" type="border-card" class="auxiliary-table">
  	<el-tab-pane label="财审原因" name="financeAuditReason" v-if="type === 'financeAudit'">
      <el-table :data="financeAuditReason" stripe style="width: 100%" max-height="163">
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column prop="operator" label="操作人" align="center" width="180">
        </el-table-column>
        <el-table-column prop="content" label="进财审原因" align="center">
        </el-table-column>
        <el-table-column label="创建时间" :formatter="$formatter.formatTime('createDatetime')" align="center" width="180">
        </el-table-column>
        <el-table-column prop="model" label="规格" align="center" width="100">
        </el-table-column>
        <el-table-column prop="length" label="长度(mm)" align="center" width="100">
        </el-table-column>
        <el-table-column prop="customerServiceRequire" label="售后要求" align="center" width="100">
        </el-table-column>
        <el-table-column prop="number" label="数量" align="center" width="100">
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="日志" name="log" v-if="type !== 'orderOrignal'">
      <el-table :data="log" stripe style="width: 100%" max-height="163">
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
				<el-table-column prop="operator" label="操作员" align="center" width="100">
        </el-table-column>
        <el-table-column prop="content" label="内容" align="center">
        </el-table-column>
        <el-table-column label="时间" :formatter="$formatter.formatTime('createDatetime')" align="center" width="180">
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="订单详情" name="detail">
      <!-- 订单详情 -->
      <div class="grid" v-if="type === 'orderManage' || type === 'orderStatistics' || type === 'financialAudit' || type === 'invoiceManagement' || type === 'shippingManagement'">
        <div class="grid-row clearfix">
          <div class="cell">订单编号</div>
          <div class="cell">{{detail.id}}</div>
          <div class="cell">货品种类数</div>
          <div class="cell">{{detail.typeNumber}}</div>
          <div class="cell">货品总量</div>
          <div class="cell">{{detail.goodsNumber}}</div>
          <div class="cell">店铺名称</div>
          <div class="cell">{{detail.storeName}}</div>
          <div class="cell">订单状态</div>
          <div class="cell">{{this.$formatter.formatOrderStatus(detail)}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">订单类型</div>
          <div class="cell">{{detail.orderType}}</div>
          <div class="cell">退款状态</div>
          <div class="cell">{{detail.refundStatus}}</div>
          <div class="cell">物流单号</div>
          <div class="cell">{{detail.logisticsNumber}}</div>
          <div class="cell">下单时间</div>
          <div class="cell">{{detail.orderDatetime && formatDate(detail.orderDatetime)}}</div>
          <div class="cell">发货时间</div>
          <div class="cell">{{detail.sendDatetime && formatDate(detail.sendDatetime)}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">支付账号</div>
          <div class="cell">{{detail.payAccount}}</div>
          <div class="cell">付款时间</div>
          <div class="cell">{{detail.payDatetime && formatDate(detail.payDatetime)}}</div>
          <div class="cell">客户名称</div>
          <div class="cell">{{detail.name}}</div>
          <div class="cell">收件人</div>
          <div class="cell">{{detail.addressee}}</div>
          <div class="cell">省市县</div>
          <div class="cell">{{detail.city && detail.city.join('/')}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">手机</div>
          <div class="cell">{{detail.phone}}</div>
          <div class="cell">地址</div>
          <div class="cell cell-7">{{detail.address}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">电话</div>
          <div class="cell cell-2">{{detail.telephone}}</div>
          <div class="cell">邮编</div>
          <div class="cell cell-2">{{detail.postcode}}</div>
          <div class="cell">物流公司</div>
          <div class="cell cell-2">{{detail.logisticsModeId}}</div>
          <div class="cell"></div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">买家留言</div>
          <div class="cell cell-4">{{detail.buyerRemark}}</div>
          <div class="cell">客户备注</div>
          <div class="cell cell-4">{{detail.serviceRemark}}</div>
        </div>
      </div>
      <!-- 采购单详情 -->
      <div class="grid" v-if="type === 'purchase'">
        <div class="grid-row clearfix">
          <div class="cell">供应商</div>
          <div class="cell">{{purchaseDetail.supplier}}</div>
          <div class="cell">联系人</div>
          <div class="cell">{{purchaseDetail.contacts}}</div>
          <div class="cell">联系电话</div>
          <div class="cell">{{purchaseDetail.phone}}</div>
          <div class="cell">收货地址</div>
          <div class="cell">{{purchaseDetail.address}}</div>
          <div class="cell">采购员</div>
          <div class="cell">{{purchaseDetail.buyer}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">备注</div>
          <div class="cell">{{purchaseDetail.remark}}</div>
          <div class="cell">供货方式</div>
          <div class="cell">{{purchaseDetail.transportationMode}}</div>
          <div class="cell">邮资</div>
          <div class="cell">{{purchaseDetail.postage}}</div>
          <div class="cell">其他金额</div>
          <div class="cell">{{purchaseDetail.otherAmount}}</div>
          <div class="cell">税前总货款</div>
          <div class="cell">{{purchaseDetail.beforeTaxAmount}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">税后总货款</div>
          <div class="cell">{{purchaseDetail.afterTaxAmount}}</div>
          <div class="cell">采购类型</div>
          <div class="cell">{{purchaseDetail.goodsCategory}}</div>
          <div class="cell">采购总价</div>
          <div class="cell">{{purchaseDetail.totalAmount}}</div>
          <div class="cell cell-4"></div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="便签" name="notes" v-if="type !== 'orderOrignal'">
      <el-button class="mgb15" type="primary" @click="handlePopupNote" :disabled="$tool.isEmptyObject(current)">添加</el-button>
      <el-table :data="note" stripe style="width: 100%" max-height="120">
        <el-table-column type="index" label="序号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="operator" label="操作员" align="center">
        </el-table-column>
        <el-table-column prop="content" label="内容" align="center">
        </el-table-column>
        <el-table-column label="时间" :formatter="$formatter.formatTime('createDatetime')" align="center">
        </el-table-column>
      </el-table>
      <!-- 新增便签 -->
      <el-dialog custom-class="note-dialog" title="订单便签" size="tiny" :visible.sync="notesVisible" @close="closeNote">
        <el-form :inline="true" :model="dialogOfNote" :rules="rulesOfNote" ref="dialogOfNote">
          <el-form-item label="快捷选项" prop="content">
            <el-select v-model="dialogOfNote.content" placeholder="请选择">
              <el-option v-for="item in quickList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="more" @click="toggleShortcutPanel('notesVisible', 'shortcutVisivble')"></el-button>
          </el-form-item>
          <el-input class="mgb30" type="textarea" :rows="6" placeholder="请输入内容" v-model="dialogOfNote.content">
          </el-input>
          <div class="text-center">
          	<el-button class="circle-btn" type="primary" @click="resetNoteForm">取消</el-button>
            <el-button class="circle-btn" type="primary" @click="handleSave('dialogOfNote')">保存</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog custom-class="shortcut-dialog" title="快捷键选项编辑" :visible.sync="shortcutVisivble" @close="editShortcuts">
        <edit-shortcuts ref="edit-shortcuts"></edit-shortcuts>
      </el-dialog>
    </el-tab-pane>
    <!-- 货品列表 -->
    <el-tab-pane label="货品列表" name="goods">
      <goods-list :data="goods" v-if="type === 'orderManage' || type === 'orderStatistics' || type === 'financialAudit' || type === 'invoiceManagement' || type === 'shippingManagement'"></goods-list>
      <el-table :data="purchaseGoods" stripe style="width: 100%" v-if="type === 'purchase'" max-height="163">
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center" width="180">
        </el-table-column>
        <el-table-column prop="model" label="规格" align="center">
        </el-table-column>
        <el-table-column prop="length" label="长度(mm)" align="center">
        </el-table-column>
        <el-table-column prop="width" label="宽度(mm)" align="center">
        </el-table-column>
        <el-table-column prop="purchasePrice" label="采购单价" align="center">
        </el-table-column>
        <el-table-column label="采购数量" align="center" prop="number">
        </el-table-column>
        <el-table-column prop="goodsWeight" label="货品单重" align="center">
        </el-table-column>
        <el-table-column label="采购总价" prop="purchasePrice" align="center">
        </el-table-column>
        <el-table-column label="采购总重" prop="purchaseWeight" align="center">
        </el-table-column>
        <el-table-column label="到货时间" align="center" :formatter="$formatter.formatTime('endTime')">
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark">
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="物流跟踪" name="logistics" v-if="type !== 'orderOrignal'">
      <el-steps :space="260" :active="logisticsList.length">
        <el-step v-for="item in logisticsList" :key="item.logisticTime" :title="item.str" :description="item.logisticTime"></el-step>
      </el-steps>
    </el-tab-pane>
    <el-tab-pane label="生产详情" name="production" v-if="type !== 'purchase' && type !== 'orderStatistics' && type !== 'financialAudit' &&  type !== 'invoiceManagement' && type !== 'shippingManagement' && type !== 'orderOrignal'">
      <el-table :data="productionGoods" stripe style="width: 100%" max-height="163">
        <el-table-column type="index" label="序号" width="200" align="center">
        </el-table-column>
        <el-table-column label="生产单号" prop="id" align="center">
        </el-table-column>
        <el-table-column label="货品编码" align="center">
        </el-table-column>
        <el-table-column label="货品名称" prop="goodsName" align="center">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center">
        </el-table-column>
        <el-table-column prop="model" label="规格" align="center">
        </el-table-column>
        <el-table-column prop="length" label="长度(mm)" align="center">
        </el-table-column>
        <el-table-column prop="number" label="生产数量" align="center">
        </el-table-column>
        <el-table-column label="生产备注" align="center">
        </el-table-column>
        <el-table-column label="车间" align="center">
        </el-table-column>
        <el-table-column label="下单时间" align="center">
        </el-table-column>
        <el-table-column label="状态" :formatter="$formatter.formatOrederProductType" align="center">
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="系统订单" name="systemOrder" v-if="type === 'orderOrignal'">
      <el-table :data="sysOrderList" stripe style="width: 100%" max-height="163">
        <el-table-column type="index" label="序号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="orderNumber" label="系统单号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" :formatter="$formatter.formatOrderStatus" align="center">
        </el-table-column>
        <el-table-column prop="model" label="业务员" align="center">
        </el-table-column>
        <el-table-column prop="length" label="审单员" align="center">
        </el-table-column>
        <el-table-column prop="width" label="生产车间" align="center">
        </el-table-column>
        <el-table-column prop="number" label="分拣员" align="center">
        </el-table-column>
        <el-table-column label="货品数量" align="center">
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
        </el-table-column>
        <el-table-column prop="warehouse" label="处理天数" align="center">
        </el-table-column>
        <el-table-column prop="warehouse" label="审核时间" align="center">
        </el-table-column>
        <el-table-column prop="warehouse" label="发货时间" align="center">
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
  
</template>

<script>
import GoodsList from './GoodsList'
import EditShortcuts from './EditShortcuts'
export default {
  name: 'AuxiliaryTable',
  components: {
    [GoodsList.name]: GoodsList,
    [EditShortcuts.name]: EditShortcuts
  },
  props: {
    type: String
  },
  data () {
    return {
      activeIndex: 'log',
      shortcutEditingVisivble: false,
      notesVisible: false,
      shortcutVisivble: false,
      log: [],
      detail: {},
      purchaseDetail: {},
      note: [],
      goods: [],
      quickList: [],
      purchaseGoods: [],
      productionGoods: [],
      logisticsList: [],
      sysOrderList: [],
      financeAuditReason: [],
      dialogOfNote: {
        content: ''
      },
      rulesOfNote: {
        content: {required: true, message: '内容不能为空', trigger: 'change'}
      }
    }
  },
  computed: {
    current() {
      return this.$store.state.common.current || {}
    }
  },
  watch: {
    current(val) {
      if (this.$tool.isEmptyObject(val)) {
        this.shortcutEditingVisivble = false
        this.notesVisible = false
        this.shortcutVisivble = false
        this.clearTable()
        return false
      }
      this.queryTab()
    },
    activeIndex() {
      if (!this.$tool.isEmptyObject(this.current)) {
        this.queryTab()
      }
    }
  },
  methods: {
    queryTab() {
      const queryMap = {
        'log': this.queryLog,
        'detail': this.type === 'purchase' ? this.queryPurchaseDetail : this.queryDetail,
        'notes': this.queryNote,
        'goods': this.type === 'purchase' ? this.queryPurchaseGoods : this.queryGoods,
        'logistics': this.queryLogistics,
        'production': this.queryProduction,
        'systemOrder': this.querySystemOrder,
        'financeAuditReason': this.queryFinanceAuditReason
      }
      queryMap[this.activeIndex]()
    },
    // 清空表格内容
    clearTable() {
      this.log = []
      this.detail = {}
      this.purchaseDetail = {}
      this.note = []
      this.goods = []
      this.purchaseGoods = []
      this.productionGoods = []
      this.quickList = []
      this.logisticsList = []
    },
    // 查询快捷语列表
    queryQuickList() {
      this.$tool.loadOptions(this, 'quick/list', bodyInfo => {
        this.quickList = bodyInfo.QuickList.map(item => ({'value': item.content}))
      })
    },
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$tool.common(this, 'note/create', {
            'user_name': this.$store.getters.getAccount.name,
            'order_number': this.type === 'purchase' ? this.current.purchaseUuid : this.current.orderNumber,
            'content': this.dialogOfNote.content
          }, bodyInfo => {
            this.notesVisible = false
            this.queryNote()
          })
        }
      })
    },
    // 切换快捷键面板
    toggleShortcutPanel(prev, next) {
      this[prev] = false
      window.setTimeout(() => {
        this[next] = true
      }, 500)
    },
    // 查询日志
    queryLog() {
      this.$tool.loadOptions(this, 'log/list', bodyInfo => {
        this.log = bodyInfo.info
      }, {
      	bizType: 0,
        outOrderNo: this.current.id,
       	pageIndex: 0,
    		pageSize: 10
      })
    },
    // 查询详情
    queryDetail() {
      this.$tool.common(this, 'order/list', {
        'orderNo': this.current.id
      }, bodyInfo => {
        this.detail = bodyInfo.info[0]
      })
    },
    // 查询采购单详情
    queryPurchaseDetail() {
      this.$tool.common(this, 'purchase/find', {
        'purchase_uuid': this.current.purchaseUuid
      }, bodyInfo => {
        this.purchaseDetail = bodyInfo.purchase
      })
    },
    // 关闭新增便签
    closeNote() {
      this.dialogOfNote.content = ''
    },
    resetNoteForm() {
    	this.closeNote()
    	this.notesVisible = false
    },
    // 查询便签
    queryNote() {
      this.$tool.loadOptions(this, 'note/list', bodyInfo => {
        this.note = bodyInfo.NoteList
      }, {
        order_number: this.type === 'purchase' ? this.current.purchaseUuid : this.current.orderNumber
      })
    },
    // 查询货品
    queryGoods() {
      this.$tool.loadOptions(this, 'order/orderGoods', bodyInfo => {
        this.goods = bodyInfo.info
      }, {
        orderNo: this.current.id
      })
    },
    // 查询货品列表
    queryPurchaseGoods() {
      this.$tool.common(this, 'purchase/find', {
        'purchase_uuid': this.current.purchaseUuid
      }, bodyInfo => {
        this.purchaseGoods = bodyInfo.PurchaseGoodslist
      })
    },
    // 查询生产详情
    queryProduction() {
      this.$tool.loadOptions(this, 'production/orderList', bodyInfo => {
        this.productionGoods = bodyInfo.info[0]
      }, {
        'orderNo': this.current.id
      })
    },
    // 查询系统订单
    querySystemOrder() {
    	this.$tool.common(this, 'original/refOrderList', {
        'originalOrderNumber': this.current.originalOrderNumber
      }, bodyInfo => {
        this.sysOrderList = bodyInfo.refOrderList
      })
    },
    // 查询财审原因
    queryFinanceAuditReason() {
    	this.$tool.common(this, 'purchase/find', {
        'orderNumber': this.current.orderNumber
      }, bodyInfo => {
        this.sysOrderList = bodyInfo.PurchaseGoodslist
      })
    },
    // 查询物流
    queryLogistics() {
      this.$tool.common(this, 'order/logistics', {
        'orderNumber': this.current.orderNumber
      }, bodyInfo => {
        this.logisticsList = bodyInfo.logistic
      })
    },
    // 弹出订单便签面板
    handlePopupNote() {
      this.queryQuickList()
      this.notesVisible = true
    },
    editShortcuts() {
      this.toggleShortcutPanel('shortcutVisivble', 'notesVisible')
      this.$refs['edit-shortcuts'].resetStatus()
    },
    // 转化时间
    formatDate(time) {
    	return this.$moment(new Date(time)).format('YYYY-MM-DD HH:MM:SS')
    }
  }
}
</script>

<style lang="scss">
.el-tab-pane {
  overflow: auto;
}
.note-dialog {
  width: 576px;
}
.shortcut-dialog {
  width: 950px;
}
.grid {
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  width: 100%;
  display: flex;
  flex-direction: column;
  .grid-row {
    display: flex;
    .cell {
      word-break:break-word;
      text-align: center;
      padding: 8px 0;
      flex: 1;
      border-right: 1px solid #dfe6ec;
      border-bottom: 1px solid #dfe6ec;
      font-size: 15px;
    }
    .cell-2{
    	flex: 2;
      padding-left: 3px;
    }
    .cell-4 {
      flex: 4;
      padding-left: 3px;
    }
    .cell-7{
    	flex: 7;
      padding-left: 3px;
    }
  }
}
</style>