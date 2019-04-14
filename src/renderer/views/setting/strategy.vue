<template>
  <div class="strategy">
    <el-form ref="form" inline :model="form" label-position="left">
      <el-form-item label="选择派单方式" label-width="100px">
        <el-radio-group v-model="form.dispatch_type">
          <el-radio :label="1">自动派单</el-radio>
          <el-radio :label="2">手动派单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="派单时段设置" label-width="100px">
        <el-col :span="11">
          <el-form-item prop="dispatch_firstTime">
            <el-time-select placeholder="起始时间" v-model="form.dispatch_firstTime" :picker-options="start_time_options">
            </el-time-select>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="dispatch_endTime">
            <el-time-select placeholder="结束时间" v-model="form.dispatch_endTime" :picker-options="end_time_options">
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <div v-if="form.dispatch_type === 1">
        <el-form-item>
          <el-radio-group v-model="form.dispatch_model">
            <el-radio :label="1">按品牌派单</el-radio>
            <el-radio :label="2">按数量派单</el-radio>
            <el-radio :label="3">按时间派单</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.dispatch_model === 1">
          <el-table :data="form.workShop_brand_list" v-loading="loading" stripe style="width: 100%">
            <el-table-column prop="date" label="组别" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.workshopUuid" :true-label="scope.row.workshop_uuid" :false-label="''">{{scope.row.workshopName}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="品牌" align="center">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.brand_uuids">
                  <el-checkbox v-for="item in brand_options" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="form.dispatch_model === 2">
          <el-input class="w192" v-model="form.amount" placeholder="单次接单数量上限"></el-input>
          <span>（当前组每次接单达到最大接单数量上限后，自动切换到下一组接单中，如此循环）</span>
        </div>
        <div v-if="form.dispatch_model === 3">
          <el-input class="w192" v-model="form.time" placeholder="单次接单时间上限"></el-input>
          <span>（接单时间按小时计算，当前组截单时间使用完后，自动切换到下一组接单，如此循环）</span>
        </div>
      </div>
    </el-form>
    <div class="strategy-footer">
      <el-button class="circle-btn" type="primary" @click="saveSetting">保存设置</el-button>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins'
export default {
  name: 'strategy',
  data() {
    return {
      loading: false,
      brand_options: [],
      start_time_options: {
        start: '00:15',
        step: '00:15',
        end: '23:45'
      },
      form: {
        time: '',
        amount: '',
        dispatch_type: 1,
        dispatch_model: 1,
        workShop_brand_list: [],
        dispatch_firstTime: '',
        dispatch_endTime: ''
      },
      end_time_options: {
        start: '00:15',
        step: '00:15',
        end: '23:45'
      }
    }
  },
  mixins: [mixin],
  watch: {
    'form.dispatch_model': function() {
      this.queryWorkshop()
      this.queryBrands()
    }
  },
  methods: {
    // 保存设置
    saveSetting() {
      this.$tool.common(this, 'strategy/create', {
        'dispatch_type': this.form.dispatch_type,
        'dispatch_firstTime': this.form.dispatch_firstTime,
        'dispatch_endTime': this.form.dispatch_endTime,
        'dispatch_model': this.form.dispatch_model,
        'workShop_brand_list': this.form.workShop_brand_list,
        'amount': this.form.amount,
        'time': this.form.time
      })
    },
    // 查询车间
    queryWorkshop() {
      this.$http.post('workshop/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 10,
	      'workshop_name': ''
        }
      }).then(res => {
        this.form.workShop_brand_list = res.data.apiResult.map(item => {
          return {
            'brand_uuids': [],
            'workshop_uuid': item.workshopUuid,
            'workshopUuid': '',
            'workshopName': item.workshopName
          }
        })
      })
    },
    // 查询策略设置
    queryStrategy() {
      this.$tool.common(this, 'strategy/find', {}, bodyInfo => {
        this.form.dispatch_firstTime = this.$moment(new Date(bodyInfo.dispatch_firstTime)).format('HH:mm')
        this.form.dispatch_endTime = this.$moment(new Date(bodyInfo.dispatch_endTime)).format('HH:mm')
        setTimeout(() => {
          this.form.workShop_brand_list = bodyInfo.workShop_brand_list && bodyInfo.workShop_brand_list.map(item => {
            return {
              workshop_uuid: item.workshopUuid,
              workshopUuid: item.workshopUuid,
              workshopName: item.workshopName,
              brand_uuids: item.brand_uuids
            }
          }, 500)
          this.form.amount = bodyInfo.amount
          this.form.time = bodyInfo.time
          this.form.dispatch_model = bodyInfo.dispatch_model
          this.form.dispatch_type = bodyInfo.dispatch_type
        })
      })
    }
  },
  mounted() {
    [this.queryWorkshop, this.queryBrands, this.queryStrategy].forEach(f => f())
  }
}

</script>
<style lang="scss">
.strategy {
  .strategy-footer {
    text-align: center;
    margin-top: 60px;
  }
}

</style>
