import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

Page({
  data: {
    user: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    http.request({
      url: api.user,
    }).then((res) => {
      wx.hideLoading();

      this.setData({
        user: res.data
      });
    });
  }
})
