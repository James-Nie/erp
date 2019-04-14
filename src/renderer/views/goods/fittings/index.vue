<template>
  <div class="goodsFiles">
    <div class="mgb15">
      <el-button type="success" @click="handlePopupForm('add')"><i class="iconfont  "></i>新建</el-button>
      <el-button type="warning" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>修改</el-button>
      <el-button type="danger" icon="delete2" @click="handleDelete" :disabled="multipleSelection.length === 0">删除</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <div class="search-condition">
    	<el-form inline ref="searchForm" :model="searchForm" label-width="80px">
        <el-form-item label="筛选条件:">
          <el-select class="w160" v-model="searchForm.brandId" placeholder="全部品牌">
		        <el-option v-for="item in brand_options" :key="item.id" :label="item.name" :value="item.id">
		        </el-option>
		      </el-select>
		      <el-select class="w160" v-model="searchForm.brandId" placeholder="全部分类">
		        <el-option v-for="item in brand_options" :key="item.id" :label="item.name" :value="item.id">
		        </el-option>
		      </el-select>
        </el-form-item>
     </el-form>
  	</div>
    <el-table :data="goodsList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column prop="id" label="货品编号" align="center">
      </el-table-column>
      <el-table-column prop="goodsName" label="名称" align="center">
      </el-table-column>
      <el-table-column :formatter="$formatter.formatGoodsType" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="width" label="宽度(mm)" align="center">
      </el-table-column>
      <el-table-column prop="maxLtSize" label="最大报废值(mm)" align="center" width="160">
      </el-table-column>
      <el-table-column prop="retailPrice" label="销售底价(元)" align="center" width="130">
      </el-table-column>
      <el-table-column prop="costPrice" label="最低销售底价(元)" align="center" width="160">
      </el-table-column> 
    </el-table>
    <!-- 分页 -->
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!--新建编辑表单-->
    <el-dialog custom-class="goods-Form" :title="formTitle" :visible.sync="formVisible" :before-close="handleClose">
      <fittings-form ref="goodsFilesForm" :updated_form="form" :formTitle="formTitle"></fittings-form>
    </el-dialog>
  </div>
</template>
<script>
import FittingsForm from './form'
export default {
  name: 'fittings-management',
  components: {
    [FittingsForm.name]: FittingsForm
  },
  data() {
    return {
      // 是否等待
      loading: false,
      // 分页
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      },
      // 表单列表
      goodsList: [],
      brand_options: [],
      // 选择的货品信息
      multipleSelection: [],
      // 新建编辑表单是否显示
      formVisible: false,
      // dialogVisible: false,
      // 新建或编辑页面顶部信息
      formTitle: '新建货品',
      // 传递到新建编辑表单的数据
      form: {
        goodsId: '',
        brandId: '',
        model: '',
        costPrice: '',
        width: '',
        retailPrice: '',
        categoryId: ''
      },
      searchForm: {
      	brandId: '',
      	categoryId: 0
      }
    }
  },
  watch: {
    // 刷新表单列表
    '$store.state.common.dateTime': function() {
      this._loadMainList()
    },
    searchForm: {
    	handler: function (val, oldVal) {
    		this._loadMainList()
    	},
    	deep: true
    }
  },
  methods: {
    // 导出
    exportExcel() {
      this.$tool.exportExcel(this, 'export/GoodsExcelport')
    },
    // 选择时触发函数
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 关闭页面时，清空数据
    handleClose(done) {
      this.$refs['goodsFilesForm'].clearFields()
      this.form = {
        goodsId: '',
        brandId: '',
        model: '',
        costPrice: '',
        width: '',
        retailPrice: '',
        categoryId: ''
      }
      done()
    },
    queryBrands() {
      this.$tool.common(this, 'brand/list', {
        'pageIndex': 1,
        'pageSize': 10000
      }, bodyInfo => {
      	this.brand_options = bodyInfo.apiResult
      })
    },
    // 删除选中的表单
    handleDelete() {
      let goodsIds = this.multipleSelection.map(item => item.id)
      this.$tool.common(this, '/goods/batchDelete', {
        'goodsIds': goodsIds
      }, bodyInfo => {
        // 清空选中
        this.multipleSelection = []
        // 刷新
        this._loadMainList()
      })
    },
    // 过滤器
    filterFn(item, index) {
      return {
        'index': index,
        'label': item.category,
        'value': item.categoryUuid,
        'depth': item.depth,
        'children': []
      }
    },
    // 新建或编辑配件管理
    handlePopupForm(formName) {
        if (formName === 'add') {
          this.formTitle = '新建货品'
          this.formVisible = true
        } else if (formName === 'edit') {
          if (this.multipleSelection.length === 1) {
            let updatedForm = this.multipleSelection[0]
              this.form = Object.assign({}, {
                goodsId: updatedForm.id,
                brandId: updatedForm.brandId,
                model: updatedForm.model,
                width: updatedForm.width,
                costPrice: updatedForm.costPrice,
                retailPrice: updatedForm.retailPrice,
                goodsType: updatedForm.goodsType,
        				maxLtSize: updatedForm.maxLtSize,
        				goodsName: updatedForm.goodsName
              })
              this.formTitle = '编辑货品'
              this.formVisible = true
          }
        }
    },
    // 分页，刷新
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    _loadMainList() {
      this.$tool.loadList(this, 'goods/list', bodyInfo => {
        this.goodsList = bodyInfo.apiResult
      }, {
				brandId: this.searchForm.brandId,
				categoryId: this.searchForm.categoryId
      })
    }
  },
  mounted() {
  	this.queryBrands()
    this._loadMainList()
  }
}

</script>
<style lang="scss">
.goodsFiles {
  .goods-Form {
    width: 810px;
  }
}

</style>
