import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import WXPage from '../Page';

var app = getApp()

new WXPage({
  data: {
    // 商品详情
    product: {},
    // 商品规格
    sku: [],
    // 默认选中的规格
    skuIndex: 0,
    // 选择的数量
    num: 1,
    // 是否正在提交中
    isSubmit: false,
    bannerSlider: {
      imgUrls: [],
      indicatorDots: true,
      circular: true,
      autoplay: false,
      interval: 3000,
      duration: 500
    },
    // 数据是否加载完毕
    isLoaded: false,
    // 规格是否查询完毕
    isSkuLoaded: false,
    // 是否支持后台录入的富文本数据
    isSupportRichText: wx.canIUse('rich-text')
  },
  // 获取商品数据
  getData (id) {
    let { bannerSlider } = this.data;

    wx.showLoading();
    http.request({
      url: `${api.product}${id}`,
    }).then((res) => {
      wx.hideLoading();

      if(res.errorCode == 200){
        let skuMedia = res.data.skuMedia;
        let imgs = [];
        let skuMediaKey = Object.keys(skuMedia);

        // 如果找到了主图的key，则放在第一位
        let mainImgIndex = skuMediaKey.indexOf('primary');
        if(!!~mainImgIndex){
          skuMediaKey.splice(mainImgIndex, 1);
          skuMediaKey.unshift('primary');
        }

        skuMediaKey.forEach((key) => {
          // 如果不存在图片地址，则赋值一个默认的图片
          imgs.push(skuMedia[key].url ? skuMedia[key].url + '?imageView/2/1/w/750/h/750' : '../../icons/img-none.png');
      });

        bannerSlider.imgUrls = imgs;

        this.setData({
          bannerSlider,
          product: res.data,
          isLoaded: true
        });

        this.getSku(id);
      } else {
        wx.showModal({
          content: res.moreInfo || '该商品暂无详情',
          showCancel: false,
          confirmText: '返回',
          success: (res)=>{
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
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
        isSkuLoaded: true,
        sku: res.data
      });
    });
  },
  // 选择商品规格
  selectSku (e) {
    let index = e.currentTarget.dataset.index;
    let { sku, num } = this.data;

    try {
      // 如果购买数量大于总库存，则提示
      if (num > sku[index].q) {
        throw new Error('库存不足');
      }
    } catch (e) {
      return this.toast.error({
        content: e.message,
        duration: 3000
      })
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

    try {
      // 无规格
      if (sku.length == 0) {
        throw new Error('该商品没有规格，无法购买');
      }
      if (num < 1) {
        throw new Error('选择的数量不能小于1');
      }
      // 如果购买数量大于总库存，则提示
      if (num > sku[skuIndex].q) {
        throw new Error('库存不足');
      }
    } catch (e) {
      return this.toast.error({
        content: e.message,
        duration: 4000
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

    try {
      // 无规格
      if (sku.length == 0) {
        throw new Error('该商品没有规格，无法购买');
      }

      // 如果购买数量大于总库存，则提示
      if (num > sku[skuIndex].q) {
        throw new Error('库存不足');
      }
    } catch (e) {
      return this.toast.error({
        content: e.message,
        duration: 4000
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
      return this.toast.error({
        content: '后台未设置规格'
      })
    } else if (num > sku[skuIndex].q) {
      // 请求错误
      return this.toast.error({
        content: '库存不足'
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
        this.toast.success({
          content: res.data
        })

        this.setData({
          isSubmit: false
        })
      } else {
        this.setData({
          isSubmit: false
        });

        this.toast.error({
          content: res.data || '提交失败'
        })
      }
    });
  },
  onLoad (params) {
    if (params.id) {
      this.getData(params.id);
    } else {
      this.toast.error({
        content: '请传入商品id'
      })
    }
  }
})
