import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

Page({
  data: {
    id: '',
    // 左侧选中的分类序号
    navIndex: 0,
    // 当前页码
    page: 0,
    // 一页显示的数量
    size: 30,
    // 价格排序，默认0
    // 0，asc正序
    // 1，desc倒序
    priceOrder: 0,
    // 左侧导航
    nav: [],
    // 右侧数据
    list: [],
    // 是否还有更多数据，默认是；当返回的分类数据小于this.data.size时，表示没有更多数据了
    isMore: true,
    // 是否正在加载更多数据
    isLoadingMore: false
  },
  // 改变左侧menu序号
  changeTab (e) {
    let idx = e.currentTarget.dataset.index;

    this.setData({
      navIndex: idx,
      page: 0,
      isMore: true,
      isLoadingMore: false,
      list: []
    });

    // 获取新的分类商品列表
    this.getProductList(this.data.nav[idx].id);
  },
  // 获取子分类
  getSubCategory () {
    let { id } = this.data;

    wx.showLoading();
    http.request({
      url: `${api.sub_category}${id}`
    }).then((res) => {
      let data = res.data;
      wx.hideLoading();

      this.setData({
        nav: data
      });

      // 如果有分类的情况下，默认请求第一个分类数据
      if (data.length !== 0) {
        this.getProductList()
      }
    })
  },
  // 获取产品列表
  getProductList (id) {
    let {
      navIndex,
      page,
      size,
      priceOrder,
      isMore,
      list,
      nav
    } = this.data;

    wx.showLoading();
    http.request({
      url: `${api.category_products}${nav[navIndex].id}`,
      data: {
        page: page,
        size: size,
        ase: priceOrder
      }
    }).then((res) => {
      wx.hideLoading();
      let data = res.data;

      // 如果返回的数据长度小于请求预期长度，则表示没有下一页了
      if (data.length < size) {
        isMore = false;
      }

      this.setData({
        isMore: isMore,
        isLoadingMore: false,
        list: list.concat(data)
      });
    })
  },
  // 加载更多数据
  loadmore () {
    let { page, isMore, isLoadingMore } = this.data;

    // 如果没有更多数据，则不执行操作
    if (!isMore) {
      return false;
    }

    // 如果正在加载更多数据，则不执行操作
    if (isLoadingMore) {
      return false;
    }

    this.setData({
      isLoadingMore: true,
      page: ++page
    });
    this.getProductList()
  },
  // 获取数据
  getData(){
    this.getSubCategory();
  },
  onLoad (params) {
    this.setData({
      id: params.id
    });

    this.getData();
  }
})
