import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

Page({
  data: {
    // 查询字符串对象
    params: null,
    // 搜索关键字
    searchText: '',
    // 当前页码
    page: 0,
    // 一页显示的数量
    size: 30,
    // 价格排序，默认0
    // 0，asc正序
    // 1，desc倒序
    priceOrder: 0,
    // 列表数据
    list: [],
    // 是否还有更多数据，默认是；当返回的分类数据小于this.data.size时，表示没有更多数据了
    isMore: true,
    // 是否正在加载更多数据
    isLoadingMore: false,
    // 数据是否加载完毕
    isLoaded: false
  },
  // 重置状态
  resetStatus () {
    // 重置数据
    this.setData({
      'params.type': -1,
      isLoaded: false,
      isMore: true,
      isLoadingMore: false,
      page: 0,
      list: []
    });
  },
  // 输入搜索文字
  searchInput (e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  // 搜索
  searchConfirm () {
    this.resetStatus();
    this.getData();
  },
  // 切换价格排序
  changePriceOrder () {
    let { priceOrder } = this.data;
    this.setData({
      priceOrder: priceOrder === 0 ? 1 : 0,
    });

    this.resetStatus();
    this.getData()
  },
  // 获取产品列表
  getProductList () {
    let {
      params,
      page,
      size,
      priceOrder,
      isMore,
      list
    } = this.data;

    wx.showLoading();
    http.request({
      url: `${api.category_products}${params.id}`,
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
        isLoaded: true,
        isMore: isMore,
        isLoadingMore: false,
        list: list.concat(data)
      });
    })
  },
  // 获取搜索列表数据
  getSearchList () {
    let {
      searchText,
      page,
      size,
      priceOrder,
      isMore,
      list
    } = this.data;

    wx.showLoading();
    http.request({
      url: api.product_search,
      data: {
        key: searchText,
        ase: priceOrder,
        page,
        size
      }
    }).then((res) => {
      wx.hideLoading();
      let data = res.data;

      // 如果返回的数据长度小于请求预期长度，则表示没有下一页了
      if (data.length < size) {
        isMore = false;
      }

      this.setData({
        isLoaded: true,
        isMore: isMore,
        isLoadingMore: false,
        list: list.concat(data)
      });
    })
  },
  // 加载更多数据
  loadmore () {
    let { params, page, isMore, isLoadingMore } = this.data;

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

    this.getData();
  },
  // 获取数据
  getData () {
    let { params } = this.data;

    // 如果是搜索数据
    if(params.type == -1){
      this.getSearchList();
    } else {
      // 查询分类商品列表接口
      this.getProductList();
    }
  },
  /**
   * 页面加载完毕之后，根据type去查询对应接口
   * @param params
   * params.type == -1   去查询搜索接口（默认）
   * params.type == 1   去查询分类商品列表接口
   * params.type == 2   去查询分类商品列表接口
   * params.type == 3   去查询分类商品列表接口
   * params.type == 4   去查询分类商品列表接口
   */
  onLoad (params) {
    !params.type && (params.type = -1);
    !params.id && (params.id = 0);
    !params.key && (params.key = '');

    this.setData({
      params,
      searchText: params.key
    });

    this.getData();
  }
})
