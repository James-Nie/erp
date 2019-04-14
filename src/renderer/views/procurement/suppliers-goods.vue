<template>
  <div class="goodsFiles">
    <div class="mgb15">
      <el-button type="success" @click="handlePopupForm('add')"><i class="iconfont  "></i>新建</el-button>
      <el-button type="warning" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>修改</el-button>
      <el-button type="danger" icon="delete2" @click="handleDelete" :disabled="multipleSelection.length === 0">删除</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <div class="table-wrapper">
      <el-table :data="goodsList" max-height="523" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column prop="brand" label="品牌" align="center">
        </el-table-column>
        <el-table-column prop="model" label="规格" align="center">
        </el-table-column>
        <el-table-column prop="width" label="宽度(m)" align="center">
        </el-table-column>
        <el-table-column prop="weight" label="单重(kg)" align="center">
        </el-table-column>
        <el-table-column prop="costPrice" label="真是财务成本(元)" align="center">
        </el-table-column>
        <el-table-column prop="category" label="分类" align="center">
        </el-table-column>
        <el-table-column prop="supplier" label="供应商" align="center">
        </el-table-column>
        <el-table-column prop="retailPrice" label="零售价(元)" align="center">
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-tabs v-model="activeIndex" type="border-card" class="auxiliary-table">
      <el-tab-pane label="日志" name="log">
        <el-table :data="log" stripe style="width: 100%" max-height="163">
          <el-table-column type="index" label="序号" width="70" align="center">
          </el-table-column>
          <el-table-column prop="orderNumber" label="订单号" align="center" width="180">
          </el-table-column>
          <el-table-column prop="content" label="日志内容" align="center">
          </el-table-column>
          <el-table-column prop="operator" label="操作员" align="center" width="100">
          </el-table-column>
          <el-table-column label="时间" :formatter="$formatter.formatTime('createDatetime')" align="center" width="180">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--新建编辑-->
    <el-dialog custom-class="goods-Form" :title="formTitle" :visible.sync="formVisible" :before-close="handleClose">
      <goods-files-form ref="goodsFilesForm" :updated_form="form" :categoryOptions="categoryOptions" :formTitle="formTitle"></goods-files-form>
    </el-dialog>
  </div>
</template>
<script>
import GoodsFilesForm from './GoodsFiles/Form'
export default {
  name: 'suppliers-goods',
  components: {
    [GoodsFilesForm.name]: GoodsFilesForm
  },
  data() {
    return {
      loading: false,
      activeIndex: 'log',
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      categoryOptions: [],
      goodsList: [],
      multipleSelection: [],
      formVisible: false,
      dialogVisible: false,
      formTitle: '新建配件管理',
      form: {
        goods_sign: 2,
        goods_uuid: '',
        brand_uuid: '',
        model: '',
        supplier: '',
        cost_price: '',
        weight: '',
        width: '',
        retail_price: '',
        categoryArray: []
      }
    }
  },
  watch: {
    '$store.state.common.dateTime': function () {
      this._loadMainList()
    }
  },
  methods: {
    exportExcel() {
      this.$tool.exportExcel(this, 'export/GoodsExcelport')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleClose(done) {
      this.$refs['goodsFilesForm'].clearFields()
      this.form = {
        goods_uuid: '',
        brand_uuid: '',
        goods_sign: 2,
        model: '',
        supplier: '',
        cost_price: '',
        weight: '',
        width: '',
        retail_price: '',
        categoryArray: []
      }
      done()
    },
    // 删除供应商货品
    handleDelete() {
      let goodsUuids = this.multipleSelection.map(item => item.goodsUuid)
      this.$tool.common(this, 'goods/delete', {
        'goodsUuid': goodsUuids
      }, bodyInfo => {
        this.multipleSelection = []
        this._loadMainList()
      })
    },
    filterFn(item, index) {
      return {
        'index': index,
        'label': item.category,
        'value': item.categoryUuid,
        'depth': item.depth,
        'children': []
      }
    },
    // 根据formTitle不同,向新建或者编辑页面传递不同数据
    handlePopupForm(formName) {
      this.$tool.common(this, 'category/list', {
        depth: 0,
        categoryUuid: ''
      }, bodyInfo => {
        this.categoryOptions = bodyInfo.categoryList.map(this.filterFn)
        if (formName === 'add') {
          this.formTitle = '新建配件管理'
          this.formVisible = true
        } else if (formName === 'edit') {
          if (this.multipleSelection.length === 1) {
            let updatedForm = this.multipleSelection[0]
            this.$http.post('http://116.62.223.112/erp/category/find', {
              'body': {
                'category_uuid': updatedForm.categoryUuid
              }
            }).then(res => {
              const { oneCategoryUuid, twoCategoryUuid, threeCategoryUuid } = res.data.body.category
              this.form = Object.assign({}, {
                goods_sign: 2,
                goodsUuid: updatedForm.goodsUuid,
                brand_uuid: updatedForm.brandUuid,
                model: updatedForm.model,
                supplier: updatedForm.supplier,
                width: updatedForm.width,
                cost_price: updatedForm.costPrice,
                weight: updatedForm.weight,
                categoryArray: [oneCategoryUuid, twoCategoryUuid, threeCategoryUuid],
                retail_price: updatedForm.retailPrice
              })
              this.formTitle = '编辑配件管理'
              let firstItem = this.$tool.querySelector(this.categoryOptions, 'value', oneCategoryUuid)[0]
              this.$tool.common(this, 'category/list', {
                depth: 1,
                categoryUuid: oneCategoryUuid
              }, bodyInfo => {
                firstItem.children = bodyInfo.categoryList.map(this.filterFn)
                let secondItem = this.$tool.querySelector(this.categoryOptions, 'value', twoCategoryUuid)[0]
                this.$tool.common(this, 'category/list', {
                  depth: 2,
                  categoryUuid: twoCategoryUuid
                }, bodyInfo => {
                  secondItem.children = bodyInfo.categoryList.map((item, index) => {
                    return {
                      'index': index,
                      'label': item.category,
                      'value': item.categoryUuid,
                      'depth': item.depth
                    }
                  })
                  this.formVisible = true
                })
              })
            })
          }
        }
      })
    },
    // 分页查询
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
      this._loadMainList()
    },
    // 查询主要列表
    _loadMainList() {
      this.$tool.loadList(this, 'goods/list', bodyInfo => {
        this.goodsList = bodyInfo.goodsList
      }, {
        goodsSign: 2
      })
    }
  },
  mounted() {
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
