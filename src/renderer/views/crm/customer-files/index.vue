<!--客户档案模块-->
<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" @click="_loadMainList"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
      <el-button type="primary" @click="handlePopupForm('add')" :disabled="!permission"><i class="iconfont  "></i>新建</el-button>
      <el-button type="primary" @click="handlePopupForm('edit')":disabled="!permission || multipleSelection.length !== 1" v-if="permission"><i class="iconfont icon-icon07"></i>修改</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="customerList" ref="multipleTable" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" @current-change="selected" highlight-current-row max-height="523" >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="netName" label="网名" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性別" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="wangwang" label="旺旺" align="center">
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
        </el-table-column>
        <el-table-column prop="createDatetime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="updateDatetime" label="修改时间" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-tabs type="border-card" class="auxiliary-table">
      <el-tab-pane label="日志">
        <el-table :data="logsData" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="200">
          </el-table-column>
          <el-table-column prop="operator" label="操作员">
          </el-table-column>
          <el-table-column prop="content" label="内容">
          </el-table-column>
          <el-table-column prop="createDatetime" label="创建时间" :formatter="$formatter.formatTime('createDatetime')">
          </el-table-column>
          <el-table-column prop="updateDatetime" label="修改时间" :formatter="$formatter.formatTime('updateDatetime')">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="便签">
        <el-button class="mgb15" type="primary" @click="showStickyNotesVisible" :disabled="addNode === true"><i class="iconfont  "></i>添加</el-button>
        <el-table :data="noteList" stripe style="width: 100%" max-height="120">
          <el-table-column type="index" label="序号" width="200">
          </el-table-column>
          <el-table-column prop="operator" label="操作员">
          </el-table-column>
          <el-table-column prop="content" label="内容">
          </el-table-column>
          <el-table-column label="时间" :formatter="$formatter.formatTime('createDatetime')">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="收货地址">
        <el-table :data="customerPlaces" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="200">
          </el-table-column>
          <el-table-column prop="realName" label="收件人姓名">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
          <el-table-column prop="country" label="国家">
          </el-table-column>
          <el-table-column prop="province" label="省">
          </el-table-column>
          <el-table-column prop="city" label="市">
          </el-table-column>
          <el-table-column prop="county" label="县">
          </el-table-column>
          <el-table-column prop="phone" label="手机">
          </el-table-column>
          <el-table-column prop="postCode" label="邮编">
          </el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
          <el-table-column prop="createDatetime" label="创建时间" :formatter="$formatter.formatTime('createDatetime')">
          </el-table-column>
          <el-table-column prop="updateDatetime" label="修改时间" :formatter="$formatter.formatTime('updateDatetime')">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="formTitle" custom-class="customer-dialog" :visible.sync="customerVisible" :before-close="handleClose">
      <customer-form :updatedForm="form" :formTitle="formTitle"></customer-form>
    </el-dialog>
    <el-dialog title="订单便签" size="tiny" :visible.sync="stickyNotesVisible">
      <sticky-notes></sticky-notes>
    </el-dialog>
    <el-dialog title="编辑快捷键" :visible.sync="shortcutEditingVisivble" @close="handleClose('setShortcutEditingVisivble')">
      <edit-shortcuts></edit-shortcuts>
    </el-dialog>
  </div>
</template>
<script>
import CustomerForm from './form'
import EditShortcuts from './edit-shortcuts'
import StickyNotes from './sticky-notes'
export default {
  name: 'CustomerFiles',
  components: {
    [CustomerForm.name]: CustomerForm,
    [EditShortcuts.name]: EditShortcuts,
    [StickyNotes.name]: StickyNotes
  },
  data() {
    return {
      // 便签
      stickyNotesVisible: false,
      // 快捷键
      shortcutEditingVisivble: false,
      // 便签列表
      noteList: [],
      customerPlaces: [],
      // 是否允许点击便签添加
      addNode: true,
      // 一对象形式存贮选中行信息
      currentRow: {},
      userName: '',
      formTitle: '新建客户',
      // 选中行
      multipleSelection: [],
      // 顾客列表
      customerList: [],
      loading: false,
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      // 传递到下一页的信息
      form: {
        user_name: this.$store.getters.getAccount.name,
        customerUuid: '',
        name: '',
        net_name: '',
        sex: '',
        phone: '',
        telephone: '',
        cityArray: {
          province: '',
          city: '',
          county: ''
        },
        country: '',
        province: '',
        city: '',
        county: '',
        address: '',
        type: '',
        quota: '',
        email: '',
        postcode: '',
        wangwang: '',
        qq: '',
        remark: '',
        disable: 1
      },
      // 日志
      logsData: [],
      // 新建或编辑客户页
      customerVisible: false
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/CustomerFileExcelport')
    },
    // 关闭并清空页面
    handleClose(done) {
      done()
      this.form = {
        user_name: this.$store.getters.getAccount.name,
        name: '',
        netName: '',
        sex: '',
        phone: '',
        telephone: '',
        country: '',
        province: '',
        city: '',
        county: '',
        address: '',
        type: '',
        quota: '',
        email: '',
        postcode: '',
        wangwang: '',
        qq: '',
        remark: '',
        disable: 1
      }
    },
    // 点击一行
    selected(current) {
      this.current = current
      this.currentRow = current
      // 日志
      this.getLogList(current.id)
      // 便签
      this.getNode(current.id)
      // 收货地址
      this.getCustomerPlace(current.id)
      this.addNode = false
    },
    // 获取日志
    getLogList(customerUuid) {
      this.$http.post('log/list', {
        'head': this.$store.getters.getAccount,
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'bizType': 7,
          'outOrderNo': customerUuid
        }
      }).then(res => {
        if (res.data.body.info.length !== 0) {
          this.logsData = res.data.body.info
        }
      }).catch(res => {
        console.log(res)
      })
    },
    // 获取便签
    getNode(customerUuid) {
      window.localStorage.setItem('order_number', customerUuid)
      this.$http.post('note/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'order_number': customerUuid
        }
      }).then(res => {
        this.noteList = []
        this.noteList = res.data.body.NoteList
      }).catch(res => {
        console.log(res)
      })
    },
    // 获取收货地址
    getCustomerPlace(customerUuid) {
      this.$http.post('customer/place', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'customer_uuid': customerUuid
        }
      }).then(res => {
        if (res.data.body.info.length !== 0) {
          this.customerPlaces = res.data.body.info
        }
      }).catch(res => {
        console.log(res)
      })
    },
    // 添加便签页
    showStickyNotesVisible () {
      this.stickyNotesVisible = true
      console.log(this.currentRow.customerUuid)
      window.sessionStorage.setItem('createNodeParent', 'CustomerFiles')
      window.localStorage.setItem('order_number', this.currentRow.customerUuid)
    },
    // 添加或编辑页面
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建客户'
        this.form = Object.assign({}, {})
      } else if (formName === 'edit') {
        if (this.multipleSelection.length === 1) {
          let updatedForm = this.multipleSelection[0]
          this.form = Object.assign({}, {
            user_name: this.$store.getters.getAccount.name,
            name: updatedForm.realName,
            customer_uuid: updatedForm.customerUuid,
            net_name: updatedForm.netName,
            sex: updatedForm.sex,
            phone: updatedForm.phone,
            telephone: updatedForm.telephone,
            country: updatedForm.country,
            cityArray: [updatedForm.province, updatedForm.city, updatedForm.county],
            province: updatedForm.province,
            city: updatedForm.city,
            county: updatedForm.county,
            address: updatedForm.address,
            type: updatedForm.type,
            quota: updatedForm.quota,
            email: updatedForm.email,
            postcode: updatedForm.postcode,
            wangwang: updatedForm.wangwang,
            qq: updatedForm.qq,
            remark: updatedForm.remark,
            disable: updatedForm.disable
          })
        }
        this.formTitle = '编辑客户'
      }
      this.customerVisible = true
    },
    // 获取客户列表
    _loadMainList() {
      this.$tool.loadList(this, 'customer/list', bodyInfo => {
        this.customerList = bodyInfo.info
      })
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 存储选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  mounted() {
    this._loadMainList()
    this.userName = JSON.parse(window.localStorage.getItem('loginUserBaseInfo')).user_name
  },
  computed: {
    // 获取权限信息
    permission() {
      return this.$store.getters.hasPermission('customerFileWrite')
    }
  }
}

</script>
<style>
.customer-dialog {
  width: 1100px;
}

</style>
