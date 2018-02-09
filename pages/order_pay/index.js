import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import PAY_TYPE from '../../public/js/pay_type.js';

Page({
  data: {
    ...PAY_TYPE,
    // 支付状态，0未支付，1支付成功，2支付失败
    payState: 0,
    // 默认选择的支付方式
    payIndex: 0,
    // 支付类型
    payType: [],
    // 数据是否加载完毕
    isLoaded: false,
  },
  // 发送模板消息
  sendTemplateMsg(e) {
    http.request({
        url: `${api.template_msg}`,
        method: 'POST',
        data: {
            formIds: e.detail.formId
        }
    }).then((res) => {
        console.log(res);
    })
  },
  // 获取订单数据
  getData (id) {
    wx.showLoading();
    http.request({
      url: `${api.order}${id}`
    }).then((res) => {
      wx.hideLoading();

      this.setData({
        isLoaded: true,
        order: res.data
      });
    });
  },
  // 获取所有支付方式
  getPayType (id) {
    http.request({
      url: `${api.pay}${id}`
    }).then((res) => {
      this.setData({
        payType: res.data
      });
    });
  },
  // 选择支付方式
  selectPayType (e) {
    let { index } = e.currentTarget.dataset;
    this.setData({
      payIndex: index
    });
  },
  // 确认支付
  submit () {
    let { payIndex, payType, order, isSubmit } = this.data;

    if (isSubmit) {
      return wx.showToast({
        title: '正在提交中...',
        image: '../../icons/close-circled.png'
      })
    }

    this.setData({
      isSubmit: true
    });

    wx.showLoading();
    http.request({
      url: `${api.pay}${order.id}`,
      method: 'PUT',
      data: {
        type: payType[payIndex].type
      }
    }).then((res) => {
      if (res.errorCode === 200) {
        wx.hideLoading();
        this.setData({
          payState: 1
        });
      } else {
        wx.showToast({
          title: res.moreInfo || '支付失败',
          image: '../../icons/close-circled.png'
        })
        setTimeout(() => {
          this.setData({
            isSubmit: false
          });
        }, 1500)
      }
    });
  },
  // 跳转到订单页
  switchOrderPage () {
    wx.switchTab({
      url: `/pages/order/index`,
      success: (e) => {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  },
  onLoad: function (params) {
    if (params.id) {
      this.getData(params.id);
      this.getPayType(params.id);
    } else {
      wx.showToast({
        title: '请传入待支付订单id',
        image: '../../icons/close-circled.png'
      })
    }
  }
})
