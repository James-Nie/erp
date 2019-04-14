<!--顶部导航栏-->
<template>
	<el-aside width="190px" style="background: #FFFFFF;box-shadow: 0 1px 5px 0 rgba(0,0,0,0.10);">
	  <el-menu theme="dark" :default-active="activeIndex" router @select="handleSelect" :default-openeds="['1']" style="border:none">
	    <el-submenu index="1" v-if="$store.getters.hasPermission('goodsRead')">
	      <template slot="title"><i class="el-icon-menu"></i>货品</template>
	      <!--<el-menu-item class="el-menu-item" @click="$store.commit('setBrandManagementVisible', true)" v-if="$store.getters.hasPermission('brandManageRead')" data-title="货品">品牌管理</el-menu-item>-->
	      <!--<el-menu-item class="el-menu-item" @click="$store.commit('setGoodsClassificationVisible', true)" v-if="$store.getters.hasPermission('goodsClassifyRead')" data-title="货品">货品分类</el-menu-item>-->
	      <el-menu-item index="brandManage" v-if="$store.getters.hasPermission('brandManageRead')" data-title="货品">品牌管理</el-menu-item>
	      <el-menu-item index="category" v-if="$store.getters.hasPermission('goodsClassifyRead')" data-title="货品">货品分类</el-menu-item>
	      <el-menu-item index="fittings-management" v-if="$store.getters.hasPermission('goodsArchiveRead')" data-title="货品">货品管理</el-menu-item>
	      <el-menu-item index="stock-management" v-if="$store.getters.hasPermission('stockManageRead')" data-title="货品">原料管理</el-menu-item>
	      <el-menu-item index="suppliers-management" v-if="$store.getters.hasPermission('supplierManageRead')" data-title="货品">供应商管理</el-menu-item>
	      <el-menu-item index="qrcode" v-if="$store.getters.hasPermission('codeRead')" data-title="货品">二维码</el-menu-item>
	      <el-menu-item index="pricelist" v-if="$store.getters.hasPermission('priceListRead')" data-title="货品">价格单</el-menu-item>
	    </el-submenu>
	    <el-submenu index="2" v-if="$store.getters.hasPermission('orderManageRead')">
	      <template slot="title"><i class="el-icon-message"></i>订单</template>
	      <el-menu-item index="order-audit" v-if="$store.getters.hasPermission('orderAuditRead')" data-title="订单">订单审核</el-menu-item>
	      <el-menu-item index="order-finance" v-if="$store.getters.hasPermission('orderFinanceRead')" data-title="订单">财务审核</el-menu-item>
	      <el-menu-item index="order-management" v-if="$store.getters.hasPermission('orderManageRead')" data-title="订单">订单管理</el-menu-item>
	      <el-menu-item index="order-original" v-if="$store.getters.hasPermission('orderOriginalRead')" data-title="订单">原始订单</el-menu-item>
	      <el-menu-item index="order-history" v-if="$store.getters.hasPermission('orderHistoryRead')" data-title="订单">历史订单</el-menu-item>
	    </el-submenu>
	    <el-submenu index="3" v-if="$store.getters.hasPermission('deliverRead')">
	      <template slot="title"><i class="el-icon-message"></i>发货</template>
	      <el-menu-item index="shipping-management" v-if="$store.getters.hasPermission('deliveryManageRead')" data-title="发货">发货管理</el-menu-item>
	      <el-menu-item index="afterale-shipping" v-if="$store.getters.hasPermission('deliverRead')" data-title="发货">售后发货</el-menu-item>
	    </el-submenu>
	    <el-submenu index="4" v-if="$store.getters.hasPermission('afterSalesRead')">
	      <template slot="title"><i class="el-icon-message"></i>售后</template>
	      <el-menu-item index="aftersale-management" v-if="$store.getters.hasPermission('afterSalesRead')" data-title="售后">售后件管理</el-menu-item>
	      <el-menu-item index="unknown-things" v-if="$store.getters.hasPermission('namelessPartRead')" data-title="售后">无名件</el-menu-item>
	      <el-menu-item index="returns-management" v-if="$store.getters.hasPermission('returnGoodsManageRead')" data-title="售后">退货管理</el-menu-item>
	    </el-submenu>
	    <el-submenu index="5" v-if="$store.getters.hasPermission('purchaseRead')">
	      <template slot="title"><i class="el-icon-message"></i>采购</template>
	      <el-menu-item index="procurement-management" v-if="$store.getters.hasPermission('purchaseListManageRead')" data-title="采购">采购单管理</el-menu-item>
	      <el-menu-item index="procurement-audit" v-if="$store.getters.hasPermission('purchaseListAuditRead')" data-title="采购">采购单审核</el-menu-item>
	      <el-menu-item index="suppliers-goods" v-if="$store.getters.hasPermission('supplierGoodsRead')" data-title="采购">供应商货品</el-menu-item>
	    </el-submenu>
	    <el-submenu index="6" v-if="$store.getters.hasPermission('stockRead')">
	      <template slot="title"><i class="el-icon-message"></i>仓库</template>
	      <li class="el-menu-item" @click="$store.commit('setWarehouseManagementVisible', true)" v-if="$store.getters.hasPermission('warehouseManageRead')" data-title="仓库">仓库管理</li>
	      <el-menu-item index="stock-management" v-if="$store.getters.hasPermission('stockManageRead')" data-title="仓库">库存管理</el-menu-item>
	      <el-menu-item index="product-order-management" v-if="$store.getters.hasPermission('productOrderManageRead')" data-title="仓库">生产单管理</el-menu-item>
	    </el-submenu>
	    <el-submenu index="7" v-if="$store.getters.hasPermission('crmRead')">
	      <template slot="title"><i class="el-icon-message"></i>CRM</template>
	      <el-menu-item index="customer-files" v-if="$store.getters.hasPermission('customerFileRead')" data-title="CRM">客户档案</el-menu-item>
	      <el-menu-item index="member-management" v-if="$store.getters.hasPermission('memberManageRead')" data-title="CRM">会员管理</el-menu-item>
	    </el-submenu>
	    <el-submenu index="8" v-if="$store.getters.hasPermission('statisticsRead')">
	      <template slot="title"><i class="el-icon-message"></i>统计</template>
	      <el-menu-item index="maintenance-statistics" v-if="$store.getters.hasPermission('repairGatheringRead')" data-title="统计">维修统计</el-menu-item>
	      <el-menu-item index="procurement-statistics" v-if="$store.getters.hasPermission('purchaseStatisticsRead')" data-title="统计">采购统计</el-menu-item>
	      <el-menu-item index="order-statistics" v-if="$store.getters.hasPermission('orderStatisticsRead')" data-title="统计">订单统计</el-menu-item>
	      <el-menu-item index="stock-statistics" v-if="$store.getters.hasPermission('stockStatisticsRead')" data-title="统计">库存统计</el-menu-item>
	      <el-menu-item index="performance-statistics" v-if="$store.getters.hasPermission('achievementStatisticsRead')" data-title="统计">业绩统计</el-menu-item>
	      <el-menu-item index="goods-sold-statistics" v-if="$store.getters.hasPermission('saleStatisticsRead')" data-title="统计">货品售卖统计</el-menu-item>
	      <el-menu-item index="workshop-statistics" v-if="$store.getters.hasPermission('workshopStatisticsRead')" data-title="统计">车间统计</el-menu-item>
	      <el-menu-item index="finance-statistics" v-if="$store.getters.hasPermission('financialStatisticsRead')" data-title="统计">财务统计</el-menu-item>
	      <el-menu-item index="after-statistics" v-if="$store.getters.hasPermission('afterSalesStatisticsRead')" data-title="统计">售后统计</el-menu-item>
	    </el-submenu>
	    <el-submenu index="9" v-if="$store.getters.hasPermission('financeRead')">
	      <template slot="title"><i class="el-icon-message"></i>财务</template>
	      <el-menu-item index="after-receivable" v-if="$store.getters.hasPermission('receivableManageRead')" data-title="财务">售后应收管理</el-menu-item>
	      <el-menu-item index="workshop-audit" v-if="$store.getters.hasPermission('financeRead')" data-title="财务">车间工作量审核</el-menu-item>
	      <el-menu-item index="financial-audit" v-if="$store.getters.hasPermission('financialAuditRead')" data-title="财务">财务审核</el-menu-item>
	      <el-menu-item index="receivables-management" v-if="$store.getters.hasPermission('financeRead')" data-title="财务">订单应收管理</el-menu-item>
	      <el-menu-item index="copewith-management" v-if="$store.getters.hasPermission('payableManageRead')" data-title="财务">应付管理</el-menu-item>
	      <el-menu-item index="invoice-management" v-if="$store.getters.hasPermission('invoiceManageRead')" data-title="财务">发票管理</el-menu-item>
	    </el-submenu>
	    <el-submenu index="10" v-if="$store.getters.hasPermission('settingRead')">
	      <template slot="title"><i class="el-icon-setting"></i>设置</template>
	      <el-menu-item index="device-account" v-if="$store.getters.hasPermission('settingRead')" data-title="设置">外接设备账号设置</el-menu-item>
	      <li class="el-menu-item" @click="$store.commit('setAccountVisible', true)" v-if="$store.getters.hasPermission('accountSettingRead')" data-title="设置">账号设置</li>
	      <el-menu-item index="employees-management" v-if="$store.getters.hasPermission('employeeManageRead')" data-title="设置">员工管理</el-menu-item>
	      <li class="el-menu-item" @click="$store.commit('setStoreVisible', true)" v-if="$store.getters.hasPermission('storeManageRead')">店铺设置</li>
	      <el-menu-item index="strategy" v-if="$store.getters.hasPermission('strategySettingRead')">策略设置</el-menu-item>
	      <li class="el-menu-item" @click="$store.commit('setLogisticsVisible', true)" v-if="$store.getters.hasPermission('logisticsSettingRead')" data-title="设置">物流设置</li>
	    </el-submenu>
	  </el-menu>
  </el-aside>
</template>
<script>
  export default {
    name: 'trade-menu',
    data() {
      return {
        activeIndex: 'fittings-management'
      }
    },
    methods: {
      // 导航改变处理事件
      handleSelect(key, keyPath, item) {
      	let tabItem1 = {
          name: item.$el.getAttribute('data-title'),
          level: 2
        }
        this.$store.commit('updateMenuLevel', tabItem1)
        let tabItem2 = {
          name: item.$el.textContent,
          level: 3
        }
        this.$store.commit('updateMenuLevel', tabItem2)
      }
    }
  }
</script>

<style lang="scss">
.el-menu--horizontal .el-submenu {
  .el-submenu__title.login-information {
    border-bottom: none;
    margin-right: 70px;
    .item {
      margin-right: 100px;
    }
  }
  &:hover .el-submenu__title.login-information {
    border-bottom: none; 
  }
}
</style>