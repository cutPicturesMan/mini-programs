import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

Page({
  data: {
    // 订单数据
    list: [],
    // 当前页码
    page: 0,
    // 一页显示的数量
    size: 30,
    // 订单状态
    // SUBMITTED  已提交的订单
    // CANCELLED  取消的订单
    // PAID       已经支付的订单
    // CONFIRMED  确认收货的订单
    // SHIPPED    运输中的订单
    // FINISHED   已经结束的订单
    status: 'SUBMITTED',
  },
  // 获取订单数据
  getData () {
    let { page, size, status } = this.data;

    wx.showLoading();
    http.request({
      url: api.order,
      data: {
        page,
        size,
        status
      }
    }).then((res) => {
      wx.hideLoading();

      this.setData({
        list: res.data
      });
    });
  },
  onLoad: function () {
    this.getData();
  }
})
