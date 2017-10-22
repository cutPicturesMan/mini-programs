import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import STATUS from '../../public/js/status.js';

Page({
  data: {
    ...STATUS,
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
    isLoadingMore: false
  },
  // 获取订单数据
  getData () {
    let { page, size, status, begin, end } = this.data;

    wx.showLoading();
    http.request({
      url: api.order,
      data: {
        page,
        size,
        status,
        startDate: begin,
        endDate: end
      }
    }).then((res) => {
      wx.hideLoading();

      this.setData({
        list: res.data,
        isMore: res.data.length < size ? false : true
      });
    });
  },
  onLoad: function (params) {
    let { begin, end, status } = params;

    this.setData({
      begin,
      end,
      status
    })

    this.getData();
  }
})
