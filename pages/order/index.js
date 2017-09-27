import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import STATUS from '../../public/js/status.js';

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
  onLoad: function () {
    this.getData();
  }
})
