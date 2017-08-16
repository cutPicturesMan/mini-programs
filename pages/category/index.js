//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    navIndex: 0,
    nav: [{
      icon: '../../icons/icon-new1.png',
      title: '新品'
    },{
      icon: '../../icons/icon-zan.png',
      title: '推荐'
    },{
      icon: '../../icons/icon-hot.png',
      title: '热卖'
    },{
      icon: '../../icons/icon-sell.png',
      title: '促销'
    }]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
