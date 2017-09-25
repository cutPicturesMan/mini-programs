import Auth from './auth.js';

class Http extends Auth {
  constructor(){
    super();
    // 错误次数
    this.errorCount = 0;
    // 允许的最大出错次数，未超过这个次数，则自动重新登录；超过，则提示
    this.maxErrorCount = 5;
  }

  /**
   * 请求数据，只返回resolve的promise
   *    1、如果请求成功，则返回成功的数据
   *    2、如果失败了，则直接在这个接口提示，不返回reject
   * @param params  请求参数
   * {
   *  method: 'GET',
   *  header: {
   *   cookie: `SESSION=${sessionId}`
   *  }
   * }
   */
  request (params) {
    let sessionId = wx.getStorageSync('sessionId');
    // 默认请求参数
    let config = {
      method: 'GET',
      header: {
        cookie: `SESSION=${sessionId}`
      }
    }

    // 如果是提交数据，则使用form表单提交
    if (!!~['POST', 'PUT'].indexOf(params.method)) {
      config.header['content-type'] = 'application/x-www-form-urlencoded';
    }

    let p = new Promise((resolve, reject) => {
      let fn = {
        success: (res) => {
          res = res.data;
          // 用户未登录，则重新登录之后，再次发起本次请求
          if (res.errorCode === 401) {
            this.errorCount++;
            this.logs(new Date() + '用户登录失败，重新登录中。错误：' + res.moreInfo);

            // 如果登录错误的次数小于规定次数，则自动重新登录
            if(this.errorCount < this.maxErrorCount){
              this.login()
                .then(() => {
                  sessionId = wx.getStorageSync('sessionId');
                  config.header.cookie = `SESSION=${sessionId}`;
                  this.request(config);
                }, () => {
                  sessionId = wx.getStorageSync('sessionId');
                  config.header.cookie = `SESSION=${sessionId}`;
                  this.request(config);
                });
            }else{
              wx.showToast({
                title: '自动登录出错',
                image: '../../icons/close-circled.png'
              })
            }
          } else {
            resolve(res);
          }
        },
        fail(res){
          // 请求错误
          wx.showToast({
            title: res.data.moreinfo,
            image: '../../icons/close-circled.png'
          })
        }
      }

      // config.header字段为嵌套对象，会被params的header直接覆盖，因此先合并。也可以用lodash的_defaultsDeep()方法
      let header = Object.assign(config.header, params.header);
      Object.assign(config, fn, params);
      config.header = header;

      wx.request(config);
    });

    return p;
  }
}

export default new Http();