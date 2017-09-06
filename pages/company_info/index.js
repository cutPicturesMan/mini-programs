let { formatDate } = require('../../public/js/utils.js');

Page({
  data: {
    form: {
      beginDate: formatDate(new Date(), 'YYYY-MM-DD'),
      endDate: formatDate(new Date(), 'YYYY-MM-DD'),
    }
  },
  changeBeginDate: function(e) {
    this.setData({
      form: {
        beginDate: e.detail.value
      }
    })
  },
  changeEndDate: function(e) {
    this.setData({
      form: {
        endDate: e.detail.value
      }
    })
  },
})
