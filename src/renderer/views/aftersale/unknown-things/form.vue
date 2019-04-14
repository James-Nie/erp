<template>
  <div>
    <el-form ref="nameless" :rules="rules" :model="nameless" :inline="true" label-width="90px">
      <!-- 输入基本信息 -->
      <div class="panel-heading">基本信息</div>
      <section class="panel-section">
        <!-- 如果是编辑，则显示 -->
        <el-form-item label="编号" prop="namelessNumber" v-if="title === '编辑无名件'">
          <el-input v-model="nameless.namelessNumber" placeholder="编号" :disabled="title === '编辑无名件'"></el-input>
        </el-form-item>
        <el-form-item label="快递编号" prop="waybillNumber">
          <el-input v-model="nameless.waybillNumber" placeholder="快递编号"></el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseName">
          <el-select v-model="nameless.warehouseName" placeholder="仓库" class="w192">
           <el-option v-for="item in materialWarehouses" :key="item.warehouseUuid" :label="item.label" :value="item.warehouseName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库位" prop="address">
          <el-input v-model="nameless.address"></el-input>
        </el-form-item>
        <el-form-item label="寄件人" prop="sender">
         <el-input v-model="nameless.sender"></el-input>
        </el-form-item>  
        <!-- 编辑无名件时显示 -->
        <el-form-item label="关联订单" prop="associatedOrders" v-if="title === '编辑无名件'">
        <el-input v-model="nameless.associatedOrders" class="w192"></el-input>
      </el-form-item>
      <el-form-item label="售后单类型" prop="afterSalesType">
       <el-select v-model="nameless.afterSalesType" class="w192" @change="selectChange">
          <el-option v-for="item in orderTypes" :key="item.id"  :lable="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> 
        <el-form-item label="总计金额" prop="allPrice">
        <el-input v-model="allPrice" :disabled="true"></el-input>
      </el-form-item>                        
      </section>
      <!-- 编辑无名件时显示 -->
      <section v-if="title === '编辑无名件'">
      <div class="panel-heading">客户信息</div>
      <el-form-item label="姓名" prop="name">
        <el-autocomplete v-model="nameless.name" :fetch-suggestions="querySearch" placeholder="请输入姓名" @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item label="买家留言">
        <el-input v-model="nameless.buyerRemark"></el-input>
      </el-form-item>
      <el-form-item label="客服备注">
        <el-input v-model="nameless.sellerRemark"></el-input>
      </el-form-item> 
      <el-form-item label="手机" prop="phone">
        <el-input v-model="nameless.phone"></el-input>
      </el-form-item>
      <el-form-item label="省市区" prop="cityArray">
          <el-cascader :options="cityOptions" :props="{value: 'label'}" v-model="nameless.cityArray" class="w192" placeholder="请选择省市区">
          </el-cascader>
        </el-form-item>
      <el-form-item label="地址" prop="location">
        <el-input v-model="nameless.location"></el-input>
      </el-form-item>
      <el-form-item label="固话" prop="telephone">
        <el-input v-model="nameless.telephone"></el-input>
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-input v-model="nameless.postcode"></el-input>
      </el-form-item>           
    </section>
      <!-- 添加产品 -->
      <div class="mgb15">
        <el-button type="success" @click="addProductFormVisible = true" v-show="title !== '编辑无名件'">添加产品</el-button>
      </div>
      <!-- 产品列表 -->
      <el-table :data="productInformation">
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column label="品牌" prop="brand"></el-table-column>
      <el-table-column label="规格" prop="model"></el-table-column>
      <el-table-column label="宽度" prop="width"></el-table-column>
      <el-table-column label="长度(元/米)">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.length" size="mini" :disabled="title === '编辑无名件'"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="category"></el-table-column>
      <el-table-column label="单重" prop="weight"></el-table-column>
      <el-table-column label="单价" prop="retailPrice"></el-table-column>
      <el-table-column label="数量" prop="amount">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.amount" size="mini" :disabled="title === '编辑无名件'"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="总量" prop="allWeight"></el-table-column>
      <el-table-column label="总价" prop="allPrice"></el-table-column>
      <!-- 类型为维修时显示 -->
      <el-table-column label="维修价" prop="money" v-if="repair">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.money" size="mini" :min="1"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.$index)" size="mini"  :disabled="title === '编辑无名件'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-form>
    <!-- 对此页面的操作 -->
    <div class="order-form-btn">
      <el-button class="circle-btn" type="primary" @click="handleSubmit('nameless')">保存</el-button>
      <el-button class="circle-btn" @click='callback'>取消</el-button>
    </div>
    <!-- 添加产品页 -->
    <el-dialog custom-class="add-product-dialog box-shadow" :modal="false" title="添加产品" :modal-append-to-body="false" :visible.sync="addProductFormVisible" size="large">
      <add-product :goodsList="goodsList" @handleCloseDialog="handleCloseDialog"></add-product>
    </el-dialog>
  </div>
</template>

<script>
import AddProduct from '@/components/AddProduct'
import ProductSelect from '@/components/ProductSelect'
import cityOptions from '@/assets/scripts/city-data'
export default {
  name: 'unknownthings-form',
  components: {
    [AddProduct.name]: AddProduct,
    [ProductSelect.name]: ProductSelect
  },
  props: {
    updatedForm: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 产品列表
      productInformation: [],
      // 获取商店列表
      storeOptions: [],
      // 获取仓库列表
      materialWarehouses: [],
      // 发票类型
      invoiceTypes: [{
        value: '增值税发票'
      }, {
        value: '普票'
      }],
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
      // 是否显示添加维修金额
      repair: false,
      // 售后单id
      afterSalesTypeId: '',
      // 支付类型
      payTypes: [{
        value: '转账'
      }, {
        value: '微信'
      }, {
        value: '支付宝'
      }],
      // 操作人
      salesmans: [],
      // 城市
      cityOptions: cityOptions,
      // 运输方式
      transportationModels: [{value: '快递'}, {value: '托运'}],
      // 验证规则
      rules: {
        address: [{ required: true, message: '请选择库位', trigger: 'change' }],
        namelessNumber: [{ required: true, message: '请输入编号', trigger: 'change' }],
        associatedOrders: [{required: true, message: '请输入关联订单', trigger: 'blur'}],
        waybillNumber: [{ required: true, message: '请输入快递编号', trigger: 'change' }],
        warehouseName: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        sender: [{ required: true, message: '请输入寄件人', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sellerRemark: [{ required: true, message: '请输入客服留言', trigger: 'blur' }],
        phone: { required: true, validator: this.$tool.validatePhone, trigger: 'blur' },
        discount: [{required: true, message: '请输入0--10之间的整数', trigger: 'blur'}],
        cityArray: { type: 'array', required: true, message: '请选择省市区', trigger: 'change' },
        telephone: [{required: true, message: '请输入固话', trigger: 'blur'}],
        location: [{required: true, message: '请输入地址', trigger: 'blur'}],
        postcode: { required: true, validator: this.$tool.validatePostalCode, trigger: 'blur' },
        receivable_money: [{required: true, validator: this.$tool.validateNumber('输入应收金额'), trigger: 'blur'}],
        postage: [{required: true, validator: this.$tool.validateNumber('输入邮费'), trigger: 'blur'}],
        discount_money: [{required: true, validator: this.$tool.validateNumber('输入优惠金额'), trigger: 'blur'}],
        actual_money: [{required: true, validator: this.$tool.validateNumber('输入实际金额'), trigger: 'blur'}],
        pay_type: [{required: true, message: '请输入支付方式', trigger: 'blur'}],
        invoice_type: [{required: true, message: '请输入发票类型', trigger: 'blur'}],
        invoice_title: [{required: true, message: '请输入发票抬头', trigger: 'blur'}],
        invoice_content: [{required: true, message: '请输入发票内容', trigger: 'blur'}],
        transportation_model: [{required: true, message: '请输入货运方式', trigger: 'blur'}]
      },
      // 控制添加产品是否显示
      addProductFormVisible: false,
      // 货品列表
      goodsList: [],
      // 存储输入的信息
      nameless: {},
      // 标记当前页面是新建还是编辑
      title: window.sessionStorage.getItem('formTitle'),
      // 总价
      allPrice: 0,
      // 对维修单，是否通过
      addRepair: false
    }
  },
  // 获取无名件页面传递过来的数据
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
  methods: {
    // 关闭页面，清空数据
    callback() {
      this.$parent.$parent.handleCloseForm()
    },
    // 通过遍历售后单类型，通过售后单类型，找到对应的售后单类型id
    selectChange(val) {
      // console.log(val)
      for (let i = 0; i < this.orderTypes.length; i++) {
        if (this.orderTypes[i].value === val) {
          this.afterSalesTypeId = this.orderTypes[i].id
        }
      }
      if (val === '维修') {
        // 如果售后单为维修，显示维修金额输入框
        this.repair = true
      } else {
        // 否则，隐藏维修金额输入框
        this.repair = false
      }
    },
    // 获取仓库
    _loadWarehouses() {
      this.$tool.loadOptions(this, 'warehouse/select', bodyInfo => {
        this.materialWarehouses = bodyInfo.WarehouseList
      })
    },
    // 获取操作人
    querySalesmans() {
      this.$tool.common(this, 'user/findPosition', {
        'position': '销售'
      }, bodyInfo => {
        this.salesmans = bodyInfo.UserList.map(item => ({ label: item.name, value: item.name }))
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
    // 删除第index行
    handleDelete(index) {
      this.productInformation.splice(index, 1)
    },
    // 如果是维修单，检查是否输入维修金额
    addMoney() {
      // 判断是维修单
      if (this.nameless.afterSalesType === '维修') {
        for (let i = 0; i < this.productInformation.length; i++) {
          // 遍历如果有没输入的，不允许通过
          if (!this.productInformation[i].money) {
            this.$message.error('输入维修金额')
            this.addRepair = false
            break
          }
          // 遍历如果没有没输入的，允许通过
          if (i === this.productInformation.length - 1) {
            this.addRepair = true
          }
        }
      } else {
        // 如果不是维修单，允许通过
        this.addRepair = true
      }
    },
    handleSubmit(formName) {
      // 如果是维修单，检查是否输入维修金额
      this.addMoney()
      this.$refs[formName].validate((valid) => {
        // 输入是否合格
        if (valid && this.addRepair) {
          if (this.productInformation.length > 0) {
            this.title = window.sessionStorage.getItem('formTitle')
            // 根据信息，选择不同接口
            let url = this.title === '编辑无名件' ? 'nameless/update' : 'nameless/create'
            let data
            // 根据接口不同 ，传输不同数据
            if (this.title === '编辑无名件') {
              if (this.afterSalesTypeId !== '') {
                data = {
                  'user_name': this.$store.getters.getAccount.name,
                  'nameless_number': this.nameless.namelessNumber,
                  'waybill_number': this.nameless.waybillNumber,
                  'associated_order': this.nameless.associatedOrders,
                  'afterSales_type': this.afterSalesTypeId,
                  'actual_money': this.allPrice,
                  'warehouse_name': this.nameless.warehouseName,
                  'salesman': this.nameless.sender,
                  'sender': this.nameless.sender,
                  'name': this.nameless.name,
                  'phone': this.nameless.phone,
                  'province': this.nameless.cityArray[0],
                  'city': this.nameless.cityArray[1],
                  'area': this.nameless.cityArray[2],
                  'telephone': this.nameless.telephone,
                  'address': this.nameless.location,
                  'buyer_remark': this.nameless.buyerRemark,
                  'seller_remark': this.nameless.sellerRemark,
                  'postcode': this.nameless.postcode,
                  'receivable_money': this.allPrice,
                  'postage': this.nameless.postage,
                  'nameless_goods_list': this.productInformation
                }
              } else {
                this.$message.error('选择售后单类型')
              }
            } else {
              data = {
                'user_name': this.$store.getters.getAccount.name,
                'nameless_number': this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999),
                'waybill_number': this.nameless.waybillNumber,
                'warehouse_name': this.nameless.warehouseName,
                'address': this.nameless.address,
                'sender': this.nameless.sender,
                'nameless_goods_list': this.productInformation
              }
            }
            if (data) {
              this.$http.post(url, {
                'body': data
              }).then(res => {
                // 添加成功，关闭页面
                this.$tool.parentComponents(this, 'UnknownThings').addFormVisible = false
                this.$tool.parentComponents(this, 'UnknownThings').getList()
              }).catch(res => {
                console.log(res)
              })
            }
          } else {
            // 产品列表为空
            this.$message.error('请选择产品')
          }
        } else if (!valid) {
          // 输入不合规范
          console.log('error submit!!')
          return false
        } else if (!this.addRepair) {
          this.$message.error('输入维修金额')
        }
      })
    },
    // 搜索建议
    querySearch(queryString, cb) {
      this.$tool.querySearch(this, queryString, cb)
    },
    // 根据名字不同，在对应位置填写对应信息
    handleSelect(item) {
      this.nameless.location = item.address
      this.nameless.telephone = item.telephone
      this.nameless.phone = item.phone
    },
    // 获取顾客信息
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
    // 编辑无名件时，获取对应的信息
    getgoodsList() {
      this.$http.post('nameless/find', {
        'body': {
          'nameless_number': this.form.nameless_number
        }
      }).then(res => {
        console.log(res)
        let goodsList = res.data.body.namelessGoodsList
        for (let i = 0; i < goodsList.length; i++) {
          goodsList[i].goods_uuid = goodsList[i].goodsUuid
          goodsList[i].goods_name = goodsList[i].goodsName
          goodsList[i].brand_uuid = goodsList[i].brandUuid
          goodsList[i].category_uuid = goodsList[i].categoryUuid
          goodsList[i].warehouse_name = goodsList[i].warehouseName
          goodsList[i].retail_price = goodsList[i].retailPrice
          goodsList[i].weight = goodsList[i].oneWeight
          goodsList[i].allPrice = goodsList[i].retailPrice * goodsList[i].amount
          this.allPrice += goodsList[i].allPrice
        }
        this.productInformation = goodsList
        this.nameless = res.data.body.nameless
      }).catch(res => {
        console.log(res)
      })
    }
  },
  mounted() {
    // 获取操作人
    this.querySalesmans()
    // 获取仓库列表
    this._loadWarehouses()
    // 获取顾客
    this.queryCustomer()
    // 如果是编辑，获取该无名件信息
    if (window.sessionStorage.getItem('formTitle') === '编辑无名件') {
      this.getgoodsList()
    }
    // console.log(this.$moment().format('YYYYMMDDHHmmss') + Math.floor(10000 + Math.random() * 89999))
  },
  watch: {
    productInformation: {
      // 如果产品发生变化
      handler: function (val, oldVal) {
        // 刷新总额
        this.allPrice = 0
        val.forEach(item => {
          item.allPrice = (item.retail_price * item.amount)
          item.allWeight = (item.weight * item.amount)
          this.allPrice += item.allPrice
        })
      },
      deep: true
    },
    form: {
      // 如果无名件传递过来的数据发生变化
      handler: function (val, oldVal) {
        // 编辑，刷新
        if (window.sessionStorage.getItem('formTitle') === '编辑无名件' && val.nameless_number) {
          this.getgoodsList()
        } else {
          // 新建，清除
          this.form = {}
          this.productInformation = []
          this.nameless = {}
        }
        // 标记无名件
        this.title = window.sessionStorage.getItem('formTitle')
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