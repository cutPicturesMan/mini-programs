import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

Page({
  data: {
    // 搜索关键字
    searchText: '',
    // 搜索排序
    // 0 反序
    // 1 正序
    ase: 1,
    // 列表数据
    list: []
  },
  getData () {
    wx.showLoading();
    http.request({
      url: api.product_search,
      data: {
        key: this.data.searchText,
        ase: this.data.ase
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
  onLoad (params) {
    this.setData({
      searchText: params.key
    });

    this.getData();
  }
})
