let { formatDate } = require('../../public/js/utils.js');

Page({
  data: {
    // 新增备注开关
    addToggle: false,
    form: {
      cheapMoney: '',
      remark: '',
      date: formatDate(new Date(), 'YYYY-MM-DD'),
    }
  },
  // 显示/隐藏新增备注框
  switchAddRemark: function () {
    // 更新数据
    this.setData({
      addToggle: !this.data.addToggle
    })
  },
  bindDateChange: function(e) {
    this.setData({
      form: {
        date: e.detail.value
      }
    })
  },
})

