let { formatDate } = require('../../public/js/utils.js');

Page({
  data: {
    listStateIndex: 0,
    beginDate: formatDate(new Date(), 'YYYY-MM-DD'),
    endDate: formatDate(new Date(), 'YYYY-MM-DD'),
    listState: [
      {
        id: 0,
        name: '全部'
      },
      {
        id: 1,
        name: '待订单审核'
      },
      {
        id: 2,
        name: '待财务审核'
      },
      {
        id: 3,
        name: '待出库审核'
      },
      {
        id: 4,
        name: '待收货确认'
      },
      {
        id: 5,
        name: '已完成'
      },
      {
        id: 6,
        name: '已作废'
      }
    ]
  },
  bindPickerChange: function(e) {
    this.setData({
      listStateIndex: e.detail.value
    })
  },
  bindBeginDateChange: function(e) {
    this.setData({
      beginDate: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
})
