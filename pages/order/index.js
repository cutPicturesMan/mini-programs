import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import STATUS from '../../public/js/status.js';
let app = getApp();

Page({
  data: {
    ...STATUS,
    tabIndex: 0,
    // 订单数据
    list: [],
    // 当前页码
    page: 0,
    // 一页显示的数量
    size: 30,
    // 订单状态
    status: '',
    // 是否还有更多数据，默认是；当返回的分类数据小于this.data.size时，表示没有更多数据了
    isMore: true,
    // 是否正在加载更多数据
    isLoadingMore: false,
  },
  // 切换顶部订单状态tab
  switchTabs(e){
    let { index, status } = e.currentTarget.dataset;

    this.setData({
      tabIndex: index,
      page: 0,
      isMore: true,
      isLoadingMore: false,
      status
    });

    this.getData();
  },
  // 获取订单数据
  getData () {
    let { page, size, status } = this.data;
    let params = {
      page,
      size,
      status
    }

    wx.showLoading();
    http.request({
      url: api.order,
      data: params
    }).then((res) => {
      wx.hideLoading();

      this.setData({
        list: res.data,
        isMore: res.data.length < size ? false : true
      });
    });
  },
  onLoad () {
    // 获取用户的信息
    app.getUserInfo()
      .then((res) => {
        // 如果用户审核通过(1)，则进入系统
        if (res.status.id == 1) {
          this.getData();
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
