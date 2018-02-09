import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import utils from '../../public/js/utils.js';
import Auth from '../../public/js/auth.js';

let app = getApp();
let auth = new Auth();

Page({
  data: {
    // 用户信息
    info: {},
    // 微信名称
    nickName: '',
    // 微信头像
    avatarUrl: '',

    // 公司名称
    company: '',
    // 店铺名称
    shop: '',
    // 姓名
    name: '',
    // 电话
    phone: '',
    // 收货地址
    address: '',
    // 经理id
    adminId: 0,



    // 数据是否加载完毕
    isLoaded: false,
    // 是否允许使用个人信息
    isAllowInfo: true,
    // 是否允许使用收货地址
    isAllowAddress: true,
    // 是否正在提交
    isSubmit: false
  },
  /**
   * 输入框自动聚焦
   * @param e
   */
  bindInputTap(e){
    let { key } = e.currentTarget.dataset;

    this.setData({
      [`${key}`]: true
    })
  },
  // 公司名称
  bindCompanyInput (e) {
    this.setData({
      company: e.detail.value
    })
  },
  // 门店名称
  bindShopInput (e) {
    this.setData({
      shop: e.detail.value
    })
  },
  // 输入姓名
  bindNameInput (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 输入电话
  bindPhoneInput (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 输入地址
  bindAddressInput (e) {
    this.setData({
      address: e.detail.value
    })
  },
  // 提交数据
  submit () {
    // 防止重复提交
    if (this.data.isSubmit) {
      return;
    }

    let { company, shop, name, phone, address, adminId } = this.data;
    let { signature, rawData, encryptedData, iv } = this.data.info;

    try {
      // 如果用户未授权使用个人信息
      if (!signature || !rawData || !encryptedData || !iv) {
        throw new Error('用户未授权使用个人信息，无法注册。请在右上角的设置中允许授权');
      }
      // 如果没有业务员的id
      if (!adminId) {
        throw new Error('未关联业务员id，初步判断是二维码生成出错');
      }
      // 如果必填字段没有填写
      if (!company) {
        throw new Error('请填写公司名称');
      }
      // 如果必填字段没有填写
      if (!shop) {
        throw new Error('请填写店铺名称');
      }
      // 如果姓名没有填写
      if (!name) {
        throw new Error('请填写姓名');
      }
      // 如果电话没有填写
      if (!phone) {
        throw new Error('请填写电话');
      }
      // 如果地址没填写
      if (!address) {
        throw new Error('请填写地址');
      }
    } catch (e) {
      return wx.showToast({
        title: e.message,
        image: '../../icons/close-circled.png',
        duration: 4000
      })
    }

    wx.showLoading();
    this.setData({
      isSubmit: true
    });

    http.request({
      url: api.add_customer,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        signature,
        rawData,
        encryptedData,
        iv,
        companyName: company,
        shopName: shop,
        name,
        phone,
        address,
        adminId
      }
    }).then((res) => {
      // 提交成功，则跳转到首页
      if (res.errorCode === 200) {
        // 从后台进入前台时，刷新当前用户信息
        app.userInfo = null;

        wx.showToast({
          title: res.data.status.friendlyType || '提交成功'
        })

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        // 提交失败，则提示
        wx.showToast({
          title: res.moreInfo,
          image: '../../icons/close-circled.png'
        })
      }
      setTimeout(() => {
        this.setData({
          isSubmit: false
        });
      }, 1500)
    })
  },
  // 获取用户微信信息
  getUserInfo () {
    wx.getUserInfo({
      success: (res) => {
        let userInfo = res.userInfo;

        this.setData({
          isLoaded: true,
          isAllowInfo: true,
          info: res,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        });
      },
      fail: () => {
        this.setData({
          isAllowInfo: false
        });
      }
    });
  },
  onLoad (params = {}) {
      this.getUserInfo();
return;
      // 获取用户的信息
    app.getUserInfo()
      .then((res) => {
        if (res.status && res.status.id == 1) {
          wx.showToast({
            title: '您已注册，自动跳转中',
            image: '../../icons/close-circled.png'
          })

          setTimeout(() => {
            wx.switchTab({
              url: `/pages/index/index`
            });
          }, 1500)
        } else {
          auth.login()
            .then(() => {
              // 默认业务员id为1
              let adminId = 1;

              // 如果是通过扫码进来的
              if(params.scene){
                let scene = utils.parseQueryString(decodeURIComponent(params.scene));
                scene.adminId && (adminId = scene.adminId);
              } else {
                params.adminId && (adminId = params.adminId);
              }

              this.setData({
                adminId
              });

              this.getUserInfo();
            })
        }
      }, () => {
        wx.showModal({
          title: '提示',
          content: '获取用户信息失败，请重新进入小程序'
        })
      })
  }
})
