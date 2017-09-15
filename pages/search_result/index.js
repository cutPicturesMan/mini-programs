import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

Page({
  data: {
    // 搜索关键字
    searchText: '',
    // 价格排序，默认0
    // 0，asc正序
    // 1，desc倒序
    priceOrder: 0,
    // 列表数据
    list: [],
  },
  getData () {
    wx.showLoading();
    http.request({
      url: api.product_search,
      data: {
        key: this.data.searchText,
        ase: this.data.priceOrder
      }
    }).then((res) => {
      wx.hideLoading();
      this.setData({
        list: res.data
      });
    })
  },
  // 输入搜索文字
  searchInput (e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  // 搜索
  searchConfirm (e) {
    this.getData();
  },
  // 切换价格排序
  changePriceOrder () {
    let { priceOrder } = this.data;

    this.setData({
      priceOrder: priceOrder === 0 ? 1 : 0,
      page: 0,
      list: []
    });
    this.getData()
  },
  onLoad (params) {
    console.log(params);
    this.setData({
      searchText: params.key
    });

    this.getData();
  }
})
