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
        code: 'SUBMITTED',
        name: '财务审核'
      },
      {
        id: 2,
        code: 'PENDING_SALEMAN',
        name: '业务员审核'
      },
      {
        id: 3,
        code: 'EXAMINE_FINANCE',
        name: '仓管审核'
      },
      {
        id: 4,
        code: 'EXAMINE_MANAGER',
        name: '经理审核'
      },
      {
        id: 5,
        code: 'PAID',
        name: '财务审核'
      },
      {
        id: 6,
        code: 'SHIPPED',
        name: '运输中'
      },
      {
        id: 7,
        code: 'CONFIRMED',
        name: '确认收货'
      },
      {
        id: 8,
        code: 'FINISHED',
        name: '已经结束'
      },
      {
        id: 9,
        code: 'CANCELLED',
        name: '已取消'
      },
      {
        id: 10,
        code: 'BACKING',
        name: '退货中'
      },
      {
        id: 11,
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
