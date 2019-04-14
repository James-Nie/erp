<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" :inline="true" label-width="80px">
      <section class="panel-section">
      	<el-form-item :label="position">
          <el-dropdown @command="handlePositionReason" trigger="click">
            <el-button>{{position}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item :command="position">{{position}}</el-dropdown-item>
              <el-dropdown-item v-for="item in reasons" :key="item" :command="item">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
       	</el-form-item>
       	<el-form-item label="关联订单" prop="supplier" v-if="formType ==='in'">
          <el-select v-model="supplier" placeholder="请选择供应商关联订单" class="w192">
            <el-option v-for="item in supplier_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
       	<el-form-item label="供应商" prop="supplier" v-if="formType ==='in'">
          <el-select v-model="supplier" placeholder="请选择供应商" class="w192">
            <el-option v-for="item in supplier_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择仓库">
          <el-dropdown @command="handleDashBoard" trigger="click">
            <el-button>{{warehouseName}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="全部仓库">全部仓库</el-dropdown-item>
              <el-dropdown-item v-for="item in commands" :key="item.warehouseUuid" :command="item.warehouseUuid">{{item.warehouseName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="物流公司" prop="logisticsCompany" v-if="formType ==='in'">
          <el-select v-model="logisticsCompany" placeholder="请选择物流公司" class="w192">
            <el-option v-for="item in logistics_options" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" v-if="formType ==='in'">
          <el-input v-model="logisticsNumber" placeholder="物流单号"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>                                      
      </section>
      <div class="mgb15">
        <el-button type="success" @click="selectProductVisible = true">添加货品</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
      <el-table stripe :data="productInformation" class="product-information" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="货品编码"></el-table-column>
        <el-table-column label="货品名称"></el-table-column>
        <el-table-column label="品牌" prop="brand"></el-table-column>
        <el-table-column label="规格" prop="model"></el-table-column>
				<el-table-column label="分类" prop="category"></el-table-column>
        <el-table-column label="长度(mm)" prop="length"></el-table-column>
        <el-table-column label="实际重量(kg)" prop="weight"></el-table-column>
        <el-table-column label="出库数量">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.number" :max="scope.row.amount" :min="1" size="mini"></el-input>
          </template>
        </el-table-column>                                   
      </el-table>
    </el-form>
    <div class="order-form-btn">
      <el-button type="primary" @click="handleSubmit('form')" class="circle-btn">提交</el-button>
      <el-button @click='callback' class="circle-btn">取消</el-button>
      <el-button @click='resetting' class="circle-btn">重置</el-button>
    </div>
    <el-dialog  :modal="false" title="添加货品" :modal-append-to-body="false" :visible.sync="selectProductVisible" size="large">
      <el-table :data="list" ref="multipleTable" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChangeSelect">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="brand" label="品牌" align="center">
        </el-table-column>
        <el-table-column prop="model" label="规格" align="center">
        </el-table-column>
        <el-table-column prop="width" label="宽度" align="center">
        </el-table-column>
        <el-table-column prop="length" label="长度" align="center">
        </el-table-column>
        <el-table-column prop="category" label="分类" align="center">
        </el-table-column>
        <el-table-column prop="address" label="库位" align="center">
        </el-table-column>
        <el-table-column prop="amount" label="库存" align="center">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" align="center">
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
  name: 'outbound',
  props: {
    updatedForm: {
      type: Object,
      required: true
    },
    formType: {
    	type: String,
    	required: true
    }
  },
  data () {
    return {
      // 选中的productInformation里的产品
      multipleSelection: [],
      // 选中的要添加的产品
      multipleSelectionSelect: [],
      // 选中的产品
      productInformation: [],
      // 仓库列表
      commands: [],
      supplier_options: [],
      logistics_options: ['圆通', '申通', '韵达', '中通'],
      supplier: '',
      logisticsCompany: '',
      logisticsNumber: '',
      // 出入库原因
      reasons: ['销售', '换货', '采购退货', '调拨', '其他'],
      // 产品列表
      list: [],
      position: this.formtype === 'in' ? '入库原因' : '出库原因',
      warehouseName: '全部仓库',
      warehouseUuid: '全部仓库',
      rules: {},
      pagination: {
        count: 0,
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        page: 0
      },
      addProductFormVisible: false,
      SubmitOrderVisible: false,
      // 添加产品页
      selectProductVisible: false,
      loading: false,
      goods: [],
      // 调拨的产品id
      printUuids: [],
      // 调拨的产品分组
      sign: [],
      // 产品分组
      printSign: []
    }
  },
  computed: {
    form: {
      get() {
        return this.updatedForm
      },
      set(val) {
        Object.assign(this.form, val)
      }
    },
    formtype() {
    	return this.formType
    }
  },
  methods: {
    // 关闭此页面，清除数据
    callback() {
      this.resetting()
      this.$parent.$parent.handleClose()
    },
    // 清除数据
    resetting() {
      this.form = {}
      this.productInformation = []
      this.printUuids = []
      this.warehouseName = '全部仓库'
      this.warehouseUuid = ''
      this.List = []
      this.supplier = ''
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
        if (i === this.productInformation.length - 1) {
          this.getPrintUuids()
        }
      }
    },
    // 获取商品IDprintUuids
    getPrintUuids() {
      let res = []
      let json = {}
      for (let i = 0; i < this.printSign.length; i++) {
        if (!json[this.printSign[i]]) {
          res.push(this.printSign[i])
          json[this.printSign[i]] = 1
        }
      }
      for (let i = 0; i < res.length; i++) {
        this.printUuids[i] = []
        for (let j = 0; j < this.productInformation.length; j++) {
          if (res[i] === this.productInformation[j].sign) {
            this.printUuids[i].push(this.productInformation[j].printUuid)
          }
        }
      }
    },
    // 将产品id数组，入库仓库，等发往后台
    handleSubmit(formName) {
      if (this.position === '出库原因') {
      	this.$message.error('请选择出库原因')
      	return
      }
      if (this.position === '入库原因') {
      		this.$message.error('请选择入库原因')
      		return
      	}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.formType === 'in' ? '' : 'pda/scanCode'
          let data = this.formType === 'in' ? {
                ...this.pagination,
                'user_name': this.$store.getters.getAccount.name,
                'reason_for_delivery': this.position,
                'printUuids': this.printUuids,
                'printNumUuids': [],
                'logisticsCompany': this.logisticsCompany,
                'logisticsNumber': this.logisticsNumber
             } : {
                ...this.pagination,
                'user_name': this.$store.getters.getAccount.name,
                'reason_for_delivery': this.position,
                'printUuids': this.printUuids,
                'printNumUuids': []
             }
          if (this.printUuids.length > 0) {
            this.$http.post(url, {
              'body': data
            }).then(res => {
              this.$tool.parentComponents(this, 'InventoryManagement').queryStockList()
              this.$tool.parentComponents(this, 'InventoryManagement').outboundVisible = false
              this.callback()
            }).catch(res => {
              console.log(res)
            })
          } else {
            this.$message.error('选择商品')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加商品
    handleSubmitProduct() {
      if (this.productInformation.length === 0) {
        this.productInformation = this.multipleSelectionSelect
        for (let i = 0; i < this.multipleSelectionSelect.length; i++) {
          this.printSign[i] = this.multipleSelectionSelect[i].sign
          if (i === this.multipleSelectionSelect.length - 1) {
            this.getPrintUuids()
          }
        }
      } else {
        for (let i = 0; i < this.multipleSelectionSelect.length; i++) {
          for (let j = 0; j < this.productInformation.length; j++) {
            if (this.multipleSelectionSelect[i].printUuid === this.productInformation[j].printUuid) {
              this.productInformation[j].number++
              break
            }
            if (j === this.productInformation.length - 1) {
              this.productInformation.push(this.multipleSelectionSelect[i])
            }
          }
          this.printSign[i] = this.multipleSelectionSelect[i].sign
          if (i === this.multipleSelectionSelect.length - 1) {
            this.getPrintUuids()
            console.log(this.productInformation)
          }
        }
      }
      this.handleCancel()
    },
    // 关闭此页面，清除数据
    handleCancel() {
      this.$refs.multipleTable.clearSelection()
      this.selectProductVisible = false
    },
    // 添加商品
    _loadGoods(val) {
      let warehouseUuid
      if (val === '' || val === '全部仓库') {
        warehouseUuid = ''
      } else {
        warehouseUuid = val
      }
      this.$http.post('stock/listPrint', {
        'body': {
          ...this.pagination,
          'warehouseUuid': warehouseUuid
        }
      }).then(res => {
        // console.log(res)
        let GoodsPrintQRList = res.data.body.PrintStockList
        for (let i = 0; i < GoodsPrintQRList.length; i++) {
          GoodsPrintQRList[i].goods_uuid = GoodsPrintQRList[i].goodsUuid
          GoodsPrintQRList[i].number = 1
          GoodsPrintQRList[i].stock_uuid = GoodsPrintQRList[i].stockUuid
          GoodsPrintQRList[i].warehouse_uuid = GoodsPrintQRList[i].warehouseUuid
          GoodsPrintQRList[i].supplier_name = GoodsPrintQRList[i].supplierName
          GoodsPrintQRList[i].warehouse_name = GoodsPrintQRList[i].warehouseName
          GoodsPrintQRList[i].length = '' + GoodsPrintQRList[i].length
        }
        this.list = GoodsPrintQRList
        // console.log(this.list)
      })
    },
    _loadStore() {
      this.$tool.loadOptions(this, 'warehouse/select', bodyInfo => {
        this.commands = bodyInfo.WarehouseList
        console.log(this.commands)
      })
    },
    // 标记出库仓库
    handleDashBoard(command) {
      // this.shopName = a
      console.log(command)
      this.warehouseUuid = command
      if (command === '全部仓库') {
        this.warehouseName = '全部仓库'
      } else {
        for (let i = 0; i < this.commands.length; i++) {
          if (this.commands[i].warehouseUuid === this.warehouseUuid) {
            this.warehouseName = this.commands[i].warehouseName
          }
        }
      }
      this._loadGoods(command)
    },
    // 出库原因
    handlePositionReason(reason) {
    	this.position = reason
    },
    // 查询供应商
    querySupplier() {
      this.$tool.loadOptions(this, 'supplier/list', bodyInfo => {
        this.supplier_options = bodyInfo.apiResult.map(item => ({value: item.name}))
      })
    }
  },
  mounted() {
    this._loadStore()
    this._loadGoods()
    this.querySupplier()
  },
  watch: {
    // 每次进入，清除上一次输入内容
    'form.shopUuid': {
      handler(curVal, oldVal) {
        if (curVal !== oldVal) {
          this.resetting()
        }
      },
      deep: true
    }
  }
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