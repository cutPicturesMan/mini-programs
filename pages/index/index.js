import api from '../../public/js/api.js';

var app = getApp()

Page({
  data: {
    // 搜索关键字
    searchText: '',
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
  // 输入搜索文字
  searchInput (e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  // 搜索
  searchConfirm (e) {
    // 导航到搜索页
    wx.navigateTo({
      url: `/pages/search_result/index?key=${e.detail.value}`,
    });
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
