<template>
  <el-form :model="afterSalesOrder" ref="afterSalesOrder" :rules="rules" label-width="100px" inline>
    <!-- 填写基本信息 -->
    <section>
      <div class="panel-heading">基本信息</div>
      <el-form-item label="关联订单" prop="associatedOrders">
        <el-input v-model="afterSalesOrder.associatedOrders"></el-input>
      </el-form-item>
      <el-form-item label="售后单类型" prop="afterSalesType">
       <el-select v-model="afterSalesOrder.afterSalesType" class="w192" @change="selectChange" :disabled="title === '编辑售后单'">
          <el-option v-for="item in orderTypes" :key="item.id"  :lable="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库" prop="warehouseName">
        <el-select v-model="afterSalesOrder.warehouseName" class="w192">
          <el-option v-for="item in commands" :key="item.warehouseUuid" :command="item.warehouseUuid" :lable="item.label" :value="item.warehouseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务员" prop="salesman">
        <el-select v-model="afterSalesOrder.salesman" class="w192">
          <el-option v-for="item in salesmans" :key="item.value" :lable="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </section>
    <!-- 填写客户信息 -->
    <section>
      <div class="panel-heading">客户信息</div>
      <el-form-item label="姓名" prop="name">
        <el-autocomplete v-model="afterSalesOrder.name" :fetch-suggestions="querySearch" placeholder="请输入姓名" @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item label="买家留言">
        <el-input v-model="afterSalesOrder.buyerRemark"></el-input>
      </el-form-item>
      <el-form-item label="客服备注">
        <el-input v-model="afterSalesOrder.sellerRemark"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="afterSalesOrder.phone"></el-input>
      </el-form-item>
      <el-form-item label="折扣">
        <el-input v-model="discount" type="number" :min="1" :max="10" class="w192" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="省市区" prop="cityArray">
          <el-cascader :options="cityOptions" :props="{value: 'label'}" v-model="afterSalesOrder.cityArray" class="w192" placeholder="请选择省市区">
          </el-cascader>
        </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="afterSalesOrder.address"></el-input>
      </el-form-item>
      <el-form-item label="固话" prop="telephone">
        <el-input v-model="afterSalesOrder.telephone"></el-input>
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-input v-model="afterSalesOrder.postcode"></el-input>
      </el-form-item>
    </section>
    <!-- 添加产品按钮 -->
    <div class="mgb15">
       <el-button type="success" @click="addProductFormVisible = true">添加产品</el-button>
    </div>
    <!-- 产品列表 -->
    <el-table :data="productInformation">
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column label="品牌" prop="brand"></el-table-column>
      <el-table-column label="规格" prop="model"></el-table-column>
      <el-table-column label="宽度" prop="width"></el-table-column>
      <el-table-column label="长度(元/米)">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.length" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="category"></el-table-column>
      <el-table-column label="单重" prop="weight"></el-table-column>
      <el-table-column label="单价" prop="retail_price"></el-table-column>
      <el-table-column label="数量" prop="amount">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.amount" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="总量" prop="allWeight"></el-table-column>
      <el-table-column label="总价" prop="allPrice"></el-table-column>
      <el-table-column label="维修价" prop="money" v-if="repair">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.money" size="mini" :min="1"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.$index)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加结算信息 -->
    <section>
      <div class="panel-heading">结算信息</div>
      <el-form-item label="总计金额">
        <el-input v-model="allPrice" :disabled="true"></el-input>
      </el-form-item>  
      <el-form-item label="邮费">
        <el-input v-model="postage" type="number"></el-input>
      </el-form-item>
      <el-form-item label="优惠金额">
        <el-input  v-model="discount_money" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="应收金额">
        <el-input v-model="receivable_money" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="afterSalesOrder.pay_type" class="w192">
          <el-option v-for="item in payTypes" :key="item.value" :lable="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票内容">
        <el-input v-model="afterSalesOrder.invoice_content"></el-input>
      </el-form-item>
      <el-form-item label="发票类型">
        <el-select v-model="afterSalesOrder.invoice_type" class="w192">
          <el-option v-for="item in invoiceTypes" :key="item.value" :lable="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票抬头">
        <el-input v-model="afterSalesOrder.invoice_title"></el-input>
      </el-form-item>
      <el-form-item label="货运方式">
        <el-select v-model="afterSalesOrder.transportation_model" class="w192">
          <el-option v-for="item in transportationModels" :key="item.value" :lable="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服备注">
        <el-input v-model="afterSalesOrder.service_remark"></el-input>
      </el-form-item>     
    </section>
    <div class="aftersale-footer">
      <el-button class="circle-btn" @click="resetForm">取消</el-button>
      <el-button class="circle-btn" type="primary" @click="handleSubmit('afterSalesOrder')">确定</el-button>
    </div>
    <!-- 添加产品页 -->
    <el-dialog custom-class="add-product-dialog box-shadow" :modal="false" title="添加产品" :modal-append-to-body="false" :visible.sync="addProductFormVisible" size="large">
      <add-product :goodsList="goodsList" @handleCloseDialog="handleCloseDialog"></add-product>
    </el-dialog>
  </el-form>
</template>

<script>
import AddProduct from '@/components/AddProduct'
import ProductSelect from '@/components/ProductSelect'
import cityOptions from '@/assets/scripts/city-data'
export default {
  name: 'aftersale-form',
  props: {
    'updatedForm': Object,
    'formTitle': String
  },
  components: {
    [AddProduct.name]: AddProduct,
    [ProductSelect.name]: ProductSelect
  },
  // 获取售后页传递过来的数据
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
  data() {
    return {
      // 售后单类型
      orderTypes: [{
        id: 1,
        value: '退货'
      }, {
        id: 2,
        value: '维修'
      }, {
        id: 3,
        value: '换货'
      }],
      // 售后单的类型
      afterSalesTypeId: 0,
      // 仓库数组
      commands: [],
      // 业务员数组
      salesmans: [],
      // 标记当前是新建还是编辑
      title: '',
      // 城市列表
      cityOptions: cityOptions,
      // 转账方式
      payTypes: [{
        value: '转账'
      }, {
        value: '微信'
      }, {
        value: '支付宝'
      }],
      // 发票类型
      invoiceTypes: [{
        value: '增值税发票'
      }, {
        value: '普票'
      }],
      // 产品数组
      productInformation: [],
      // 运输方式
      transportationModels: [{value: '快递'}, {value: '托运'}],
      // 表单验证规则
      rules: {
        order_type: { required: true, message: '请选择订单类型', trigger: 'change' },
        associatedOrders: [{required: true, message: '请输入关联订单', trigger: 'blur'}],
        afterSalesType: [{required: true, message: '选择售后单类型', trigger: 'change'}],
        warehouseName: [{required: true, message: '请选择仓库', trigger: 'blur'}],
        salesman: [{required: true, message: '请选择业务员', trigger: 'blur'}],
        name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        phone: { required: true, validator: this.$tool.validatePhone, trigger: 'blur' },
        discount: [{required: true, message: '请选择折扣', trigger: 'blur'}],
        cityArray: { type: 'array', required: true, message: '请选择省市区', trigger: 'change' },
        telephone: [{required: true, message: '请输入固话', trigger: 'blur'}],
        address: [{required: true, message: '请输入地址', trigger: 'blur'}],
        postcode: { required: true, validator: this.$tool.validatePostalCode, trigger: 'blur' },
        receivable_money: [{validator: this.$tool.validateNumber('输入应收金额'), trigger: 'blur'}],
        postage: [{validator: this.$tool.validateNumber('输入邮费'), trigger: 'blur'}],
        discount_money: [{validator: this.$tool.validateNumber('输入优惠金额'), trigger: 'blur'}],
        actual_money: [{validator: this.$tool.validateNumber('输入实际金额'), trigger: 'blur'}],
        pay_type: [{required: true, message: '请输入支付方式', trigger: 'blur'}],
        invoice_type: [{required: true, message: '请输入发票类型', trigger: 'blur'}],
        invoice_title: [{required: true, message: '请输入发票抬头', trigger: 'blur'}],
        invoice_content: [{required: true, message: '请输入发票内容', trigger: 'blur'}],
        sellerRemark: [{ required: true, message: '请输入客服留言', trigger: 'blur' }],
        transportation_model: [{required: true, message: '请输入货运方式', trigger: 'blur'}]
      },
      // 添加产品页面
      addProductFormVisible: false,
      // 产品列表
      goodsList: [],
      // 顾客列表
      restaurants: [],
      // 维修金额是否显示
      repair: false,
      // 是否输入了维修金额
      addRepair: false,
      // 存储输入的信息
      afterSalesOrder: {},
      // 商品总价
      allPrice: 0,
      // 实际应收金额
      receivable_money: 0,
      // 邮费
      postage: 0,
      // 折扣
      discount: 10,
      // 优惠金额
      discount_money: 0
    }
  },
  methods: {
    // 获取业务员
    querySalesmans() {
      this.$tool.common(this, 'user/findPosition', {
        'position': '销售'
      }, bodyInfo => {
        this.salesmans = bodyInfo.UserList.map(item => ({ label: item.name, value: item.name }))
      })
    },
    // 根据售后单类型id，找到对应的售后单类型
    handleDashBoard(command) {
      console.log(typeof command)
      this.afterSalesTypeId = command
      for (let i = 0; i < this.orderTypes.length; i++) {
        if (this.orderTypes[i].id === command) {
          this.afterSalesOrder.afterSalesType = this.orderTypes[i].value
        }
      }
    },
    // 售后单类型改变时，根据改变的类型找到对应的售后单类型的id
    selectChange(val) {
      // console.log(val)
      for (let i = 0; i < this.orderTypes.length; i++) {
        if (this.orderTypes[i].value === val) {
          this.afterSalesTypeId = this.orderTypes[i].id
        }
      }
      if (val === '维修') {
        // 如果售后单类型是维修,显示输入维修金的输入框
        this.repair = true
      } else {
        // 如果售后单类型不是维修,隐藏输入维修金的输入框
        this.repair = false
      }
    },
    // 获取仓库列表
    queryShop() {
      this.$tool.loadOptions(this, 'warehouse/select', bodyInfo => {
        this.commands = bodyInfo.WarehouseList
      })
    },
    // 搜索建议
    querySearch(queryString, cb) {
      this.$tool.querySearch(this, queryString, cb)
    },
    // 当选择名字时,在对应位置填上已有的信息
    handleSelect(item) {
      // 地址信息
      this.afterSalesOrder.address = item.address
      // 电话
      this.afterSalesOrder.telephone = item.telephone
      // 手机
      this.afterSalesOrder.phone = item.phone
    },
    // 获取客户信息,
    queryCustomer() {
      this.$tool.loadOptions(this, 'customer/list', bodyInfo => {
        this.restaurants = bodyInfo.info.map(item => {
          return {
            value: item.name,
            address: item.address,
            telephone: item.telephone,
            phone: item.phone
          }
        })
      })
    },
    // 关闭产品添加页时,添加个别信息默认值
    handleCloseDialog(val) {
      this.goods = val.map(item => {
        return {
          // 数量
          amount: 1,
          // 优惠金额
          discount_rice: 0,
          // 总重
          all_weight: 0,
          // 折扣
          discount: 0,
          ...item
        }
      })
    },
    // 删除一行
    handleDelete(index) {
      this.productInformation.splice(index, 1)
    },
    // 关闭当前页面
    resetForm() {
      this.$parent.$parent.dialogVisible = false
      this.$parent.$parent.handleCloseForm()
    },
    // 售后类型为维修时，检查是否有产品没有输入维修金
    addMoney() {
      // 售后类型为维修时
      if (this.afterSalesOrder.afterSalesType === '维修') {
        for (let i = 0; i < this.productInformation.length; i++) {
          if (!this.productInformation[i].money) {
            // 有产品没有添加维修金，提示信息
            this.$message.error('输入维修金额')
            // 不通过
            this.addRepair = false
            break
          }
          if (i === this.productInformation.length - 1) {
            // 产品全都添加了维修金，通过
            this.addRepair = true
          }
        }
      } else {
        // 售后类型不为维修时，通过
        this.addRepair = true
      }
    },
    // 确认添加或修改信息
    handleSubmit(formName) {
      // 检查是否通过
      this.addMoney()
      this.$refs[formName].validate(valid => {
        // 输入的信息和维修金是否合格
        if (valid && this.addRepair) {
          if (this.afterSalesTypeId !== '') {
            // 获取当前页面是新建还是编辑
            this.title = window.sessionStorage.getItem('formTitle')
            // 根据信息，选择不同接口
            let url = this.title === '新建售后单' ? 'afterSalesOrder/create' : 'afterSalesOrder/update'
            this.$http.post(url, {
              'body': {
                'user_name': this.$store.getters.getAccount.name,
                ...this.afterSalesOrder,
                'after_sales_number': this.afterSalesOrder.afterSalesNumber,
                'associated_order': this.afterSalesOrder.associatedOrders,
                'associated_orders': this.afterSalesOrder.associatedOrders,
                'afterSales_type': '' + this.afterSalesTypeId,
                'warehouse_name': this.afterSalesOrder.warehouseName,
                'buyer_remark': this.afterSalesOrder.buyerRemark,
                'actual_money': '' + this.allPrice,
                'cityArray': this.afterSalesOrder.cityArray,
                'province': this.afterSalesOrder.cityArray[0],
                'city': this.afterSalesOrder.cityArray[1],
                'area': this.afterSalesOrder.cityArray[2],
                'receivable_money': '' + this.receivable_money,
                'discount_money': this.discount_money,
                'postage': this.postage,
                'seller_remark': this.afterSalesOrder.sellerRemark,
                'aftergoods_list': this.productInformation
              }
            }).then(res => {
              // 添加成功，关闭页面
              this.$parent.$parent.dialogVisible = false
              // 刷新
              this.$parent.$parent.getList()
            }).catch(res => {
              // 如果添加失败
              console.log(res)
            })
          } else if (!valid) {
            // 如果售后单类型没选择
            this.$message.error('选择售后单类型')
          } else if (!this.addRepair) {
            // 如果维修金额没输入
            this.$message.error('输入维修金额')
          }
        }
      })
    },
    // 根据售后页传递过来的after_sales_number查找信息
    getAfterSalesOrderGoods() {
      this.$http.post('afterSalesOrder/find', {
        'body': {
          'pageIndex': 1,
          'pageSize': 1000,
          'after_sales_number': this.form.after_sales_number
        }
      }).then(res => {
        // 查找成功之后，对数据键名重命名
        let goodsList = res.data.body.afterSalesOrderGoodsList
        for (let i = 0; i < goodsList.length; i++) {
          goodsList[i].goods_uuid = goodsList[i].goodsUuid
          goodsList[i].goods_name = goodsList[i].goodsName
          goodsList[i].brand_uuid = goodsList[i].brandUuid
          goodsList[i].category_uuid = goodsList[i].categoryUuid
          goodsList[i].warehouse_name = goodsList[i].warehouseName
          goodsList[i].retail_price = goodsList[i].retailPrice
          goodsList[i].weight = goodsList[i].oneWeight
          goodsList[i].money = 0
          goodsList[i].allPrice = goodsList[i].retail_price * goodsList[i].amount
          this.allPrice += goodsList[i].allPrice
        }
        this.productInformation = goodsList
        // 售后单类型
        this.afterSalesOrder = res.data.body.afterSalesOrder
        // 售后单id
        this.afterSalesTypeId = this.afterSalesOrder.afterSalesType
        // 根据售后单类型id，选择售后单类型，显示
        this.handleDashBoard(this.afterSalesTypeId)
        // 显示省市县
        this.afterSalesOrder.cityArray = [this.afterSalesOrder.province, this.afterSalesOrder.city, this.afterSalesOrder.area]
      }).catch(res => {
        console.log(res)
      })
    }
  },
  mounted() {
    // 获取顾客信息
    this.queryCustomer()
    // 获取仓库名
    this.queryShop()
    // 获取操作员
    this.querySalesmans()
    // 当此页面为编辑售后单时
    if (window.sessionStorage.getItem('formTitle') === '编辑售后单') {
      // 获取该number的信息
      this.getAfterSalesOrderGoods()
      // 标记当前页面
      this.title = window.sessionStorage.getItem('formTitle')
    }
  },
  watch: {
    // 当邮费变化时，实际金额刷新
    postage: function(va, old) {
      this.receivable_money += (this.postage - 0)
    },
    // 当折扣变化时，实际金额刷新
    discount: function(val, old) {
      this.receivable_money = this.receivable_money * val / 10
    },
    // 当产品信息改变时
    productInformation: {
      handler: function (val, oldVal) {
        this.allPrice = 0
        this.receivable_money = 0
        this.discount_money = 0
        val.forEach(item => {
          item.allPrice = (item.retail_price * item.amount)
          item.allWeight = (item.weight * item.amount)
          // 刷新总金额
          this.allPrice += item.allPrice
          // 刷新实际金额
          if (item.money) {
            this.receivable_money = this.allPrice * this.discount / 10
            this.receivable_money -= item.money
          } else {
            this.receivable_money = this.allPrice * this.discount / 10
          }
        })
        // 刷新优惠金额
        if (this.allPrice > this.receivable_money) {
          this.discount_money = this.allPrice - this.receivable_money
        } else {
          this.discount_money = 0
        }
      },
      deep: true
    },
    form: {
      // 当售后页传递过来的信息变化时
      handler: function (val, oldVal) {
        // 当前页为编辑时
        if (window.sessionStorage.getItem('formTitle') === '编辑售后单' && val.after_sales_number) {
          // 重新获取售后单信息
          this.getAfterSalesOrderGoods()
        } else {
          // 当前页为新建时，清空页面
          this.form = {}
          this.productInformation = []
          this.afterSalesOrder = {}
        }
        // 标记当前页的信息
        this.title = window.sessionStorage.getItem('formTitle')
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.aftersale-footer {
  text-align: center;
  margin-top: 60px;
  .el-button+.el-button {
    margin-left: 20px;
  }
}
</style>