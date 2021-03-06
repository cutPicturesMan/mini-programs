import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import STATUS from '../../public/js/status.js';
let app = getApp();

Page({
  data: {
    ...STATUS,
    userInfo: {}
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
  onShow () {
    // 获取用户的信息
    app.getUserInfo()
      .then((res) => {
        // 如果用户审核通过(1)，则进入系统
        if (res.status.id == 1) {

        } else if (res.status.id == 2) {
          // 如果正在审核中(2)、则页面显示正在审核，不进入系统
        } else if (res.status.id == -1 || res.status.id == 0) {
          // 如果用户未审核(-1)、审核拒绝(0)，则提示扫码注册
          wx.showModal({
            title: '提示',
            content: '对不起，您还未注册，请扫码注册'
          })
        }

        this.setData({
          userInfo: res
        });
      }, () => {});
  }
})
