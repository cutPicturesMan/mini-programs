import api from './public/js/api.js';

App({
  onLaunch: function () {

    // 检查登录状态
    wx.checkSession({
      success: () => {
        console.log('成功');
        this.login();
      },
      fail: () => {
        // 如果失败，重新登录
        this.login();
      }
    });

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  // 登录接口
  login() {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: api.login,
            data: {
              code: res.code
            },
            success(res) {
              console.log(res);
              // wx.setStorageSync('3rd_session', res.);
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})
