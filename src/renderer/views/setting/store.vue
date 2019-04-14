<template>
  <div>
    <el-form :inline="true" :model="addForm" :rules="rules" class="demo-form-inline" ref="form">
      <el-form-item label="店铺名字" prop="name">
        <el-input v-model="addForm.name" placeholder="店铺名字"></el-input>
      </el-form-item>
      <el-form-item label="平台" prop="platform">
        <el-input v-model="addForm.platform" placeholder="店铺名字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd"><i class="iconfont  "></i>添加</el-button>
        <el-button type="danger" @click="handleDelete" icon="delete2" :disabled="multipleSelection.length !== 1">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="ShopList" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column prop="storeName" label="店铺名称" align="center">
      </el-table-column>
      <el-table-column prop="platform" label="平台" align="center">
      </el-table-column>
      <el-table-column label="创建时间" :formatter="formmatCreateDatetime" align="center">
      </el-table-column>
      <el-table-column label="修改时间" :formatter="formmatUpdateDatetime" align="center">
      </el-table-column>
    </el-table>
    <div class="toolbar clearfix">
      <el-pagination class="fr" layout="prev, pager, next" :page-size="pagination.pageSize" :total="pagination.total" :current-page="pagination.pageIndex" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'store-setting',
  data() {
    return {
      addForm: {
        'name': '',
        'platform': ''
      },
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      ShopList: [],
      multipleSelection: [],
      rules: {
        name: [{ required: true, message: '请填写店铺名称', trigger: 'blur' }],
        platform: [{ required: true, message: '请填写平台', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 过滤器，过滤日期
    formmatCreateDatetime(row, column) {
      return this.$moment(new Date(row.createDatetime)).format('YYYY-MM-DD hh:mm:ss')
    },
    // 如果有日期，过滤，如果没有，显示---
    formmatUpdateDatetime(row, column) {
      if (row.updateDatetime) {
        return this.$moment(new Date(row.updateDatetime)).format('YYYY-MM-DD hh:mm:ss')
      }
      return '---'
    },
    // 分页
    handleCurrentChange(val) {
      this.pagination.pageIndex = val
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 添加商店
    handleAdd() {
    	this.$refs['form'].validate(valid => {
	        if (valid) {
				    this.$http.post('store/create', this.addForm).then(res => {
			        this.addForm = {
			          'name': '',
			          'platform': ''
			        }
			        this.queryList()
			      })
	      	}
	    })
    },
    // 删除选中商店
    handleDelete() {
      console.log(this.multipleSelection)
      let shopIds = this.multipleSelection[0].id
      this.$http.post('store/delete', {
        'storeId': shopIds
      }).then(res => {
        this.queryList()
      })
    },
    // 获取商店列表
    queryList() {
      this.$http.post('store/list', {
        'body': this.pagination
      }).then(res => {
        this.ShopList = res.data.apiResult
        this.pagination.total = res.data.count
      })
    }
  },
  mounted() {
    this.queryList()
  }
}

</script>
