Page({
  data: {
    // 默认选择的发票类型
    // 0为不开具发票
    // 1为普通发票
    // 2为增值税发票
    type: 0,
    form: {
      name: '',
    }
  },
  // 选择发票类型
  selectInvoice(e) {
    console.log(e);
    this.setData({
      type: e.currentTarget.dataset.type * 1
    })
  },
})
