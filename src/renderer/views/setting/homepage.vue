<template>
  <div class="homepage">
  	<el-row type="flex" class="card-sections" justify="space-between" :gutter="20">
      <el-col :span="7">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日订单</span>
          </div>
          <div class="text item">
            	已下单<span class="badge badge-pill badge-secondary fr">{{orderInformation.orderCreateCount}}</span>
          </div>
          <div class="text item">
            	已审核<span class="badge badge-pill badge-secondary fr">{{orderInformation.orderAudited}}</span>
          </div>
          <div class="text item">
            	已发货<span class="badge badge-pill badge-secondary fr">{{orderInformation.orderDelivered}}</span>
          </div>
          <div class="text item">
            	已驳回<span class="badge badge-pill badge-secondary fr">{{orderInformation.orderRebut}}</span>
          </div>
          <div class="text item">
            	被驳回<span class="badge badge-pill badge-secondary fr">{{orderInformation.purchaseRebut}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日数据</span>
          </div>
          <div class="text item">
            	出库<span class="badge badge-pill badge-secondary fr">{{todayData.chukushuliang}}</span>
          </div>
          <div class="text item">
            	入库<span class="badge badge-pill badge-secondary fr">{{todayData.rukushulilang}}</span>
          </div>
          <div class="text item">
           	 发货<span class="badge badge-pill badge-secondary fr">{{todayData.orderDelivered}}</span>
          </div>
          <div class="text item">
            	采购<span class="badge badge-pill badge-secondary fr">{{todayData.purchasecount}}</span>
          </div>
          <div class="text item">
            	生产<span class="badge badge-pill badge-secondary fr">{{todayData.productionGoods}}</span>
          </div>    
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
          	<el-row>
						  <el-col :span="4">
						  	<div style="height: 30px;line-height: 30px;">销售数据</div>
						  </el-col>
						  <el-col :span="20">
						  	<div>
								  <el-radio-group v-model="chooseDay" @change="changeDays">
			              <el-radio-button :label="1">今天</el-radio-button>
			              <el-radio-button :label="3">近3天</el-radio-button>
			              <el-radio-button :label="7">近7天</el-radio-button>
			            </el-radio-group>
			            <el-dropdown @command="handleCommand">
			              <el-button>
			                {{filter.store}}<i class="el-icon-caret-bottom el-icon--right"></i>
			              </el-button>
			              <el-dropdown-menu slot="dropdown">
			                <el-dropdown-item command="全部商店">全部商店</el-dropdown-item>
			                <el-dropdown-item v-for="item in commands" :key="item.id" :command="item.storeName">{{item.storeName}}</el-dropdown-item>
			              </el-dropdown-menu>
			            </el-dropdown>
						  	</div>
						  </el-col>
						</el-row>
          </div>
          <canvas ref="myChart"></canvas>
        </el-card>
      </el-col>
    </el-row>
    <div class="panel-heading">系统通知</div>
    <div class="notification-wrapper">
      <el-table :data="notificationList" stripe style="width: 100%" max-height="243">
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="source" label="消息来源" align="center" width="200">
        </el-table-column>
        <el-table-column prop="content" label="信息内容" align="center" width="600">
        </el-table-column>
        <el-table-column prop="handlePeople" label="处理人" align="center">
        </el-table-column>
        <el-table-column label="类型" :formatter="$formatter.formatType" align="center">
        </el-table-column> 
        <el-table-column label="处理时间" :formatter="$formatter.formatTime('createDatetime')" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="view(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import Chart from 'chart'
export default {
  name: 'homepage',
  data() {
    return {
      chooseDay: 1,
      notificationList: [],
      filter: {
        store: '全部商店'
      },
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      },
      orderInformation: {
        orderCreateCount: '',
        orderAudited: '',
        orderDelivered: '',
        orderRebut: '',
        purchaseRebut: ''
      },
      todayData: {
        chukushuliang: '',
        rukushulilang: '',
        orderDelivered: '',
        purchasecount: '',
        productionGoods: ''
      },
      commands: [],
      myChart: null
    }
  },
  methods: {
    // 查看
    view(row) {
      switch (row.link) {
        case 'order/list':
          this.$store.commit('pushItem', {
            path: '/order-management',
            text: '订单管理'
          })
          this.$router.push({path: '/order-management'})
          break
        case 'returnGoods/list':
          this.$store.commit('pushItem', {
            path: '/aftersale-management',
            text: '售后件管理'
          })
          this.$router.push({path: '/aftersale-management'})
          break
      }
    },
    // 查询订单信息
    queryOrderInformation() {
      this.$tool.common(this, 'home/orderInformation', {
        startTime: this.$moment().format('YYYY-MM-DD 00:00:00'),
        endTime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, bodyInfo => {
        this.orderInformation.orderCreateCount = bodyInfo.orderCreateCount + '个'
        this.orderInformation.orderAudited = bodyInfo.orderAudited + '个'
        this.orderInformation.orderDelivered = bodyInfo.orderDelivered + '个'
        this.orderInformation.orderRebut = bodyInfo.orderRebut + '个'
        this.orderInformation.purchaseRebut = bodyInfo.purchaseRebut + '个'
      })
    },
    // 查询今日数据
    queryTodayData() {
      this.$tool.common(this, 'home/todayData', {
        startTime: this.$moment().format('YYYY-MM-DD 00:00:00'),
        endTime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, bodyInfo => {
        this.todayData.chukushuliang = bodyInfo.chukushuliang + '个'
        this.todayData.rukushulilang = bodyInfo.rukushulilang + '个'
        this.todayData.orderDelivered = bodyInfo.orderDelivered + '个'
        this.todayData.purchasecount = bodyInfo.purchasecount + '个'
        this.todayData.productionGoods = bodyInfo.productionGoods + '个'
      })
    },
    // 选择天数
    changeDays() {
      this.querySalesData()
    },
    // 绘制柱状图
    draw() {
      const ctx = this.$refs['myChart']
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: '下单量',
            backgroundColor: 'rgba(72,134,255,0.5)',
            borderColor: 'rgba(72,134,255,1)',
            data: []
          }, {
            label: '发货量',
            backgroundColor: 'rgba(53, 179, 141, 0.5)',
            borderColor: 'rgba(53, 179, 141, 1)',
            data: []
          }]
        },
        options: {scaleOverlay: false}
      })
      this.myChart = myChart
    },
    // 分页查询
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.queryNotificationlist()
    },
    // 通知消息列表
    queryNotificationlist() {
      this.$tool.loadList(this, 'home/notificationlist', bodyInfo => {
        this.notificationList = bodyInfo.NotificationList
      })
    },
    queryStore() {
      this.$tool.loadOptions(this, 'store/list', bodyInfo => {
        this.commands = bodyInfo.apiResult
      })
    },
    // 选择商店
    handleCommand(command) {
      this.filter.store = command
      this.querySalesData()
    },
    // 销售数据分析
    querySalesData() {
      let days = this.chooseDay
      let startTime = this.$moment().format('YYYY-MM-DD 00:00:00') // 当天凌晨, 时间格式
      let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss') // 当前的时间戳
      let intervalMillisecond = 24 * 60 * 60 * 1000 // 一天的间隔毫秒
      let startTimeStamp = +(new Date(startTime)) - intervalMillisecond * (days - 1)
      this.$tool.common(this, 'home/salesData', {
        startTime: this.$moment(new Date(startTimeStamp)).format('YYYY-MM-DD 00:00:00'),
        endTime: endTime,
        store: this.filter.store === '全部商店' ? '' : this.filter.store
      }, bodyInfo => {
        let labels = [] // 日期
        let orderAmount = bodyInfo.xiadanshuju // 下单量
        let salesAmount = bodyInfo.fahuoshuju // 发货量
        let orderNumbers = []
        let salesNumbers = []
        for (let i = 0, timeStamp = startTimeStamp; i < days; i++, timeStamp += intervalMillisecond) {
          let endTimeStamp = (timeStamp + intervalMillisecond) > Date.now() ? Date.now() : (timeStamp + intervalMillisecond)
          let orederNum = 0
          let salesNum = 0
          // 遍历下单量, 把每天的订单赛选出来
          for (let j = 0; j < orderAmount.length; j++) {
            if (orderAmount[j].orderDatetime >= timeStamp && orderAmount[j].orderDatetime <= endTimeStamp) {
              orederNum++
            }
          }
          for (let h = 0; h < salesAmount.length; h++) {
            if (salesAmount[h].sendDatetime >= timeStamp && salesAmount[h].sendDatetime <= endTimeStamp) {
              salesNum++
            }
          }
          orderNumbers.push(orederNum)
          salesNumbers.push(salesNum)
          let time = new Date(timeStamp)
          let month = time.getMonth() + 1
          let date = time.getDate()
          labels.push(month + '/' + date)
        }
        this.myChart.data.labels = labels
        this.myChart.data.datasets[0].data = orderNumbers
        this.myChart.data.datasets[1].data = salesNumbers
        this.myChart.update()
      })
    }
  },
  mounted() {
    [this.draw, this.queryNotificationlist, this.queryTodayData, this.queryOrderInformation, this.queryStore, this.querySalesData].forEach(f => f())
  }
}

</script>
<style scoped>
#myChart {
  width: 100%;
  height: 480px;
}

.handle-area {
  margin: 5px auto;
  flex-wrap: nowrap;
  justify-content: center;
}

.card-sections {
  margin-top: 15px;
}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.notification-wrapper {
  height: 243px;
}
</style>
