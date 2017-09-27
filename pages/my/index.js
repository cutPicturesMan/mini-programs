import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import STATUS from '../../public/js/status.js';

Page({
  data: {
    ...STATUS,
    user: {}
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 注册
  register () {
    // 获取用户微信信息
    wx.getUserInfo({
      success: (res) => {
        console.log(res);
        http.request({
          url: api.user,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            signature: res.signature,
            rawData: res.rawData,
            encryptedData: res.encryptedData,
            iv: res.iv
          }
        }).then((res) => {
          wx.hideLoading();

          this.setData({
            user: res.data
          });
        });
      }
    })
  },
  onLoad () {
    http.request({
      url: api.user,
    }).then((res) => {
      wx.hideLoading();

      if (!res.data.avatarUrl && !res.data.nickName) {
        this.register();
      } else {
        this.setData({
          user: res.data
        });
      }
    });
  }
})
