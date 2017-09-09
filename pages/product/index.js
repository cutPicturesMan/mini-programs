import api from '../../public/js/api.js';

var app = getApp()
Page({
  data: {
    bannerSlider: {
      imgUrls: [
        '../../testimg/good.jpg',
        '../../testimg/good.jpg',
        '../../testimg/good.jpg'
      ],
      indicatorDots: true,
      circular: true,
      autoplay: false,
      interval: 3000,
      duration: 500
    },
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (url) {
    wx.showLoading();
    wx.request({
      url: `${api.product}${url.id}`,
      header: {
        cookie: `SESSION=${app.globalData.sessionId}`
      },
      success: (res) => {
        let data = res.data.data;
        wx.hideLoading();
        console.log(data);
      }
    });
  }
})
