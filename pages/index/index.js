import api from '../../public/js/api.js';

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
    scroll: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let sessionId = wx.getStorageSync('sessionId');

    wx.request({
      url: api.category_products + 4,
      header: {
        cookie: `SESSION=${sessionId}`
      },
      success: (res) => {
        console.log(res);
      }
    });
  }
})
