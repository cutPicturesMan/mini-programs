
App({
  globalData: {
    userInfo: null,
    // 全局的sessionId
    sessionId: wx.getStorageSync('sessionId') || null
  },

  // onLaunch () {
    // // 检查登录状态
    // wx.checkSession({
    //   success: () => {
    //     console.log('checkSession 成功');
    //     this.logs(new Date() + '登录成功');
    //   },
    //   fail: () => {
    //     console.log('checkSession 失败');
    //     // 如果失败，重新登录
    //     this.login();
    //   }
    // });
  // },



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
