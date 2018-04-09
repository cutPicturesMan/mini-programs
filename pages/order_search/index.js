import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import STATUS from '../../public/js/status.js';

let { formatDate } = require('../../public/js/utils.js');

Page({
  data: {
    statusIndex: 0,
    begin: formatDate(new Date(), 'YYYY-MM-DD'),
    end: formatDate(new Date(), 'YYYY-MM-DD'),
    status: [
      {
        id: 1,
        code: 'PENDING_SALEMAN',
        name: '待业务员审核'
      },
      {
        id: 2,
        code: 'EXAMINE_MANAGER',
        name: '待经理审核'
      },
      {
        id: 3,
        code: 'EXAMINE_ACCOUNTANT',
        name: '待财务审核'
      },
      {
        id: 4,
        code: 'SUBMITTED',
        name: '待财务确认'
      },
      {
        id: 5,
        code: 'PAID',
        name: '财务已确认'
      },
      {
        id: 6,
        code: 'EXAMINE_FINANCE',
        name: '待仓管审核'
      },
      {
        id: 7,
        code: 'CANCELLED',
        name: '已取消'
      },
      {
        id: 8,
        code: 'SHIPPED',
        name: '运输中'
      },
      {
        id: 9,
        code: 'CONFIRMED',
        name: '确认收货'
      },
      {
        id: 10,
        code: 'FINISHED',
        name: '已经结束'
      },
      {
        id: 11,
        code: 'BACKING',
        name: '退货中'
      },
      {
        id: 12,
        code: 'BACKED',
        name: '已退货'
      }
    ]
  },
  // 订单类型
  bindPickerChange: function(e) {
    this.setData({
      statusIndex: e.detail.value
    })
  },
  // 开始时间
  bindBeginDateChange: function(e) {
    this.setData({
      begin: e.detail.value
    })
  },
  // 结束时间
  bindEndDateChange: function(e) {
    this.setData({
      end: e.detail.value
    })
  },
  // 搜索
  search(){
    let { begin, end, status, statusIndex } = this.data;

    wx.navigateTo({
      url: `/pages/order_search_result/index?begin=${begin}&end=${end}&status=${status[statusIndex].code}`
    });
  },
  onLoad(params) {
    if (params && params.index) {
      this.setData({
        statusIndex: params.index
      });
    }
  }
})
