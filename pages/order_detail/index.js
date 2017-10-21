import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
let { formatDate } = require('../../public/js/utils.js');

Page({
  data: {
    // 订单id
    id: '',
    // 订单详情
    order: {},
    // 退单原因
    backReason: '',
    // 是否显示退单原因框
    backReasonToggle: false,
    // 数据是否加载完毕
    isLoaded: false,
    // 是否正在取消订单中
    isCancelling: false,
    // 是否确认收货中
    isReceiving: false,
    // 是否正在退单中
    isBacking: false
  },
  // 输入退单原因
  inputbackReason (e) {
    this.setData({
      backReason: e.detail.value
    });
  },
  // 显示隐藏退单原因弹窗
  switchBackReason () {
    let { backReasonToggle } = this.data;

    this.setData({
      backReasonToggle: !backReasonToggle
    })
  },
  // 确认退单原因
  confirmBackReason () {
    let { backReason } = this.data;

    try{
      if(!backReason){
        throw new Error('请填写退单原因');
      }
    }catch(e){
      return wx.showToast({
        title: e.message,
        image: '../../icons/close-circled.png'
      })
    }

    this.setData({
      backReason
    });

    this.switchBackReason();
    this.confirmBackOrder();
  },
  // 确定取消订单弹窗
  confirmCancelOrder () {
    wx.showModal({
      title: '提示',
      content: '您确定要取消订单吗？',
      success: (res) => {
        if (res.confirm) {
          this.cancelOrder();
        }
      }
    })
  },
  // 确定退单弹窗
  confirmBackOrder () {
    wx.showModal({
      title: '提示',
      content: '您确定要退单吗？',
      success: (res) => {
        if (res.confirm) {
          this.backOrder();
        }
      }
    })
  },
  // 取消订单
  cancelOrder () {
    wx.showLoading();
    let { id, isCancelling } = this.data;

    if(isCancelling){
      return wx.showToast({
        title: '正在取消中',
        image: '../../icons/close-circled.png'
      })
    }

    this.setData({
      isCancelling: true
    })

    http.request({
      url: `${api.order}${id}`,
      method: 'DELETE'
    }).then((res) => {
      if(res.errorCode == 200){
        wx.showToast({
          title: res.moreInfo || '取消成功'
        })

        setTimeout(()=>{
          this.setData({
            isCancelling: false
          });

          this.getData();
        }, 1500)
      } else {
        wx.showToast({
          title: res.moreInfo || '取消失败，请重试',
          image: '../../icons/close-circled.png'
        })

        this.setData({
          isCancelling: false
        })
      }
    });
  },
  // 申请退单
  backOrder () {
    wx.showLoading();
    let { id, isBacking, backReason } = this.data;

    try{
      if(isBacking){
        throw new Error('正在退单中');
      }
      if(!backReason){
        throw new Error('请填写退单原因');
      }
    }catch(e){
      return wx.showToast({
        title: e.message,
        image: '../../icons/close-circled.png'
      })
    }

    this.setData({
      isBacking: true
    })

    http.request({
      url: `${api.order_back}${id}`,
      method: 'DELETE',
      data: {
        reason: backReason
      }
    }).then((res) => {
      if(res.errorCode == 200){
        wx.showToast({
          title: res.moreInfo || '退单成功'
        })

        setTimeout(()=>{
          this.setData({
            isBacking: false
          });

          this.getData();
        }, 1500)
      } else {
        wx.showToast({
          title: res.moreInfo || '退单失败，请重试',
          image: '../../icons/close-circled.png'
        })

        this.setData({
          isBacking: false
        })
      }
    });
  },
  // 确认收货
  confirmReceived () {
    wx.showLoading();
    let { id, isReceiving} = this.data;

    if(isReceiving){
      return wx.showToast({
        title: '正在确认中',
        image: '../../icons/close-circled.png'
      })
    }

    this.setData({
      isReceiving: true
    })

    http.request({
      url: `${api.order_confirm}${id}`,
      method: 'PUT'
    }).then((res) => {
      if(res.errorCode == 200){
        wx.showToast({
          title: res.moreInfo || '确认收货成功'
        })

        setTimeout(()=>{
          this.setData({
            isReceiving: false
          });

          this.getData();
        }, 1500)
      } else {
        wx.showToast({
          title: res.moreInfo || '确认收货失败，请重试',
          image: '../../icons/close-circled.png'
        })

        this.setData({
          isReceiving: false
        })
      }
    });
  },
  // 获取订单数据
  getData () {
    let { id } = this.data;

    wx.showLoading();
    http.request({
      url: `${api.order}${id}`
    }).then((res) => {
      wx.hideLoading();
      let order = res.data;
      order.updatedAt = formatDate(new Date(order.updatedAt));

      this.setData({
        isLoaded: true,
        order: res.data
      });
    });
  },
  onLoad (params) {
    if (params.id) {
      this.setData({
        id: params.id
      });
      this.getData();
    } else {
      wx.showModal({
        title: '提示',
        content: '无法加载数据，请传入订单id'
      })
    }
  }
})
