<template>
  <div class="unknown-things">
    <div class="mgb15">
      <!-- 重新获取无名件列表 -->
      <el-button type="primary" @click="getList"><i class="iconfont icon-shuaxin1"></i>刷新</el-button>
      <!-- 有权限时可新建无名件 -->
      <el-button type="primary" @click="handlePopupForm('add')" :disabled="!permission"><i class="iconfont  "></i>新建</el-button>
      <!-- 有权限时，选择数量为1时，可修改无名件 -->
      <el-button type="primary" @click="handlePopupForm('edit')" :disabled="!permission || selectNumber !== 1"><i class="iconfont icon-icon07"></i>修改</el-button>
      <!-- 有权限时，选择数量为1，选择的状态为待处理时可触发已处理，将状态改为已处理 -->
      <el-button type="primary" @click="passed" :disabled="!permission || multipleSelection.length !== 1 || multipleSelection[0].status === '1'"><i class="iconfont icon-artboard38"></i>已处理</el-button>
      <el-button type="primary" icon="upload2" @click="exportExcel">导出</el-button>
    </div>
    <!-- 无名件列表 -->
    <div class="table-wrapper">
      <el-table :data="tableData" stripe style="width: 100%" @row-click="selectInfo" @selection-change="handleSelectionChange" highlight-current-row max-height="523" id="printNameless">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70">
        </el-table-column>
        <el-table-column prop="namelessNumber" label="编号" width="180">
        </el-table-column>
        <el-table-column prop="typeNumber" label="产品种类">
        </el-table-column>
        <el-table-column prop="goodsNumber" label="产品数量">
        </el-table-column>
        <el-table-column prop="waybillNumber" label="运单号" width="150">
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库">
        </el-table-column>
        <el-table-column prop="sign" label="库位">
        </el-table-column>
        <el-table-column prop="sender" label="寄件人">
        </el-table-column>
        <el-table-column prop="status" label="状态" :formatter="regionFormatter">
        </el-table-column>
        <el-table-column label="收件时间" :formatter="$formatter.formatTime('createDatetime')" width="180">
        </el-table-column>
      </el-table>
    </div>
    <!-- 无名件分页 -->
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <!-- 辅助栏 -->
    <el-tabs type="border-card">
    <!-- 日志 -->
      <el-tab-pane label="日志">
        <el-table :data="logsData" stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="200">
          </el-table-column>
          <el-table-column prop="operator" label="操作员">
          </el-table-column>
          <el-table-column prop="content" label="内容">
          </el-table-column>
          <el-table-column prop="create_datetime" label="时间">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 便签 -->
      <el-tab-pane label="便签">
        <el-button class="mgb15" type="primary" @click="showStickyNotesVisible" :disabled="addNode === true"><i class="iconfont  "></i>添加</el-button>
        <el-table :data="nodeList" stripe style="width: 100%">
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
      <!-- 货品列表 -->
      <el-tab-pane label="货品列表">
        <el-table :data="namelessGoodsLsit" stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="70">
          </el-table-column>
          <el-table-column prop="brand" label="品牌">
          </el-table-column>
          <el-table-column prop="model" label="规格">
          </el-table-column>
          <el-table-column prop="width" label="宽度">
          </el-table-column>
          <el-table-column prop="length" label="长度">
          </el-table-column>
          <el-table-column prop="category" label="分类">
          </el-table-column>
          <el-table-column prop="amount" label="数量">
          </el-table-column>
          <el-table-column prop="allWeight" label="总重">
          </el-table-column>
          <el-table-column prop="retailPrice" label="零售价">
          </el-table-column>
          <el-table-column prop='allPrice' label="总价">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 编辑或新建无名件时的组件 -->
    <el-dialog :title="formTitle" :before-close="handleCloseForm" :visible.sync="addFormVisible" size="full">
      <unknownthings-form :updatedForm="form"></unknownthings-form>
    </el-dialog>
    <!-- 便签 -->
    <el-dialog title="订单便签" size="tiny" :visible.sync="stickyNotesVisible">
      <sticky-notes></sticky-notes>
    </el-dialog>
    <!-- 快捷键 -->
    <el-dialog title="编辑快捷键" :visible.sync="shortcutEditingVisivble" @close="handleClose('setShortcutEditingVisivble')">
      <edit-shortcuts></edit-shortcuts>
    </el-dialog>
  </div>
</template>
<script>
import UnknownThingsForm from './form'
import EditShortcuts from '@/views/crm/customer-files/edit-shortcuts'
import StickyNotes from '@/views/crm/customer-files/sticky-notes'
export default {
  name: 'UnknownThings',
  components: {
    [UnknownThingsForm.name]: UnknownThingsForm,
    [EditShortcuts.name]: EditShortcuts,
    [StickyNotes.name]: StickyNotes
  },
  data() {
    return {
      // 控制新建或者编辑页面的显示
      addFormVisible: false,
      // 便签页的显示
      stickyNotesVisible: false,
      // 快捷键的显示
      shortcutEditingVisivble: false,
      // 新建或者编辑页的头部信息显示
      formTitle: '新建售后单',
      // 所选择的无名件
      multipleSelection: [],
      // 便签
      nodeList: [],
      // 是否允许添加便签
      addNode: true,
      // 编辑或新建时，向下一个页面传递的信息
      form: {},
      // 对象形式存储的要传递的信息
      currentRow: {},
      // 无名件列表
      tableData: [],
      // 日志
      logsData: [],
      // 货品列表
      namelessGoodsLsit: [],
      // 要处理的无名件号码数组
      nameless_numbers: [],
      // 分页显示的数据，分页请求
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/NamelessExcelport')
    },
    // 过滤器，将状态由数字变为文字
    regionFormatter(row, column) {
      const mapping = {
        '1': '待处理',
        '2': '已处理'
      }
      return mapping[row.status]
    },
    // 关闭快捷键页面
    handleClose() {
      this.addFormVisible = false
    },
    // 已处理无名件
    passed() {
      // 消息提示
      this.$confirm('请确认处理该无名件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 点击确定将所选择的无名件状态，变为已处理
        this.$http.post('nameless/changeStatus', {
          'body': {
            nameless_numbers: this.nameless_numbers,
            status: 2
          }
        }).then(res => {
          // 处理完成时，刷新无名件列表
          this.getList()
          // 提示处理已完成
          this.$message({
            type: 'success',
            message: '完成处理'
          })
        })
      }).catch(() => {
        // 提示处理已取消
        this.$message({
          type: 'info',
          message: '已取消处理'
        })
      })
    },
    // 选择无名件时触发
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 刷新传递到新建或者编辑无名件页面的数据
      this.currentRow = this.multipleSelection[0]
      // 通过遍历所选择的数组，将所选择的所有的无名件号码存入nameless_numbers中
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.nameless_numbers.push(this.multipleSelection[i].namelessNumber)
      }
    },
    // 关闭页面时，清除数据
    handleCloseForm() {
      // 清除数据
      this.form = {
        formTitle: '新建订单',
        user_name: this.$store.getters.getAccount.name,
        address: '',
        createDatetime: '',
        fakeId: '',
        goodsNumber: '',
        namelessNumber: '',
        namelessUuid: '',
        phosenderne: '',
        telephone: '',
        buyer_remark: '',
        postcode: '',
        receivable_money: '',
        postage: '',
        discount_money: '',
        discount: '',
        actual_money: '',
        pay_type: '',
        invoice_type: '',
        invoice_title: '',
        invoice_content: '',
        logistics_mode: '',
        service_remark: '',
        goods_list: []
      }
      // 关闭页面
      this.addFormVisible = false
      // 消息提示
      this.$message({
        showClose: true,
        message: '已取消' + this.formTitle
      })
    },
    // 打开便签
    showStickyNotesVisible() {
      this.stickyNotesVisible = true
      window.sessionStorage.setItem('createNodeParent', 'UnknownThings')
    },
    handlePopupForm(formName) {
      if (formName === 'add') {
        // 新建无名件
        this.formTitle = '新建无名件'
        window.sessionStorage.setItem('formTitle', '新建无名件')
        this.form = Object.assign({})
      } else if (formName === 'edit') {
        this.formTitle = '编辑无名件'
        // 编辑无名件，将要编辑无名件的namelessNumber传到编辑页面
        window.sessionStorage.setItem('formTitle', '编辑无名件')
        this.form = Object.assign({}, {
          'title': '编辑无名件',
          'nameless_number': this.currentRow.namelessNumber
        })
      }
      // 打开新建或编辑页面
      this.addFormVisible = true
    },
    // 获取无名件列表
    getList() {
      this.$http.post('nameless/list', {
        'body': {
          ...this.pagination
        }
      }).then(res => {
        // 重置无名件列表，无名件分页显示数据
        this.tableData = res.data.body.NamelessList
        this.pagination.total = Math.ceil(res.data.body.count / this.pagination.pageSize)
        this.pagination.count = res.data.body.count
        this.pagination.page = res.data.body.page
      }).catch(res => {
        console.log(res)
      })
    },
    // 点击分页吗，获取对应页的无名件数据
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this.getList()
    },
    // 点击行触发的函数
    selectInfo(row) {
      // 获取到日志
      this.getLogList(row)
      // 获取到货品列表
      this.getgoodsList(row)
      // 获取便签
      this.getNode(row.namelessNumber)
      // 允许添加便签
      this.addNode = false
      // 将便签添加到row.namelessNumber的数据里
      window.localStorage.setItem('order_number', row.namelessNumber)
    },
    // 获取日志
    getLogList(row) {
      this.$http.post('returnGoods/loglist', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'after_sales_number': row.namelessNumber
        }
      }).then(res => {
        // console.log(res.data.body)无名件日志
        this.logsData = []
        this.logsData = res.data.body.LogAfterSalesList
      }).catch(res => {
        console.log(res)
      })
    },
    // 货品列表
    getgoodsList(row) {
      this.$http.post('nameless/goods', {
        'head': this.$store.getters.getAccount,
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'nameless_number': row.namelessNumber
        }
      }).then(res => {
        // console.log(res)
        this.namelessGoodsLsit = []
        this.namelessGoodsLsit = res.data.body.NamelessGoodsList
      }).catch(res => {
        console.log(res)
      })
    },
    // 获取便签
    getNode(row) {
      console.log(row)
      window.localStorage.setItem('order_number', row.namelessNumber)
      this.$http.post('note/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'order_number': row
        }
      }).then(res => {
        // console.log('便签', res)
        this.nodeList = []
        this.nodeList = res.data.body.NoteList
      }).catch(res => {
        console.log(res)
      })
    }
  },
  mounted() {
    // 页面打开自动获取无名件列表
    this.getList()
  },
  computed: {
    permission() {
      // 获取权限信息
      return this.$store.getters.hasPermission('namelessPartWrite')
    }
  }
}

</script>
<style>
.el-table .cell {
  text-align: center;
}
@media print {

}
</style>
