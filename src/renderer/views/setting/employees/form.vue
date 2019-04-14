<template>
  <el-form inline ref="form" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="form.sex" style="width: 192px;">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="生日" prop="birthday">
      <el-date-picker v-model="form.birthday" type="date" placeholder="请选择日期" @change="changeBirthday">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="民族" prop="nation">
      <el-input v-model="form.nation" placeholder="请输入民族"></el-input>
    </el-form-item>
    <el-form-item label="婚姻状况" prop="maritalStatus">
      <el-select v-model="form.maritalStatus" style="width: 192px">
        <el-option label="未婚" value="未婚"></el-option>
        <el-option label="已婚" value="已婚"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="手机" prop="phone">
      <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
    </el-form-item>
    <el-form-item label="QQ" prop="qq">
      <el-input v-model="form.qq" placeholder="请输入QQ号"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="工资卡号" prop="card">
      <el-input v-model="form.card" placeholder="请输入工资卡号"></el-input>
    </el-form-item>
    <el-form-item label="紧急联系人" prop="contacts">
      <el-input v-model="form.contacts" placeholder="请输入紧急联系人"></el-input>
    </el-form-item>
    <el-form-item label="紧急电话" prop="telephone">
      <el-input v-model="form.telephone" placeholder="请输入紧急电话"></el-input>
    </el-form-item>
    <el-form-item label="毕业院校" prop="school">
      <el-input v-model="form.school" placeholder="请输入毕业院校"></el-input>
    </el-form-item>
    <el-form-item label="学历" prop="education">
      <el-select v-model="form.education" style="width: 192px;">
        <el-option v-for="item in educationOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="部门" prop="department">
      <el-select v-model="form.department" placeholder="请选择部门" class="w192">
        <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="毕业时间" prop="graduationTime">
      <el-date-picker v-model="form.graduationTime" type="date" placeholder="请选择毕业时间" @change="changeGraduationTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="入职时间" prop="hiredate">
      <el-date-picker v-model="form.hiredate" type="date" placeholder="请选择日期" @change="changeHiredate">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="账号" prop="account">
      <el-input v-model="form.account" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="旺旺">
      <el-input v-model="form.wangwang" placeholder="请输入旺旺号"></el-input>
    </el-form-item>
    <el-form-item label="档案所在地">
      <el-input v-model="form.archivesLocation" placeholder="请输入档案所在地"></el-input>
    </el-form-item>
    <el-form-item label="户口所在地">
      <el-input v-model="form.registLocation" placeholder="请输入户口所在地"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
    </el-form-item>
    <el-form-item label="用户类型" prop="userType">
      <el-select v-model="form.userType" style="width: 192px;">
        <el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="用户角色" prop="role">
      <el-select v-model="form.role" style="width: 192px;">
        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="花名">
      <el-input v-model="form.huaming" placeholder="请输入客服花名"></el-input>
    </el-form-item>
    <el-form-item label="停用">
      <el-checkbox class="mgl15" v-model="form.disable" true-label="2" false-label="1"></el-checkbox>
    </el-form-item>
    <!--<div class="panel-heading">权限</div>
    <el-table :data="permissions" style="width: 100%">
      <el-table-column prop="permissionsItem" label="权限" width="100" align="center">
      </el-table-column>
      <el-table-column label="货品" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.goods_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.goods_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="品牌管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.brand_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.brand_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="锯条管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.saw_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.saw_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="货品分类" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.goods_classify_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.goods_classify_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="货品档案" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.goods_archive_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.goods_archive_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="条形码" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.code_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.code_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="价格单" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.price_list_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.price_list_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="订单" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.order_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.order_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="订单管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.order_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.order_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="订单审核" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.order_audit_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.order_audit_write" v-else></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="permissions" style="width: 100%;margin-top:30px;">
      <el-table-column prop="permissionsItem" label="权限" width="100" align="center">
      </el-table-column>
      <el-table-column label="售后" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.after_sales_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.after_sales_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="无名件" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.nameless_part_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.nameless_part_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="财务审核" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.financial_audit_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.financial_audit_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="退货管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.return_goods_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.return_goods_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="维修收款" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.repair_gathering_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.repair_gathering_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="发货" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.deliver_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.deliver_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="发货管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.delivery_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.delivery_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="采购" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.purchase_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.purchase_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="采购单管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.purchase_list_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.purchase_list_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="供应商管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.supplier_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.supplier_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="permissions" style="width: 100%;margin-top:30px;">
      <el-table-column prop="permissionsItem" label="权限" width="100" align="center">
      </el-table-column>
      <el-table-column label="供应商货品" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.supplier_goods_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.supplier_goods_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="采购单审核" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.purchase_list_audit_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.purchase_list_audit_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.stock_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.stock_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="库存管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.stock_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.stock_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="仓库管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.warehouse_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.warehouse_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="财务" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.finance_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.finance_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="应收管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.receivable_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.receivable_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="应付管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.payable_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.payable_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="发票管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.invoice_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.invoice_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="crm" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.crm_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.crm_write" v-else></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="permissions" style="width: 100%;margin-top:30px;">
      <el-table-column prop="permissionsItem" label="权限" width="100" align="center">
      </el-table-column>
      <el-table-column label="客户档案" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.customer_file_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.customer_file_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="会员管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.member_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.member_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="采购统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.purchase_statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.purchase_statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="订单统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.order_statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.order_statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="库存统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.stock_statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.stock_statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="业绩统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.achievement_statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.achievement_statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="货品售卖统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.sale_statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.sale_statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="车间统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.workshop_statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.workshop_statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="财务统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.financial_statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.financial_statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="permissions" style="width: 100%;margin-top:30px;">
      <el-table-column prop="permissionsItem" label="权限" width="100" align="center">
      </el-table-column>
      <el-table-column label="售后统计" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.after_sales_statistics_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.after_sales_statistics_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="设置" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.setting_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.setting_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="账号设置" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.account_setting_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.account_setting_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="员工管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.employee_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.employee_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="店铺管理" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.store_manage_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.store_manage_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="策略设置" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.strategy_setting_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.strategy_setting_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="物流设置" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.logistics_setting_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.logistics_setting_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="打印设置" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.print_setting_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.print_setting_write" v-else></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="注销账号" align="center">
        <template slot-scope="scope">
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.cancel_account_read" v-if="scope.$index === 0"></el-checkbox>
          <el-checkbox :true-label="2" :false-label="1" v-model="permissionsForm.cancel_account_write" v-else></el-checkbox>
        </template>
      </el-table-column>
    </el-table>-->
    <div class="staff-footer">
      <el-button class="circle-btn" type="primary" @click="handleSubmit('form')">确 定</el-button>
      <el-button class="circle-btn" @click="$emit('resetForm', 'form')">取 消</el-button>
    </div>
  </el-form>
</template>
<script>
export default {
  name: 'EmployeesForm',
  props: {
    updatedForm: Object,
    permissionsForm: Object,
    formTitle: String
  },
  data() {
    return {
      educationOptions: [{
        value: '初中'
      }, {
        value: '高中'
      }, {
        value: '大专'
      }, {
        value: '本科'
      }, {
        value: '硕士'
      }, {
        value: '博士'
      }],
      departmentOptions: [{
        value: '销售部'
      }, {
        value: '客服部'
      }, {
        value: '发货部'
      }, {
        value: '售后部'
      }, {
        value: '生产部'
      }, {
        value: '仓储部'
      }, {
        value: '总经部'
      }, {
        value: '财务部'
      }, {
        value: '维修部'
      }, {
        value: '采购部'
      }],
      userTypeOptions: [{
        label: '超级管理员',
        value: 0
      }, {
        label: '操作员',
        value: 1
      }, {
        label: '审单员',
        value: 2
      }, {
        label: '仓库员',
        value: 3
      }],
      roleOptions: [{
        label: '管理员',
        value: '0'
      }],
      permissions: [{
        permissionsItem: '查看'
      }, {
        permissionsItem: '编辑'
      }],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        phone: [{ required: true, validator: this.$tool.validatePhone, trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
        nation: [{ required: true, message: '请输入民族', trigger: 'blur' }],
        maritalStatus: [{ required: true, message: '请选择婚姻状况', trigger: 'blur' }],
        qq: [{ required: true, message: '请输入QQ', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        card: [{ required: true, message: '请输入工资卡号', trigger: 'blur' }],
        contacts: [{ required: true, message: '请输入紧急联系人', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入紧急联系电话', trigger: 'blur' }],
        school: [{ required: true, message: '请输入毕业院校', trigger: 'blur' }],
        education: [{ required: true, message: '请输入学历', trigger: 'blur' }],
        graduationTime: [{ required: true, message: '请选择毕业时间', trigger: 'change' }],
        hiredate: [{ required: true, message: '请选择入职时间', trigger: 'change' }],
        department: [{ required: true, message: '请选择部门', trigger: 'change' }],
        archivesLocation: [{ required: true, message: '请输入档案所在地', trigger: 'blur' }],
        registLocation: [{ required: true, message: '请输入户口所在地', trigger: 'blur' }],
//      disable: [{ required: true, message: '请输入是否停用', trigger: 'blur' }],
        userType: [{ required: true, type: 'number', message: '请选择用户类型', trigger: 'change' }],
        role: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
      }
    }
  },
  computed: {
    form() {
      return this.updatedForm
    }
  },
  methods: {
    // 清空
    resetFields(formName) {
      this.$refs[formName].resetFields()
    },
    // 修改或设置生日
    changeBirthday(val) {
      this.form.birthday = val
    },
    // 修改或设置毕业时间
    changeGraduationTime(val) {
      this.form.graduationTime = val
    },
    // 修改或设置入职时间
    changeHiredate(val) {
      this.form.hiredate = val
    },
    // 确定提交数据
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submit', formName)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>
<style scoped>
.staff-footer {
  text-align: center;
  margin-top: 60px;
}

.el-button+.el-button {
  margin-left: 20px;
}

</style>
