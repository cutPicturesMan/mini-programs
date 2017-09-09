import api from '../../public/js/api.js';

var app = getApp()
Page({
  data: {
    // 左侧选中的分类序号
    navIndex: 0,
    // 当前页码
    page: 1,
    // 一页显示的数量
    size: 30,
    // 价格排序，默认0
    // 0，asc正序
    // 1，desc倒序
    priceOrder: 0,
    // 是否还有更多数据，默认是；当返回的分类数据小于this.data.size时，表示没有更多数据了
    isMore: true,
    // 是否正在加载更多数据
    isLoadingMore: false,
    // 左侧导航
    nav: [],
    // 右侧数据
    list: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 重新设置与分页加载有关的数据
  resetList () {
  },
  // 切换价格排序
  changePriceOrder () {
    let { priceOrder } = this.data;

    this.setData({
      priceOrder: priceOrder === 0 ? 1 : 0,
      page: 1,
      isMore: true,
      isLoadingMore: false,
      list: []
    });
    this.getProductList()
  },
  // 改变左侧menu序号
  changeTab (e) {
    let idx = e.currentTarget.dataset.index;

    this.setData({
      navIndex: idx,
      page: 1,
      isMore: true,
      isLoadingMore: false,
      list: []
    });

    // 获取新的分类商品列表
    this.getProductList(this.data.nav[idx].id);
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
    wx.request({
      url: api.category_products + nav[navIndex].id,
      header: {
        cookie: `SESSION=${app.globalData.sessionId}`
      },
      data: {
        page: page,
        size: size,
        ase: priceOrder
      },
      success: (res) => {
        wx.hideLoading();
        let data = res.data.data;

        // 如果返回的数据长度小于请求预期长度，则表示没有下一页了
        if(data.length < size){
          isMore = false;
        }

        this.setData({
          isMore: isMore,
          isLoadingMore: false,
          list: list.concat(data)
        });
      }
    })
  },
  // 加载更多数据
  loadmore () {
    let { page, isMore, isLoadingMore } = this.data;

    // 如果正在加载更多数据，则不执行操作
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
  onLoad: function () {
    wx.showLoading();
    wx.request({
      url: api.category,
      header: {
        cookie: `SESSION=${app.globalData.sessionId}`
      },
      data: {
        categoryType: 'CATEGORY'
      },
      success: (res) => {
        let data = res.data.data;
        wx.hideLoading();

        this.setData({
          nav: data
        });

        // 如果有分类的情况下，默认请求第一个分类数据
        if (data.length !== 0) {
          this.getProductList()
        }
      }
    });
  }
})
