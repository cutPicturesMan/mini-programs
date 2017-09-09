import api from './public/js/api.js';

App({
  globalData: {
    userInfo: null,
    // 全局的sessionId
    sessionId: wx.getStorageSync('sessionId') || null
  },

  onLaunch () {
    // 检查登录状态
    wx.checkSession({
      success: () => {
        this.login();
        this.logs(new Date() + '登录成功');
      },
      fail: () => {
        // 如果失败，重新登录
        this.login();
      }
    });
  },

  // 登录接口
  login () {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: api.login,
            data: {
              code: res.code
            },
            success: (res) => {
              if (res.data.errorCode === 200) {
                this.globalData.sessionId = res.data.data;
                wx.setStorageSync('sessionId', res.data.data);
              } else {
                this.logs(new Date() + '服务器登录错误：' + res.data.moreInfo);
              }
            }
          });
        } else {
          this.logs(new Date() + '获取用户登录态失败' + res.errMsg);
        }
      }
    });
  },

  // 记录日志
  logs (text) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(text)
    wx.setStorageSync('logs', logs)
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
})
