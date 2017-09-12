import api from './api.js';

// 权限类，
class Auth {
  // 登录接口
  login () {
    let p = new Promise((resolve, rejcet)=>{
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.request({
              url: api.login,
              data: {
                code: res.code
              },
              success: (res) => {
                // 登录成功，则设置sessionId
                if (res.data.errorCode === 200) {
                  let sessionId = res.data.data;
                  wx.setStorageSync('sessionId', sessionId);
                } else {
                  this.logs(new Date() + '服务器登录错误：' + res.data.moreInfo);
                }

                // 无论登录是否成功，都再次发起请求
                resolve();
              }
            });
          } else {
            // 登录出错
            reject(res);
            this.logs(new Date() + '获取用户登录态失败' + res.errMsg);
          }
        }
      });
    })

    return p;
  }

  // 记录日志
  logs (text) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(text)
    wx.setStorageSync('logs', logs)
  }
}

export default Auth;