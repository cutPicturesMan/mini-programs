//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    bannerSlider: {
      imgUrls: [
        '../../testimg/index2.jpg'
      ],
      indicatorDots: true,
      circular: true,
      autoplay: false,
      interval: 3000,
      duration: 500
    },
    textSlider: {
      imgUrls: [
        'iPhone 6定妆照确定了：长这样卖8000你会考虑吗长这样卖8000你会考虑吗长这样卖8000你会考虑吗长这样卖8000你会考虑吗？',
        'iPhone 7定妆照确定了：长这样卖8000你会考虑吗？',
        'iPhone 8定妆照确定了：长这样卖8000你会考虑吗？'
      ],
      indicatorDots: true,
      circular: true,
      autoplay: false,
      interval: 3000,
      duration: 500,
      vertical: true
    },
    scroll: {

    }
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
