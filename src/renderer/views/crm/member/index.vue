<!--会员管理模块-->
<template>
  <div>
    <div class="mgb15">
      <el-button type="primary" @click="_loadMainList"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
      <el-button type="primary" @click="handlePopupForm('add')" :disabled="!permission"><i class="iconfont  "></i>新建</el-button>
      <el-button type="primary" @click="handlePopupForm('edit')" :disabled="!permission || multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>修改</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="memberList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" @current-change="selected" highlight-current-row max-height="523">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="onlineName" label="网名" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性別" align="center">
        </el-table-column>
        <el-table-column prop="country" label="国家" align="center">
        </el-table-column>
        <el-table-column prop="province" label="省份" align="center">
        </el-table-column>
        <el-table-column prop="city" label="城市" align="center">
        </el-table-column>
        <el-table-column prop="area" label="区县" align="center">
        </el-table-column>
        <el-table-column prop="address" label="住址" align="center">
        </el-table-column>
        <el-table-column prop="postcode" label="邮编" align="center">
        </el-table-column>
        <el-table-column prop="telephone" label="固话" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="手机" align="center" width="120">
        </el-table-column>
      </el-table>
    </div>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-tabs type="border-card" class="auxiliary-table">
      <el-tab-pane label="日志">
        <el-table :data="logsData" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="200"></el-table-column>
          <el-table-column prop="operator" label="操作员"></el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
          <el-table-column prop="time" label="时间"></el-table-column>
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
    </el-tabs>
    <el-dialog :title="formTitle" custom-class="member-dialog" :visible.sync="memberVisible" :before-close="handleClose">
      <member-form :updatedForm="form" :formTitle="formTitle"></member-form>
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
import MemberForm from './form'
import EditShortcuts from './edit-shortcuts'
import StickyNotes from './sticky-notes'
export default {
  name: 'member-management',
  components: {
    [MemberForm.name]: MemberForm,
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
      // 是否允许点击便签添加
      addNode: true,
      userName: '',
      formTitle: '新建会员',
      loading: false,
      pagination: {
        count: 0,
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        page: 0
      },
      form: {
        member_uuid: '',
        name: '',
        online_name: '',
        sex: '',
        phone: '',
        telephone: '',
        country: '',
        cityArray: {
          province: '',
          city: '',
          area: ''
        },
        province: '',
        city: '',
        area: '',
        address: '',
        postcode: '',
        credit_limit: '',
        remark: ''
      },
      // 会员列表
      memberList: [],
      // 选中行信息
      multipleSelection: [],
      // 选中个数
      selectNumber: 0,
      // 新建编辑会员
      memberVisible: false,
      // 日志
      logsData: []
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/MemberExcelport')
    },
    // 关闭页面，清空数据
    handleClose() {
      this.form = {}
      this.memberVisible = false
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.selectNumber = this.multipleSelection.length
    },
    // 点击一行
    selected(current) {
      this.getLogList(current.memberUuid)
      // 便签
      this.getNode(current.memberUuid)
      this.addNode = false
    },
    // 日志
    getLogList(memberUuid) {
      this.$http.post('order/loglist', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'order_number': memberUuid
        }
      }).then(res => {
        this.logsData = res.data.body.LogOrderList
      }).catch(res => {
        console.log(res)
      })
    },
    // 便签
    getNode(memberUuid) {
      window.localStorage.setItem('order_number', memberUuid)
      this.$http.post('note/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'order_number': memberUuid
        }
      }).then(res => {
        this.noteList = []
        this.noteList = res.data.body.NoteList
      }).catch(res => {
        console.log(res)
      })
    },
    // 添加便签页
    showStickyNotesVisible () {
      this.stickyNotesVisible = true
      window.sessionStorage.setItem('createNodeParent', 'MemberManagement')
    },
    // 添加或编辑页面
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建会员'
        this.form = Object.assign({}, {})
      } else if (formName === 'edit') {
        if (this.multipleSelection.length === 1) {
          let updatedForm = this.multipleSelection[0]
          this.form = Object.assign({}, {
            member_uuid: updatedForm.memberUuid,
            user_name: this.$store.getters.getAccount.name,
            name: updatedForm.name,
            online_name: updatedForm.onlineName,
            sex: updatedForm.sex,
            phone: updatedForm.phone,
            telephone: updatedForm.telephone,
            country: updatedForm.country,
            cityArray: [updatedForm.province, updatedForm.city, updatedForm.area],
            province: updatedForm.province,
            city: updatedForm.city,
            area: updatedForm.area,
            address: updatedForm.address,
            postcode: updatedForm.postcode,
            credit_limit: updatedForm.creditLimit,
            remark: updatedForm.remark
          })
        }
        this.formTitle = '编辑会员'
      }
      this.memberVisible = true
    },
    // 获取客户列表
    _loadMainList() {
      this.$tool.loadList(this, 'member/selete', bodyInfo => {
        this.memberList = bodyInfo.MemberList
      })
    }
  },
  mounted() {
    this._loadMainList()
    this.userName = JSON.parse(window.localStorage.getItem('loginUserBaseInfo')).user_nam
  },
  computed: {
    permission() {
      return this.$store.getters.hasPermission('memberManageWrite')
    }
  }
}

</script>
<style>
.member-dialog {
  width: 1100px;
}

</style>
