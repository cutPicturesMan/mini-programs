var app = getApp()
Page({
  data: {
    // 新增备注开关
    addToggle: false,
    list: []
  },
  // 显示/隐藏新增备注框
  switchAddRemark: function () {
    console.log(111);
    // 更新数据
    that.setData({
      addToggle: !this.addToggle
    })
  },
  onLoad: function () {
    var that = this
    // 调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      // 更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
