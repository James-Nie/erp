<template>
  <div>
    <el-table :data="goodsList" stripe style="width: 100%" max-height="163">
    	<el-table-column type="index" label="序号" width="70" align="center">
     </el-table-column>
      <el-table-column label="货品编码" align="center">	
      </el-table-column>
      <el-table-column label="货品名称" align="center">
			</el-table-column>
      <el-table-column prop="brand" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="规格" align="center">
      </el-table-column>
      <el-table-column prop="length" label="长度(mm)" align="center">
      </el-table-column>
      <el-table-column prop="category" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="supplier" label="供应商" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="数量" align="center">
      </el-table-column>
      <el-table-column prop="retailPrice" label="销售单价(元)" align="center">
      </el-table-column>   
      <el-table-column prop="allPrice" label="总价(元)" align="center">
      </el-table-column>
      <el-table-column prop="oneWeight" label="单重" align="center">
      </el-table-column>
      <el-table-column prop="allWeight" label="预估总量" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'GoodsList',
    props: {
      data: Array
    },
    computed: {
      goodsList() {
        return this.data
      }
    }
  }
</script>