import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

var app = getApp()
Page({
  data: {
    // 商品详情
    product: {},
    // 商品规格
    sku: [],
    // 默认选中的规格，-1表示初始时什么都没选中
    skuIndex: -1,
    // 选择的数量
    num: 1,
    // 是否正在提交中
    isSubmit: false,
    bannerSlider: {
      imgUrls: [
        '../../testimg/good.jpg',
        '../../testimg/good.jpg',
        '../../testimg/good.jpg'
      ],
      indicatorDots: true,
      circular: true,
      autoplay: false,
      interval: 3000,
      duration: 500
    },
  },
  // 获取商品数据
  getData (id) {
    wx.showLoading();

    http.request({
      url: `${api.product}${id}`,
    }).then((res) => {
      wx.hideLoading();

      this.setData({
        product: res.data
      });

      this.getSku(id);
    });
  },
  // 获取商品规格
  getSku (id) {
    http.request({
      url: `${api.product_sku}${id}`,
    }).then((res) => {
      wx.hideLoading();

      res.data.forEach((item, cIdx) => {
        let sku = JSON.parse(item.optJson);
        let titleArr = [];
        sku.forEach((item, iIdx) => {
          titleArr.push(`${item.optk}:${item.optv}`);
        });
        item.title = titleArr.join(',');
      });

      // 有规格数据，则默认选中第一个规格
      this.setData({
        sku: res.data,
        skuIndex: (res.data.length != 0 && 0)
      });
    });
  },
  // 选择商品规格
  selectSku (e) {
    let index = e.currentTarget.dataset.index;
    let { sku, num } = this.data;

    // 如果购买数量大于总库存，则提示
    if (num > sku[index].q) {
      num = sku[index].q;
    }

    this.setData({
      num: num,
      skuIndex: index
    });
  },
  // 减少数量
  reduce () {
    let num = this.data.num;
    num--;
    if (num < 1) {
      num = 1;
    }

    this.setData({
      num: num
    });
  },
  // 输入数量
  inputNumber (e) {
    let { sku, skuIndex } = this.data;
    let num = parseInt(e.detail.value) || 1;

    if (num < 1) {
      num = 1;
      wx.showToast({
        title: '选择的数量不能小于1',
        image: '../../icons/close-circled.png'
      })
    }

    // 如果购买数量大于总库存，则提示
    if (num > sku[skuIndex].q) {
      num = sku[skuIndex].q;
      wx.showToast({
        title: '库存不足',
        image: '../../icons/close-circled.png'
      })
    }

    this.setData({
      num: num
    });
  },
  // 增加数量
  add () {
    let { sku, skuIndex, num } = this.data;
    num++;

    // 如果购买数量大于总库存，则提示
    if (num > sku[skuIndex].q) {
      num = sku[skuIndex].q;

      return wx.showToast({
        title: '库存不足',
        image: '../../icons/close-circled.png'
      })
    }

    this.setData({
      num: num
    });
  },
  // 加入购物车
  buy () {
    let { sku, skuIndex, num } = this.data;

    // 如果未选规格，则返回
    if (skuIndex < 0) {
      return wx.showToast({
        title: '后台未设置规格',
        image: '../../icons/close-circled.png'
      })
    } else if (num > sku[skuIndex].q) {
      // 请求错误
      return wx.showToast({
        title: '库存不足',
        image: '../../icons/close-circled.png'
      })
    }

    this.setData({
      isSubmit: true
    });

    wx.showLoading();
    http.request({
      url: api.cart,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        num: num,
        skuId: sku[skuIndex].skuId
      }
    }).then((res) => {
      wx.hideLoading();

      if (res.errorCode === 200) {
        wx.showToast({
          title: res.data,
          duration: 2500
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/cart/index',
            success: (e) => {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          });
        }, 2500);
      } else {
        this.setData({
          isSubmit: false
        });
        wx.showToast({
          title: res.data || '提交失败',
          image: '../../icons/close-circled.png'
        })
      }
    });
  },
  onLoad: function (url) {
    console.log(url);
    this.getData(url.id);
  }
})
