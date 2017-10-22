let app = getApp()
Page({
  data: {
    orderItems: []
  },
  onLoad () {
    let orderItems = app.orderItems || []

    this.setData({
      orderItems
    })
  }
})
