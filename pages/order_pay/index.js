//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    // 支付状态，0未支付，1支付成功，2支付失败
    payState: 0
  },
  //事件处理函数
  pay: function() {
    this.setData({
      payState : 1
    });
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
