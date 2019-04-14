export default {
  methods: {
    queryBrands () {
      this.$http.post('brand/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 10000,
          'disable': 1
        }
      }).then(res => {
        this.brand_options = res.data.body.info.map(item => ({label: item.brandName, value: item.id}))
      })
    },
    querySuppliers () {
      this.$http.post('supplier/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 10000
        }
      }).then(res => {
        this.supplier_options = res.data.body.info.map(item => ({label: item.name, value: item.id}))
      })
    },
    queryCategorys () {
      this.$http.post('category/list', {
        'body': {
          'pageIndex': 1,
          'pageSize': 10000
        }
      }).then(res => {
        this.category_options = res.data.body.info.map(item => ({label: item.categoryName, value: item.id}))
      })
    }
  }
}
