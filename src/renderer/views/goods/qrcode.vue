<template>
  <div class="labelling-management">
    <div class="mgb15">
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <el-table :data="qrcodeList" stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="number" label="货品编号" align="center">
      </el-table-column>
      <el-table-column prop="sign" label="标记批次" align="center">
      </el-table-column>
      <el-table-column prop="brand" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="width" label="宽度" align="center">
      </el-table-column>
      <el-table-column prop="length" label="长度" align="center">
      </el-table-column>
      <el-table-column label="二维码" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.qrCode" class="qrCode" @click="preview(scope.row.qrCode)"/>
        </template>
      </el-table-column>            
      <el-table-column prop="warehouseName" label="所在仓库" align="center">
      </el-table-column>
      <el-table-column prop="address" label="库位" align="center">
      </el-table-column>
      <el-table-column prop="category" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="weight" label="重量" align="center">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'qrcode',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      brand_options: [],
      qrcodeList: [],
      form: {
        brand: '',
        number: '',
        model: '',
        width: '',
        length: '',
        weight: ''
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
      this.$tool.exportExcel(this, 'export/QRCodeExcelport')
    },
    // 图片预览
    preview(url) {
      if (!url) {
        return false
      }
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 分页查询
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$tool.common(this, 'code/create', this.form, bodyInfo => {
            console.log(bodyInfo)
            this._loadMainList()
          })
        }
      })
    },
    _loadMainList() {
      this.$tool.loadList(this, 'code/QrCodeList', bodyInfo => {
        this.qrcodeList = bodyInfo.GoodsPrintQRList
      })
    }
  },
  mounted() {
    this._loadMainList()
  }
}
</script>
<style lang="scss">
.labelling-management {
  .labelling-form {
    width: 690px;
  }
  .labelling-footer {
    margin-top: 30px;
    .el-button+.el-button {
      margin-left: 20px;
    }
  }
  .qrCode {
    width:50px;
    height:50px;
    margin-top:8px;
    cursor: pointer;
  }

  .el-dialog__header {
    padding: 20px 20px 0;
    border-bottom: none;
  }
} 
</style>
