import http from './public/js/http.js';
import api from './public/js/api.js';

App({
  // 用户信息
  userInfo: null,
  // 获取用户信息，返回一个promise
  getUserInfo () {
    let p = new Promise((resolve, reject) => {
      // 如果还未获取用户角色，则请求并设置
      if (!this.userInfo) {
        wx.showLoading();

        http.request({
          url: api.user
        }).then((res) => {
          let userInfo = res.data;
          wx.hideLoading();

          if (res.errorCode === 200) {
            // 设置用户信息
            this.userInfo = res.data;
            resolve(res.data);
          } else {
            wx.showModal({
              title: '提示',
              content: '用户数据获取失败，请重新进入小程序'
            })
            reject(res.data);
          }
        });
      } else {
        // 已经请求过用户角色，则直接返回用户数据
        resolve(this.userInfo);
      }
    })

    return p;
  },
  onShow () {
    // 小程序从后台工作进入前台时，刷新当前用户信息
    this.userInfo = null;
  },
})
