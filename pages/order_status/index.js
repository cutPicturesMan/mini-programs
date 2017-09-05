var app = getApp()
Page({
  data: {
    idx: 0,
    status: [{
      id: 0,
      name: '订单已提交'
    }, {
      id: 1,
      name: '订单审核'
    }, {
      id: 2,
      name: '财务审核'
    }, {
      id: 3,
      name: '出库审核'
    }, {
      id: 4,
      name: '发货确认'
    }, {
      id: 5,
      name: '收货确认'
    }, {
      id: 6,
      name: '已完成'
    }]
  }
})
