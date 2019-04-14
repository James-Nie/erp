<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" :inline="true" label-width="80px">
      <section class="panel-section">
        <el-form-item label="出库原因">
          <el-dropdown @command="handlePositionReason" trigger="click">
            <el-button>{{position}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="出库原因">出库原因</el-dropdown-item>
              <el-dropdown-item v-for="item in reasons" :key="item" :command="item">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
       </el-form-item>
        <el-form-item label="调出仓库">
          <el-dropdown @command="handleDashBoard1" trigger="click">
            <el-button>{{warehouseName1}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="全部仓库">全部仓库</el-dropdown-item>
              <el-dropdown-item v-for="item in commands" :key="item.warehouseUuid" :command="item.warehouseUuid">{{item.warehouseName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="调入仓库">
          <el-dropdown @command="handleDashBoard2" trigger="click">
            <el-button>{{warehouseName2}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item v-for="item in commands" :key="item.warehouseUuid" :command="item.warehouseUuid">{{item.warehouseName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="备注信息" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>                                      
      </section>
      <div class="mgb15">
        <el-button type="success" @click="selectProductVisible = true">添加货品</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
      <el-table stripe :data="productInformation" class="product-information" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="货品编码"></el-table-column>
			<el-table-column label="货品名称"></el-table-column>
      <el-table-column prop="brand" label="品牌" align="center"></el-table-column>
      <el-table-column prop="model" label="规格" align="center"></el-table-column>
      <el-table-column prop="category" label="分类" align="center"></el-table-column>
      <el-table-column prop="length" label="长度(mm)" align="center"></el-table-column>
      <el-table-column label="实际重量(kg)" prop="weight"></el-table-column>
      <el-table-column label="调拨数量" prop="amount">
        <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.number" :max="scope.row.amount" :min="1" size="mini"></el-input>
          </template>
        </el-table-column>
      </el-table-column>                                   
      </el-table>
    </el-form>
    <div class="order-form-btn">
      <el-button type="primary" class="circle-btn" @click="handleSubmit('form')">提交</el-button>
      <el-button class="circle-btn" @click='callback'>取消</el-button>
      <el-button class="circle-btn" @click='resetting'>重置</el-button>
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
  name: 'warehouse-mobilise',
  // 获取库存管理传递过来的数据
  computed: {
    form: {
      get() {
        return this.updatedForm
      },
      set(val) {
        Object.assign(this.form, val)
      }
    }
  },
  props: {
    updatedForm: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 选中的productInformation里的产品
      multipleSelection: [],
      // 选中的产品
      productInformation: [],
      // 选中的要添加的产品
      multipleSelectionSelect: [],
      // 仓库列表
      commands: [],
      position: '出库原因',
      // 产品列表
      list: [],
      // 出库原因
      reasons: ['销售', '换货', '采购退货', '调拨', '其他'],
      warehouseName1: '全部仓库',
      warehouseName2: '全部仓库',
      warehouseUuid1: '',
      warehouseUuid2: '',
      // 入库仓库与出库仓库不能同名
      warehousePass: true,
      rules: {
        position: [{ required: true, message: '出库原因', trigger: 'change' }],
        warehouse_name: [{ required: true, message: '请选择仓库', trigger: 'change' }]
      },
      // 添加产品页
      selectProductVisible: false,
      loading: false,
      // 调拨的产品id
      printUuids: [],
      // 产品分组
      sign: [],
      // 调拨的产品分组
      printSign: [],
      pagination: {
        count: 0,
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        page: 0
      }
    }
  },
  methods: {
    // 关闭此页面，清除数据
    callback() {
      this.form = {}
      this.warehouseName1 = '全部仓库'
      this.warehouseName2 = '全部仓库'
      this.warehouseUuid1 = ''
      this.warehouseUuid2 = ''
      this.productInformation = []
      this.printUuids = []
      this.$parent.$parent.handleClose()
    },
    // 清除数据
    resetting() {
      this.form = {}
      this.productInformation = []
      this.printUuids = []
      this.warehouseName = '全部仓库'
      this.warehouseUuid = ''
      this.warehouseName1 = '全部仓库'
      this.warehouseName2 = '全部仓库'
      this.warehouseUuid1 = ''
      this.warehouseUuid2 = ''
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
    // 关闭此页面，清除数据
    handleCancel() {
      this.$refs.multipleTable.clearSelection()
      this.selectProductVisible = false
    },
    // 添加产品，获取printSign数组
    handleSubmitProduct() {
      if (this.productInformation.length === 0) {
        this.productInformation = this.multipleSelectionSelect
        for (let i = 0; i < this.productInformation.length; i++) {
          this.printSign[i] = this.productInformation[i].sign
          if (i === this.productInformation.length - 1) {
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
    // 删除选中的商品
    handleDelete() {
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
    // 根据sign不同获取不同组产品id
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.warehouseUuid2 && this.printUuids.length > 0 && this.warehousePass === false) {
            this.$http.post('pda/allocation', {
              'body': {
                ...this.pagination,
                'warehouseUuid': this.warehouseUuid2,
                'printUuids': this.printUuids,
                'printNumUuids': [],
                'reason_for_delivery': this.position
              }
            }).then(res => {
              this.$tool.parentComponents(this, 'InventoryManagement').warehouseMobiliseVisible = false
              this.$tool.parentComponents(this, 'InventoryManagement').queryStockList()
              this.callback()
            }).catch(res => {
              console.log(res)
            })
          } else {
            if (!this.warehouseUuid2) {
              this.$message.error('请选择入库仓库')
            } else if (this.printUuids.length <= 0) {
              this.$message.error('请选择产品')
            } else if (this.warehousePass !== false) {
              this.$message.error('仓库不能相同')
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    _loadStore() {
      this.$tool.loadOptions(this, 'warehouse/select', bodyInfo => {
        this.commands = bodyInfo.WarehouseList
        console.log(this.commands)
      })
    },
    // 根据出库仓库不同添加商品
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
        console.log(res)
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
    // 标记出库仓库
    handleDashBoard1(command) {
      // this.shopName = a
      // console.log(command)
      this.warehouseUuid1 = command
      if (command === '全部仓库') {
        this.warehouseName1 = command
      } else {
        for (let i = 0; i < this.commands.length; i++) {
          if (this.commands[i].warehouseUuid === this.warehouseUuid1) {
            this.warehouseName1 = this.commands[i].warehouseName
          }
        }
      }
      if (this.warehouseUuid1 === this.warehouseUuid2) {
        this.$message.error('仓库不能相同')
        this.warehousePass = true
      } else {
        this.warehousePass = false
      }
      this._loadGoods(command)
    },
    // 标记入库仓库
    handleDashBoard2(command) {
      // this.shopName = a
      console.log(command)
      this.warehouseUuid2 = command
      for (let i = 0; i < this.commands.length; i++) {
        if (this.commands[i].warehouseUuid === this.warehouseUuid2) {
          this.warehouseName2 = this.commands[i].warehouseName
        }
      }
      if (this.warehouseUuid1 === this.warehouseUuid2) {
        this.$message.error('仓库不能相同')
        this.warehousePass = true
      } else {
        this.warehousePass = false
      }
    },
    // 出库原因
    handlePositionReason(reason) {
    	this.position = reason
    }
  },
  mounted() {
    this._loadStore()
    this._loadGoods()
  },
  watch: {
    'form.shopUuid': {
      handler(curVal, oldVal) {
        // 每次进入，清除上一次输入内容
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
</style>