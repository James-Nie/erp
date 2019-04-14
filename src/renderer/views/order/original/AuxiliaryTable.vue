<!-- 底部辅助表格 -->

<template>
  <el-tabs v-model="activeIndex" type="border-card" class="auxiliary-table">
    <el-tab-pane label="订单详情" name="detail">
      <!-- 订单详情 -->
      <div class="grid" v-if="type === 'orderOrignal' ">
        <div class="grid-row clearfix">
          <div class="cell">订单编号</div>
          <div class="cell">{{detail.id}}</div>
          <div class="cell">店铺名称</div>
          <div class="cell">{{detail.store}}</div>
          <div class="cell">订单状态</div>
          <div class="cell">{{this.$formatter.formatOrderStatus(detail)}}</div>
          <div class="cell">退款状态</div>
          <div class="cell">{{detail.refundStatus}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">物流单号</div>
          <div class="cell">{{detail.logisticsNumber}}</div>
          <div class="cell">下单时间</div>
          <div class="cell">{{detail.orderDatetime && formatDate(detail.orderDatetime)}}</div>
          <div class="cell">发货时间</div>
          <div class="cell">{{detail.sendDatetime && formatDate(detail.sendDatetime)}}</div>
        	<div class="cell">付款时间</div>
          <div class="cell">{{detail.payDatetime && formatDate(detail.payDatetime)}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">客户名称</div>
          <div class="cell">{{detail.name}}</div>
          <div class="cell">收件人</div>
          <div class="cell">{{detail.name}}</div>
          <div class="cell">省市县</div>
          <div class="cell">{{detail.province+detail.city+detail.town}}</div>
          <div class="cell">手机</div>
          <div class="cell">{{detail.phone}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">电话</div>
          <div class="cell cell-3">{{detail.telephone}}</div>
          <div class="cell">物流公司</div>
          <div class="cell cell-3">{{detail.logisticsName}}</div>
        </div>
        <div class="grid-row clearfix">
        	<div class="cell">地址</div>
          <div class="cell cell-7">{{detail.address}}</div>
        </div>
        <div class="grid-row clearfix">
          <div class="cell">买家留言</div>
          <div class="cell cell-3">{{detail.buyerRemark}}</div>
          <div class="cell">客服备注</div>
          <div class="cell cell-3">{{detail.serviceRemark}}</div>
        </div>
      </div>
    </el-tab-pane>
    <!-- 货品列表 -->
    <el-tab-pane label="货品列表" name="goods" v-if="type === 'orderOrignal'">
        <el-table :data="goodsList" stripe style="width: 100%" max-height="163">
		    	<el-table-column type="index" label="序号" width="70" align="center">
		     	</el-table-column>
		      <el-table-column prop="goodsId" label="货品编码" align="center">	
		      </el-table-column>
		      <el-table-column prop="goodsName" label="货品名称" align="center">
					</el-table-column>
		      <el-table-column prop="brand" label="品牌" align="center">
		      </el-table-column>
		      <el-table-column prop="model" label="规格" align="center">
		      </el-table-column>
		      <el-table-column prop="length" label="长度(mm)" align="center">
		      </el-table-column>
		      <el-table-column prop="category" label="分类" align="center">
		      </el-table-column>
		      <el-table-column prop="supplier" label="供应商" align="center">
		      </el-table-column>
		      <el-table-column prop="sellCount" label="数量" align="center">
		      </el-table-column>
		      <el-table-column prop="sellPrice" label="销售单价(元)" align="center">
		      </el-table-column>   
		      <el-table-column prop="allPrice" label="总价(元)" align="center">
		      </el-table-column>
		      <el-table-column prop="oneWeight" label="单重" align="center">
		      </el-table-column>
		      <el-table-column prop="allWeight" label="预估总量" align="center">
		      </el-table-column>
		    </el-table>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="系统订单" name="systemOrder" v-if="type === 'orderOrignal'">
      <el-table :data="sysOrderList" stripe style="width: 100%" max-height="163">
        <el-table-column type="index" label="序号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="id" label="系统单号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" :formatter="$formatter.formatOrderStatus" align="center">
        </el-table-column>
        <el-table-column prop="salesman" label="业务员" align="center">
        </el-table-column>
        <el-table-column prop="" label="审单员" align="center">
        </el-table-column>
        <el-table-column prop="" label="生产车间" align="center">
        </el-table-column>
        <el-table-column prop="" label="分拣员" align="center">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="货品数量" align="center">
        </el-table-column>
        <el-table-column prop="serviceRemark" label="备注" align="center">
        </el-table-column>
        <el-table-column prop="" label="处理天数" align="center">
        </el-table-column>
        <el-table-column prop="" label="审核时间" align="center">
        </el-table-column>
        <el-table-column prop="sendDatetime" label="发货时间" align="center">
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

export default {
  name: 'AuxiliaryTable',
  components: {},
  props: {
    type: String
  },
  data () {
    return {
      activeIndex: 'detail',
      detail: {},
      goodsList: [],
      sysOrderList: []
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
        'detail': this.queryDetail,
        'goods': this.queryGoods,
        'systemOrder': this.querySystemOrder
      }
      queryMap[this.activeIndex]()
    },
    // 清空表格内容
    clearTable() {
      this.detail = {}
      this.goodsList = []
      this.sysOrderList = []
    },
    // 查询详情
    queryDetail() {
      this.$tool.common(this, 'original/orderDetail', {
        'originalOrderNumber': this.current.id
      }, bodyInfo => {
        this.detail = bodyInfo.info
      })
    },
    // 查询货品
    queryGoods() {
      this.$tool.loadOptions(this, 'original/orderGoodsList', bodyInfo => {
        this.goodsList = bodyInfo.info
      }, {
        'originalOrderNumber': this.current.id
      })
    },
    // 查询系统订单
    querySystemOrder() {
    	this.$tool.common(this, 'original/refOrderList', {
        'originalOrderNumber': this.current.id
      }, bodyInfo => {
        this.sysOrderList = bodyInfo.info
      })
    },
    // 转换时间
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
    .cell-2 {
      flex: 2;
      padding-left: 3px;
    }
    .cell-3 {
      flex: 3;
      padding-left: 3px;
    }
    .cell-7 {
      flex: 7;
      padding-left: 3px;
    }
  }
}
</style>