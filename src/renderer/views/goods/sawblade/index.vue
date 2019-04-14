<template>
  <div class="sawblade-management">
    <div class="mgb15">
      <el-button type="success" @click="handlePopupForm('add')"><i class="iconfont  "></i>新建</el-button>
      <el-button type="warning" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>修改</el-button>
      <el-button type="danger" icon="delete2" @click="handleDelete" :disabled="multipleSelection.length === 0">删除</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <el-table :data="sawList" ref="multipleTable" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange" @row-click="handleClick">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="brand" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <!--<el-table-column prop="width" label="宽度(m)" align="center">
      </el-table-column>-->
      <el-table-column prop="headSize" label="最大料头尺寸(mm)" align="center">
      </el-table-column>
      <el-table-column prop="supplier" label="供应商" align="center">
      </el-table-column>
      <el-table-column prop="retailPrice" label="销售成本(元)" align="center">
      </el-table-column>
      <el-table-column prop="costPrice" label="真实财务成本(元)" align="center">
      </el-table-column>      
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog custom-class="sawblade-Form" :title="formTitle" :visible.sync="formVisible" :before-close="handleClose">
      <sawblade-form :formTitle="formTitle" :updated_form="form" ref="sawbladeForm"></sawblade-form>
    </el-dialog>
  </div>
</template>
<script>
import SawbladeForm from './form'
export default {
  name: 'sawblade-management',
  components: {
    [SawbladeForm.name]: SawbladeForm
  },
  data() {
    return {
      loading: false,
      formTitle: '新建锯条',
      multipleSelection: [],
      logsDate: [],
      sawList: [],
      formVisible: false,
      form: {
        sawUuid: '',
        brand: '',
        model: '',
        width: '',
        head_size: '',
        supplier: '',
        retail_price: ''
      },
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
      this.$tool.exportExcel(this, 'export/SawExcelport')
    },
    // 点击表格选中一行
    handleClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 保存选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 关闭页面
    handleClose(done) {
      this.$refs['sawbladeForm'].clearFields()
      done()
    },
    // 删除选中行
    handleDelete() {
      let sawUuids = this.multipleSelection.map(item => item.sawUuid)
      this.$http.post('saw/delete', {
        'body': {
          'sawUuid': sawUuids
        }
      }).then(res => {
        this.multipleSelection = []
        this._loadMainList()
      })
    },
    // 根据条件不同，新建只打开新建页面；编辑打开页面，向编辑页面传递数据
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建锯条'
      } else if (formName === 'edit') {
        if (this.multipleSelection.length === 1) {
          let updatedForm = this.multipleSelection[0]
          this.form = Object.assign({}, {
            sawUuid: updatedForm.sawUuid,
            brand_uuid: updatedForm.brandUuid,
            model: updatedForm.model,
            width: updatedForm.width,
            supplier: updatedForm.supplier,
            retail_price: updatedForm.retailPrice,
            head_size: updatedForm.headSize,
            cost_price: updatedForm.costPrice
          })
        }
        this.formTitle = '锯条编辑'
      }
      this.formVisible = true
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 获取列表
    _loadMainList() {
      this.$tool.loadList(this, 'saw/list', bodyInfo => {
        this.sawList = bodyInfo.sawList
      })
    }
  },
  mounted() {
    this._loadMainList()
  }
}

</script>
<style lang="scss">
.sawblade-Form {
  width: 700px;
  border-radius: 6px;
}

</style>
