<template>
  <div>
    <el-form ref="productForm" :inline="true" label-width="80px">
      <div class="mgb15">
        <el-button type="success" @click="selectProductVisible = true">添加锯条</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
      <el-table stripe :data="productInformation" class="product-information" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="货品编码" prop="id"></el-table-column>
        <el-table-column label="货品名称" prop="goodsName"></el-table-column>
        <el-table-column label="品牌" prop="brandName"></el-table-column>
        <el-table-column label="规格" prop="model"></el-table-column>
        <el-table-column label="长度(mm)">
          <template slot-scope="scope">
          	<el-form-item :prop="'productInformation['+ scope.$index +'].length'">
								<el-input type="number" v-model="scope.row.length" size="mini" class="w100"></el-input>
						</el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="生产备注">
          <template slot-scope="scope">
          	<el-form-item :prop="'productInformation['+ scope.$index +'].remark'">
							<el-input v-model="scope.row.remark" size="mini" width="100" ></el-input>
						</el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="生产数量">
          <template slot-scope="scope">
          	<el-form-item :prop="'productInformation['+ scope.$index +'].count'">
								<el-input type="number" v-model="scope.row.count" size="mini" class="w100"></el-input>
						</el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="下单数量">
          <template slot-scope="scope">
          	<el-form-item :prop="'productInformation['+ scope.$index +'].count'">
								<el-input type="number" v-model="scope.row.count" size="mini" class="w100"></el-input>
						</el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <section class="panel-section">
        <el-form-item label="车间组" prop="workshopId">
          <template>
							<el-form-item>
								<el-select v-model="workshopId" placeholder="请选择" value-key="id">
									<el-option v-for="item in workshopList" :key="item.value.id" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</template>
        </el-form-item>
      </section>
    </el-form>
    <div class="order-form-btn">
      <el-button type="primary" @click="handleSubmit('productForm')" class="circle-btn">下达</el-button>
      <el-button @click='callback' class="circle-btn">取消</el-button>
      <el-button @click='resetting' class="circle-btn">重置</el-button>
    </div>
    <el-dialog  :modal="false" title="添加锯条" :modal-append-to-body="false" :visible.sync="selectProductVisible" size="large" @close="handleCancel">
      <el-table :data="goodsList" ref="multipleTable" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChangeSelect">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center">
        </el-table-column>
        <el-table-column prop="model" label="规格" align="center">
        </el-table-column>
        <el-table-column prop="width" label="宽度" align="center">
        </el-table-column>
        <el-table-column prop="categoryName" label="分类" align="center">
        </el-table-column>
        <el-table-column prop="warehouseLocation" label="库位" align="center">
        </el-table-column>
        <el-table-column prop="" label="库存" align="center">
        </el-table-column>
        <el-table-column prop="supplier" label="供应商" align="center">
        </el-table-column>
      </el-table>
      <div class="toolbar clearfix">
        <el-pagination class="fr" layout="prev, pager, next" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
      <div class="text-center">
        <el-button class="circle-btn" @click="handleCancel">取消</el-button>
        <el-button type="primary" class="circle-btn" @click="handleSubmitProduct">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'product-form',
  props: {
    formType: {
    	type: String,
    	required: true
    }
  },
  data () {
    return {
    	_self: this,
      // 选中的productInformation里的产品
      multipleSelection: [],
      // 选中的要添加的产品
      multipleSelectionSelect: [],
      // 选中的产品
      productInformation: [],
      // 货品列表
      goodsList: [],
      brand_options: [],
      workshopList: [],
      workshopId: '',
      pagination: {
        count: 0,
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        page: 0
      },
      addProductFormVisible: false,
      // 添加产品页
      selectProductVisible: false,
      loading: false,
      goods: []
    }
  },
  computed: {
    formtype() {
    	return this.formType
    }
  },
  methods: {
    // 关闭此页面，清除数据
    callback() {
      this.$parent.$parent.handleClose()
    },
    // 校验分组
	  validateWorkshop(rule, value, callback) {
	      if (this.$tool.isEmptyObject(value)) {
	        callback(new Error('分组不能为空'))
	      } else {
	        callback()
	      }
	  },
    // 清除数据
    resetting() {
      this.productInformation = []
    },
    // 选中要删除的产品
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 选中要添加的产品
    handleSelectionChangeSelect (val) {
      this.multipleSelectionSelect = val
    },
    // 分页
    handleCurrentChange (val) {
      this.pagination.pageIndex = val
    },
    // 删除选中的商品
    handleDelete() {
      this.$emit('handleCloseDialog', this.multipleSelection)
      this.addProductFormVisible = false
      for (let i = 0; i < this.productInformation.length; i++) {
        for (let x = 0; x < this.multipleSelection.length; x++) {
          if (this.productInformation[i] === this.multipleSelection[x]) {
            this.productInformation.splice(i, 1)
          }
        }
      }
    },
    // 将产品id数组，入库仓库，等发往后台
    handleSubmit(formName) {
    	if (this.productInformation.length === 0) {
    		this.$message({
	          'message': '请添加锯条',
	          'type': 'error'})
				return
			}
    	if (!this.workshopId) {
					this.$message({
	          'message': '请选择车间组',
	          'type': 'error'
	        })
					return
				}
			for (let i = 0; i < this.productInformation.length; i++) {
				let item = this.productInformation[i]
				if (!item.remark) {
					this.$message({
	          'message': '请填写生产备注',
	          'type': 'error'
	        })
					return
				}
				if (!item.count) {
					this.$message({
	          'message': '请填写生产数量',
	          'type': 'error'
	        })
					return
				}
			}
			let arr = []
			this.productInformation.forEach((item, index) => {
				arr.push({
					'count': item.count,
					'goodsId': item.id,
					'remark': item.remark
				})
			})
			this.$tool.common(this, 'production/create', {
				'modelList': arr,
				'orderNo': '', // 不关联订单
				'workshopId': this.workshopId.workshopId,
				'createUser': this.$store.getters.getAccount.name
			}, bodyInfo => {
				this.$parent.$parent.outboundVisible = false
				this.$parent.$parent.queryProductionList()
			})
		},
		// 添加商品
    handleSubmitProduct() {
    	let vm = this
      vm.multipleSelectionSelect.forEach(function(item) {
      	vm.productInformation.push(item)
      })
      vm.handleCancel()
    },
    // 查询车间列表
	  queryWorkshop() {
	      this.$tool.loadOptions(this, 'workshop/list', bodyInfo => {
	        this.workshopList = bodyInfo.apiResult.map(item => {
	          return {
	            label: item.workshopName,
	            value: {
	              workshopName: item.workshopName,
	              workshopId: item.id
	            }
	          }
	        })
	      }, {
	      	workshop_name: ''
	      })
	  },
    // 关闭此页面，清除数据
    handleCancel() {
      this.$refs.multipleTable.clearSelection()
      this.selectProductVisible = false
    },
    // 获取货品列表
    queryGoods() {
      this.$tool.loadOptions(this, 'goods/list', bodyInfo => {
        this.goodsList = bodyInfo.info
      }, {
      	goodsType: 1
      })
    }
  },
  mounted() {
    this.queryGoods()
    this.queryWorkshop()
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
  .panel-heading {
    font-size: 18px;
    border-left-width: 4px;
  }
  .panel-section {
    border-top: 1px solid #e0e0e0;
    padding-top: 35px;
  } 
  .product-information {
    width: 100%;
    margin-bottom: 20px;
  }
  .order-form-btn {
    margin-top: 60px;
    text-align: center;
    .el-button+.el-button {
      margin-left: 20px;
    }
  }
  .order-form-btn {
  margin-top: 60px;
  text-align: center;
  .el-button+.el-button {
    margin-left: 20px;
  }
  .circle-btn {
    width: 100px;
  }
}
  
</style>