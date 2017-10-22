import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import Auth from '../../public/js/auth.js';

let app = getApp();
let auth = new Auth();

Page({
  data: {
    // 搜索关键字
    searchText: '',
    // 图片轮播
    bannerSlider: {
      indicatorDots: true,
      circular: true,
      autoplay: false,
      interval: 3000,
      duration: 500
    },
    // 文字轮播
    textSlider: {
      indicatorDots: true,
      circular: true,
      autoplay: false,
      interval: 3000,
      duration: 500,
      vertical: true
    },
    // 分类轮播
    categorySlider: {
      indicatorDots: false,
      circular: false,
      autoplay: false,
      interval: 3000,
      duration: 500,
      vertical: true
    },
    // 幻灯列表
    bannerList: [],
    // 文字轮播
    textList: [
      'iPhone 6定妆照确定了：长这样卖8000你会考虑吗长这样卖8000你会考虑吗长这样卖8000你会考虑吗长这样卖8000你会考虑吗？',
      'iPhone 7定妆照确定了：长这样卖8000你会考虑吗？',
      'iPhone 8定妆照确定了：长这样卖8000你会考虑吗？'
    ],
    // 分类轮播的轮播页数量
    categoryArr: [],
    // 广告列表
    adList: [],
    // 品牌列表
    brankList: [],
    // 商品列表，分类轮播图也取这个数据
    productList: [],
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
  // 获取banner轮播列表
  getBannerList () {
    http.request({
      url: api.category,
      data: {
        categoryType: 'SLIDE'
      }
    }).then((res) => {
      this.setData({
        bannerList: res.data
      });
    })
  },
  // 获取广告列表
  getAdList () {
    http.request({
      url: api.category,
      data: {
        categoryType: 'ADVERT'
      }
    }).then((res) => {
      this.setData({
        adList: res.data
      });
    })
  },
  // 获取品牌列表
  getBrankList () {
    http.request({
      url: api.category,
      data: {
        categoryType: 'BRAND'
      }
    }).then((res) => {
      this.setData({
        brankList: res.data
      });
    })
  },
  // 获取分类页商品分类
  getCategory () {
    wx.showLoading();

    http.request({
      url: api.category,
      data: {
        categoryType: 'CATEGORY'
      }
    }).then((res) => {
      wx.hideLoading();
      let category = res.data;
      let categoryArr = [];

      let cLength = category.length / 5;
      let cLengthCeil = Math.ceil(cLength);

      // 页面上需要循环的分类图标二维数组，一组5个图标
      for (let tabIndex = 1; tabIndex <= cLengthCeil; tabIndex++) {
        let num = 5;

        // 如果是最后一个，则最后的分类图标数有可能不足5个
        if (tabIndex == cLengthCeil) {
          num = category.length - (tabIndex - 1) * 5;
        }

        let list = [];
        // 判断每个分类是否有图标url
        for (let itemIndex = 0; itemIndex < num; itemIndex++) {
          let index = tabIndex * itemIndex;
          // 如果本分类下没有配置图标，则默认本地图标
          if (!category[index].icon) {
            category[index].icon = `../../icons/index-category${itemIndex + 1}.png`;
          }

          list.push(category[index]);
        }

        categoryArr.push(list);
      }

      this.setData({
        categoryArr
      });
    }, () => {
      wx.hideLoading();

      wx.showModal({
        title: '提示',
        content: '对不起，获取商品失败，请重试',
        success: (res) => {
          if (res.confirm) {
            this.getHomeCategory();
          }
        }
      })
    })
  },
  // 获取首页商品分类
  getHomeCategory () {
    wx.showLoading();

    http.request({
      url: api.category,
      data: {
        categoryType: 'HOME'
      }
    }).then((res) => {
      let homeCategory = res.data;
      let goodsArr = [];

      // 循环获取每个分类下的4个商品
      homeCategory.forEach((item) => {
        let q = this.getHomeCategoryGoods(item.id)
          .then((res) => {
            item.goods = res;
          })
          .catch(() => {
            item.goods = [];

            return Promise.reject();
          });

        goodsArr.push(q);
      });

      // 获取完所有分类下的商品之后，进行赋值操作
      Promise.all(goodsArr).then(() => {
        wx.hideLoading();

        this.setData({
          isLoaded: true,
          productList: homeCategory
        });
      }, () => {
        wx.hideLoading();

        wx.showModal({
          title: '提示',
          content: '对不起，获取商品失败，请重试',
          success: (res) => {
            if (res.confirm) {
              this.getHomeCategory();
            }
          }
        })
      })
    })
  },
  // 每个首页商品分类下的相应商品
  getHomeCategoryGoods (id) {
    let q = new Promise((resolve, reject) => {
      http.request({
        url: `${api.category_products}${id}`,
        data: {
          page: 0,
          size: 4,
          ase: 0
        }
      }).then((res) => {
        let data = res.data;

        if (res.errorCode == 200) {
          resolve(data);
        } else {
          reject();
        }
      })
    })

    return q;
  },
  // 获取数据
  getData () {
    // 获取banner列表
    this.getBannerList();
    // 获取分类页分类
    this.getCategory();
    // 获取广告列表
    this.getAdList();
    // 获取品牌列表
    this.getBrankList();
    // 获取首页商品分类
    this.getHomeCategory();
  },
  // 跳转
  jump (e) {
    let { type, id, clength } = e.currentTarget.dataset;

    // 如果有子分类，则跳转子分类页面
    if (clength > 0) {
      wx.navigateTo({
        url: `/pages/shoper/index?id=${id}&type=${type}`
      })
    } else {
      // 如果没有子分类，则跳转搜索页
      wx.navigateTo({
        url: `/pages/search_result/index?id=${id}&type=${type}`
      })
    }
  },
  // 获取用户信息
  getUserInfo () {
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
      }, () => {
      });
  },
  onLoad (params) {
    let customerId = params.customerId;
    let adminId = params.adminId;
    // 如果同时存在客户id和管理员id，表示管理员代下单，要先执行登录流程
    if (customerId && adminId) {
      auth.login({
        customerId,
        adminId
      }).then((res) => {
        if (res.errorCode == 200) {
          this.getUserInfo();
        } else {
          wx.showToast({
            title: res.moreInfo || '代下单登录失败',
            image: '../../icons/close-circled.png'
          })
        }
      }).catch(() => {
        wx.showToast({
          title: '代下单登录失败',
          image: '../../icons/close-circled.png'
        })
      })
    } else {
      this.getUserInfo();
    }
  }
})
