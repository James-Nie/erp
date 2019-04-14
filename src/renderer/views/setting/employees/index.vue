<template>
  <div>
    <div class="mgb15">
      <el-button type="success" @click="handlePopupForm('add')"><i class="iconfont  "></i>新建</el-button>
      <el-button type="success" @click="handlePopupForm('edit')" :disabled="multipleSelection.length !== 1"><i class="iconfont icon-icon07"></i>编辑</el-button>
      <el-button type="danger" icon="delete2" @click="handleDelete">删除</el-button>
      <el-button type="primary" @click="exportExcel"><i class="iconfont icon-daochu"></i>导出</el-button>
    </div>
    <el-table :data="userList" v-loading="loading" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="序号" type="index" width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="department" label="部门" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="移动电话" align="center">
      </el-table-column>
      <el-table-column prop="wangwang" label="旺旺" align="center">
      </el-table-column>
      <el-table-column prop="qq" label="QQ" align="center">
      </el-table-column>
      <el-table-column prop="email" label="Email" align="center" width="180">
      </el-table-column>
      <el-table-column label="是否停用" align="center" :formatter="$formatter.formatDisable">
      </el-table-column>
      <el-table-column label="打卡时间" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="queryClockRecord(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" :formatter="$formatter.formatTime('createDatetime')" width="180">
      </el-table-column>
      <el-table-column label="修改时间" align="center" :formatter="$formatter.formatTime('updateDatetime')" width="180">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :paeg-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog custom-class="staff-management-dialog" :title="formTitle" :visible.sync="staffManagementVisible" size="full" @close="resetForm('form')">
      <!--<staff-management-form ref="staff-management-form" :updatedForm="form" :formTitle="formTitle" :permissionsForm="permissionsForm" @resetForm="resetForm" @submit="handleSubmit"></staff-management-form>-->
    	<EmployeesForm ref="EmployeesForm" :updatedForm="form" :formTitle="formTitle" :permissionsForm="permissionsForm" @resetForm="resetForm" @submit="handleSubmit"></EmployeesForm>
    </el-dialog>
    <el-dialog title="打卡记录" v-loading="clockRecordLoading" :visible.sync="clockRecordVisible">
      <el-table :data="userClockList" stripe style="width: 100%">
        <el-table-column prop="date" label="日期" align="center">
        </el-table-column>
        <el-table-column label="上午" :formatter="$formatter.formatTime('clockOnetime')" align="center">
        </el-table-column>
        <el-table-column label="下午" :formatter="$formatter.formatTime('clockTwotime')" align="center">
        </el-table-column>
      </el-table>
      <div class="toolbar clearfix">
        <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import EmployeesForm from './form'
export default {
  name: 'employees-management',
  components: {
    [EmployeesForm.name]: EmployeesForm
  },
  data() {
    return {
      loading: false,
      staffManagementVisible: false,
      clockRecordVisible: false,
      clockRecordLoading: false,
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      paginationOfRecord: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      multipleSelection: [],
      userList: [],
      userClockList: [],
      form: {
//      userId: '',
        name: '',
        sex: '',
        birthday: '',
        nation: '',
        maritalStatus: '',
        phone: '',
        wangwang: '',
        qq: '',
        email: '',
        card: '',
        contacts: '',
        telephone: '',
        school: '',
        education: '',
        graduationTime: '',
        hiredate: '',
        department: '',
        archivesLocation: '',
        registLocation: '',
        remark: '',
        disable: 1,
        account: '',
        password: '',
        userType: '',
        role: '',
        huaming: ''
      },
      permissionsForm: {},
      formTitle: '新建员工'
    }
  },
  methods: {
    // 根据新建或编辑的不同,请求不同的数据
    handleSubmit(formName) {
      let url = this.formTitle === '新建员工' ? 'user/create' : 'user/update'
      this.$tool.common(this, url, {
        ...this.form
//      ...this.permissionsForm
      }, bodyInfo => {
        this.resetForm(formName)
        this._loadMainList()
      })
    },
    queryClockRecord(row) {
      this.clockRecordVisible = true
      this.$tool.common(this, 'user/clockRecord', {
        'user_uuid': row.userUuid,
        ...this.paginationOfRecord
      }, bodyInfo => {
        this.userClockList = bodyInfo.UserClockList
      })
    },
    // 新建或者编辑员工,根据formTitle不同,向下个页面传递不同参数
    handlePopupForm(formName) {
      if (formName === 'add') {
        this.formTitle = '新建员工'
      } else if (formName === 'edit') {
        if (this.multipleSelection.length === 1) {
          let updatedForm = this.multipleSelection[0]
          console.log(updatedForm)
          this.form = Object.assign({}, {
            userId: updatedForm.userId,
            name: updatedForm.name,
            account: updatedForm.account,
            password: updatedForm.password,
            phone: updatedForm.phone,
            sex: updatedForm.sex,
            birthday: updatedForm.birthday && this.$moment(new Date(updatedForm.birthday)).format('YYYY-MM-DD'),
            nation: updatedForm.nation,
            maritalStatus: updatedForm.maritalStatus,
            wangwang: updatedForm.wangwang,
            qq: updatedForm.qq,
            email: updatedForm.email,
            card: updatedForm.card,
            contacts: updatedForm.contacts,
            telephone: updatedForm.telephone,
            school: updatedForm.school,
            education: updatedForm.education,
            graduationTime: updatedForm.graduationTime && this.$moment(new Date(updatedForm.graduationTime)).format('YYYY-MM-DD'),
            hiredate: updatedForm.hiredate && this.$moment(new Date(updatedForm.hiredate)).format('YYYY-MM-DD'),
            archivesLocation: updatedForm.archivesLocation,
            registLocation: updatedForm.registLocation,
            remark: updatedForm.remark,
            disable: updatedForm.disable,
            department: updatedForm.department,
            userType: updatedForm.userType,
        		role: updatedForm.role,
        		huaming: updatedForm.huaming
          })
          this.$tool.common(this, 'user/find', {
            'account': updatedForm.account
          }, bodyInfo => {
            let jurisdiction = bodyInfo.jurisdiction
            this.permissionsForm = {
              goods_read: jurisdiction.goodsRead,
              goods_write: jurisdiction.goodsWrite,
              brand_manage_read: jurisdiction.brandManageRead,
              brand_manage_write: jurisdiction.brandManageWrite,
              saw_manage_read: jurisdiction.sawManageRead,
              saw_manage_write: jurisdiction.sawManageWrite,
              goods_classify_read: jurisdiction.goodsClassifyRead,
              goods_classify_write: jurisdiction.goodsClassifyWrite,
              goods_archive_read: jurisdiction.goodsArchiveRead,
              goods_archive_write: jurisdiction.goodsArchiveWrite,
              code_read: jurisdiction.codeRead,
              code_write: jurisdiction.codeWrite,
              price_list_read: jurisdiction.priceListRead,
              price_list_write: jurisdiction.priceListWrite,
              order_read: jurisdiction.orderRead,
              order_write: jurisdiction.orderWrite,
              order_manage_read: jurisdiction.orderManageRead,
              order_manage_write: jurisdiction.orderManageWrite,
              order_audit_read: jurisdiction.orderAuditRead,
              order_audit_write: jurisdiction.orderAuditWrite,
              after_sales_read: jurisdiction.afterSalesRead,
              after_sales_write: jurisdiction.afterSalesWrite,
              nameless_part_read: jurisdiction.namelessPartRead,
              nameless_part_write: jurisdiction.namelessPartWrite,
              financial_audit_read: jurisdiction.financialAuditRead,
              financial_audit_write: jurisdiction.financialAuditWrite,
              return_goods_manage_read: jurisdiction.returnGoodsManageRead,
              return_goods_manage_write: jurisdiction.returnGoodsManageWrite,
              repair_gathering_read: jurisdiction.repairGatheringRead,
              repair_gathering_write: jurisdiction.repairGatheringWrite,
              deliver_read: jurisdiction.deliverRead,
              deliver_write: jurisdiction.deliverWrite,
              delivery_manage_read: jurisdiction.deliveryManageRead,
              delivery_manage_write: jurisdiction.deliveryManageWrite,
              purchase_read: jurisdiction.purchaseRead,
              purchase_write: jurisdiction.purchaseWrite,
              purchase_list_manage_read: jurisdiction.purchaseListManageRead,
              purchase_list_manage_write: jurisdiction.purchaseListManageWrite,
              supplier_manage_read: jurisdiction.supplierManageRead,
              supplier_manage_write: jurisdiction.supplierManageWrite,
              supplier_goods_read: jurisdiction.supplierGoodsRead,
              supplier_goods_write: jurisdiction.supplierGoodsWrite,
              purchase_list_audit_read: jurisdiction.purchaseListAuditRead,
              purchase_list_audit_write: jurisdiction.purchaseListAuditWrite,
              stock_read: jurisdiction.stockRead,
              stock_write: jurisdiction.stockWrite,
              stock_manage_read: jurisdiction.stockManageRead,
              stock_manage_write: jurisdiction.stockManageWrite,
              warehouse_manage_read: jurisdiction.warehouseManageRead,
              warehouse_manage_write: jurisdiction.warehouseManageWrite,
              finance_read: jurisdiction.financeRead,
              finance_write: jurisdiction.financeWrite,
              receivable_manage_read: jurisdiction.receivableManageRead,
              receivable_manage_write: jurisdiction.receivableManageWrite,
              payable_manage_read: jurisdiction.payableManageRead,
              payable_manage_write: jurisdiction.payableManageWrite,
              invoice_manage_read: jurisdiction.invoiceManageRead,
              invoice_manage_write: jurisdiction.invoiceManageWrite,
              crm_read: jurisdiction.crmRead,
              crm_write: jurisdiction.crmWrite,
              customer_file_read: jurisdiction.customerFileRead,
              customer_file_write: jurisdiction.customerFileWrite,
              member_manage_read: jurisdiction.memberManageRead,
              member_manage_write: jurisdiction.memberManageWrite,
              statistics_read: jurisdiction.statisticsRead,
              statistics_write: jurisdiction.statisticsWrite,
              purchase_statistics_read: jurisdiction.purchaseStatisticsRead,
              purchase_statistics_write: jurisdiction.purchaseStatisticsWrite,
              order_statistics_read: jurisdiction.orderStatisticsRead,
              order_statistics_write: jurisdiction.orderStatisticsWrite,
              stock_statistics_read: jurisdiction.stockStatisticsRead,
              stock_statistics_write: jurisdiction.stockStatisticsWrite,
              achievement_statistics_read: jurisdiction.achievementStatisticsRead,
              achievement_statistics_write: jurisdiction.achievementStatisticsWrite,
              sale_statistics_read: jurisdiction.saleStatisticsRead,
              sale_statistics_write: jurisdiction.saleStatisticsWrite,
              workshop_statistics_read: jurisdiction.workshopStatisticsRead,
              workshop_statistics_write: jurisdiction.workshopStatisticsWrite,
              financial_statistics_read: jurisdiction.financialStatisticsRead,
              financial_statistics_write: jurisdiction.financialStatisticsWrite,
              after_sales_statistics_read: jurisdiction.afterSalesStatisticsRead,
              after_sales_statistics_write: jurisdiction.afterSalesStatisticsWrite,
              setting_read: jurisdiction.settingRead,
              setting_write: jurisdiction.settingWrite,
              account_setting_read: jurisdiction.accountSettingRead,
              account_setting_write: jurisdiction.accountSettingWrite,
              employee_manage_read: jurisdiction.employeeManageRead,
              employee_manage_write: jurisdiction.employeeManageWrite,
              store_manage_read: jurisdiction.storeManageRead,
              store_manage_write: jurisdiction.storeManageWrite,
              strategy_setting_read: jurisdiction.strategySettingRead,
              strategy_setting_write: jurisdiction.strategySettingWrite,
              logistics_setting_read: jurisdiction.logisticsSettingRead,
              logistics_setting_write: jurisdiction.logisticsSettingWrite,
              print_setting_read: jurisdiction.printSettingRead,
              print_setting_write: jurisdiction.printSettingWrite,
              cancel_account_read: jurisdiction.cancelAccountRead,
              cancel_account_write: jurisdiction.cancelAccountWrite
            }
          })
        }
        this.formTitle = '编辑员工'
      }
      this.staffManagementVisible = true
    },
    // 清空数据,重置权限
    resetForm(formName) {
      this.form = {
//      userId: '',
        name: '',
        account: '',
        password: '',
        phone: '',
        sex: '',
        birthday: '',
        nation: '',
        maritalStatus: '',
        wangwang: '',
        qq: '',
        email: '',
        card: '',
        contacts: '',
        telephone: '',
        school: '',
        education: '',
        graduationTime: '',
        hiredate: '',
        archivesLocation: '',
        registLocation: '',
        remark: '',
        disable: 1,
        userType: '',
        role: '',
        huaming: ''
      }
      this.$refs['EmployeesForm'].resetFields(formName)
      this.permissionsForm = {
        goods_read: 1,
        goods_write: 1,
        brand_manage_read: 1,
        brand_manage_write: 1,
        saw_manage_read: 1,
        saw_manage_write: 1,
        goods_classify_read: 1,
        goods_classify_write: 1,
        goods_archive_read: 1,
        goods_archive_write: 1,
        code_read: 1,
        code_write: 1,
        price_list_read: 1,
        price_list_write: 1,
        order_read: 1,
        order_write: 1,
        order_manage_read: 1,
        order_manage_write: 1,
        order_audit_read: 1,
        order_audit_write: 1,
        after_sales_read: 1,
        after_sales_write: 1,
        nameless_part_read: 1,
        nameless_part_write: 1,
        financial_audit_read: 1,
        financial_audit_write: 1,
        return_goods_manage_read: 1,
        return_goods_manage_write: 1,
        repair_gathering_read: 1,
        repair_gathering_write: 1,
        deliver_read: 1,
        deliver_write: 1,
        delivery_manage_read: 1,
        delivery_manage_write: 1,
        purchase_read: 1,
        purchase_write: 1,
        purchase_list_manage_read: 1,
        purchase_list_manage_write: 1,
        supplier_manage_read: 1,
        supplier_manage_write: 1,
        supplier_goods_read: 1,
        supplier_goods_write: 1,
        purchase_list_audit_read: 1,
        purchase_list_audit_write: 1,
        stock_read: 1,
        stock_write: 1,
        stock_manage_read: 1,
        stock_manage_write: 1,
        warehouse_manage_read: 1,
        warehouse_manage_write: 1,
        finance_read: 1,
        finance_write: 1,
        receivable_manage_read: 1,
        receivable_manage_write: 1,
        payable_manage_read: 1,
        payable_manage_write: 1,
        invoice_manage_read: 1,
        invoice_manage_write: 1,
        crm_read: 1,
        crm_write: 1,
        customer_file_read: 1,
        customer_file_write: 1,
        member_manage_read: 1,
        member_manage_write: 1,
        statistics_read: 1,
        statistics_write: 1,
        purchase_statistics_read: 1,
        purchase_statistics_write: 1,
        order_statistics_read: 1,
        order_statistics_write: 1,
        stock_statistics_read: 1,
        stock_statistics_write: 1,
        achievement_statistics_read: 1,
        achievement_statistics_write: 1,
        sale_statistics_read: 1,
        sale_statistics_write: 1,
        workshop_statistics_read: 1,
        workshop_statistics_write: 1,
        financial_statistics_read: 1,
        financial_statistics_write: 1,
        after_sales_statistics_read: 1,
        after_sales_statistics_write: 1,
        setting_read: 1,
        setting_write: 1,
        account_setting_read: 1,
        account_setting_write: 1,
        employee_manage_read: 1,
        employee_manage_write: 1,
        store_manage_read: 1,
        store_manage_write: 1,
        strategy_setting_read: 1,
        strategy_setting_write: 1,
        logistics_setting_read: 1,
        logistics_setting_write: 1,
        print_setting_read: 1,
        print_setting_write: 1,
        cancel_account_read: 1,
        cancel_account_write: 1
      }
      this.formTitle = '新建员工'
      this.staffManagementVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    _loadMainList() {
      this.$tool.loadList(this, 'user/list', bodyInfo => {
        this.userList = bodyInfo.apiResult
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
    },
    exportExcel() {
      this.$tool.exportExcel(this, 'export/UserExcelport')
    },
    // 删除选中员工
    handleDelete() {
      this.$tool.confirm(this, '删除', () => {
        let userUuids = this.multipleSelection.map(item => item.userUuid)
        this.$tool.common(this, 'user/delete', {
          'userUuid': userUuids
        }, bodyInfo => {
          this._loadMainList()
        })
      })
    }
  },
  mounted() {
    this._loadMainList()
  }
}

</script>
<style lang="scss">
.staff-management-side {
  position: -webkit-sticky;
  position: sticky;
  margin-top: -15px;
  top: 102px;
  height: calc(100vh - 102px);
  background-color: #324157;
}

.staff-side-btn {
  padding-left: 42px;
  margin-top: 15px;
}

.staff-side-item {
  margin-top: 44px;
  padding-left: 42px;
  padding-right: 34px;
  height: 64px;
  line-height: 64px;
  font-size: 20px;
  color: #fff;
  background-color: #202630;
}

.staff-management-dialog {
  .el-dialog__header {
    padding-bottom: 20px;
    border: 1px solid #e0e0e0;
  }
}

</style>
