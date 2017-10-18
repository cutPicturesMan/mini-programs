import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
let app = getApp();

Page({
  data: {
    // 搜索关键字
    searchText: '',
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
    navList: [],
    // 左侧选中的导航
    selectedNav: [],
    // 右侧数据
    list: [],
    // 是否显示子选项开关
    toggleSubCategory: false,
    // 是否还有更多数据，默认是；当返回的分类数据小于this.data.size时，表示没有更多数据了
    isMore: true,
    // 是否正在加载更多数据
    isLoadingMore: false,
    // 背景动画
    subCategoryBgAnimation: {},
    // 背景动画
    subCategoryMainAnimation: {},
  },
  // 弹窗开启关闭动画
  toggleSubCategory () {
    let { toggleSubCategory } = this.data;
    let bgAnimation = this.bgAnimation;
    let subAnimation = this.subAnimation;
    let subCategoryBgAnimation = null;
    let subCategoryMainAnimation = null;
    toggleSubCategory = !toggleSubCategory;

    // 如果接下来是要开启
    if(toggleSubCategory){
      bgAnimation.opacity(1).step();
      subAnimation.translateY(0).step();

      this.setData({
        toggleSubCategory,
      })

      setTimeout(() => {
        this.setData({
          subCategoryBgAnimation: bgAnimation.export(),
          subCategoryMainAnimation: subAnimation.export()
        })
      }, 0)
    } else {
      bgAnimation.opacity(0).step();
      subAnimation.translateY('100%').step();

      this.setData({
        subCategoryBgAnimation: bgAnimation.export(),
        subCategoryMainAnimation: subAnimation.export()
      })

      setTimeout(() => {
        this.setData({
          toggleSubCategory
        })
      }, 700)
    }
  },
  // 输入搜索文字
  searchInput (e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  // 搜索
  searchConfirm (e) {
    // 导航到搜索页
    wx.navigateTo({
      url: `/pages/search_result/index?key=${e.detail.value}`,
    });
  },
  // 切换价格排序
  changePriceOrder () {
    let { priceOrder } = this.data;

    this.setData({
      priceOrder: priceOrder === 0 ? 1 : 0,
      page: 0,
      isMore: true,
      isLoadingMore: false,
      list: []
    });
    this.getProductList()
  },
  // 改变左侧menu序号
  changeTab (e) {
    let idx = e.currentTarget.dataset.index;
    let { navList } = this.data;

    // 如果有子分类，则显示子分类
    if(navList[idx].childCategory.length > 0){
      this.setData({
        navIndex: idx,
        selectedNav: navList[idx]
      });

      this.toggleSubCategory();
    } else {
      // 否则，直接请求分类列表数据
      this.setData({
        navIndex: idx,
        page: 0,
        isMore: true,
        isLoadingMore: false,
        list: []
      });

      // 获取新的分类商品列表
      this.getProductList(navList[idx].id);
    }
  },
  // 确定子导航
  confirmSubNav () {
    
  },
  // 获取数据
  getData(){
    wx.showLoading();
    http.request({
      url: api.category,
      data: {
        categoryType: 'CATEGORY'
      }
    }).then((res) => {
      let data = res.data;
      wx.hideLoading();

      this.setData({
        navList: data
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
      navList
    } = this.data;

    wx.showLoading();
    http.request({
      url: `${api.category_products}${navList[navIndex].id}`,
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
  onShow () {
    // 获取用户的信息
    app.getUserInfo()
      .then((res) => {
        // 如果用户审核通过(1)，则进入系统
        if (res.status.id == 1) {
          this.getData();
        } else if (res.status.id == 2) {
          // 如果正在审核中(2)、则页面显示正在审核，不进入系统
        } else if (res.status.id == -1 || res.status.id == 0) {
          // 如果用户未审核(-1)、审核拒绝(0)，则提示扫码注册
          wx.showModal({
            title: '提示',
            content: '对不起，您还未注册，请扫码注册'
          })
        }

        this.setData({
          userInfo: res
        });
      }, () => {});
  },
  onLoad(){
    let bgAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })

    let subAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })

    this.bgAnimation = bgAnimation;
    this.subAnimation = subAnimation;
  },
})
