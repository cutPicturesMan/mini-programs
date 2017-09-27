import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

let { formatDate } = require('../../public/js/utils.js');

Page({
  data: {
    id: 0,
    // 购物车的数据
    order: {},
    // 备注开关
    remarkToggle: false,
    // 收货地址是否加载完毕
    isAddressLoaded: false,
    // 是否处在提交阶段
    isSubmit: false,
    // 商品总数
    totalCount: 0,
    // remark临时输入值
    remarkText: '',
    // 特价
    offerPrice: '',
    // 最后提交的remark
    remark: '',
    // 收货地址
    address: [],
    // 交货日期
    date: formatDate(new Date(), 'YYYY-MM-DD'),
  },
  // 显示/隐藏新增备注框
  switchRemark: function () {
    let { remark, remarkToggle } = this.data;

    // 如果是开启备注弹框，则把确认的备注值赋给临时的备注值
    if (!remarkToggle) {
      this.setData({
        remarkText: remark,
        remarkToggle: !remarkToggle
      })
    } else {
      this.setData({
        remarkToggle: !remarkToggle
      })
    }
  },
  // 输入备注
  inputRemarkText (e) {
    this.setData({
      remarkText: e.detail.value
    });
  },
  // 确认备注
  confirmRemark () {
    let remarkText = this.data.remarkText;

    this.setData({
      remark: remarkText
    });

    this.switchRemark();
  },
  // 输入特价
  inputOfferPrice: function (e) {
    this.setData({
      offerPrice: e.detail.value
    })
  },
  // 选择日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 获取数据
  getData (id) {
    this.setData({
      order: wx.getStorageSync('checkout').data
    });

    wx.showLoading();
    http.request({
      url: `${api.order}${id}`,
    }).then((res) => {
      let totalCount = 0;
      wx.hideLoading();

      res.data.orderItems.forEach((item, index) => {
        totalCount += item.quantity;
      });

      this.setData({
        order: res.data,
        offerPrice: res.data.amount,
        totalCount: totalCount
      });
    });
  },
  setAddress (item) {
    let address = this.data.address;
    address.splice(0, 1, item);

    this.setData({
      address: address
    });
  },
  // 获取默认收货地址
  getAddress () {
    wx.showLoading();
    http.request({
      url: api.address,
    }).then((res) => {
      wx.hideLoading();

      this.setData({
        isAddressLoaded: true
      });

      if (res.errorCode === 200) {
        // 没有收货地址，则直接提示去新增
        if (res.data.length === 0) {
          return;
        } else {
          // 有收货地址，则检查是否有默认收货地址，否则选择地址第一个
          let hasDefault = false;
          let address = [];

          res.data.some((item, index) => {
            if (item.default) {
              hasDefault = true;
              address.push(item);
              return true;
            } else {
              return false;
            }
          });

          if (!hasDefault) {
            address.push[res.data[0]];
          }

          this.setData({
            address
          })
        }
      }
    });
  },
  // 选择收货地址
  selectAddress () {
    let { id, isAddressLoaded } = this.data;

    // 如果收货地址加载完，则可以跳转选择
    if (isAddressLoaded) {
      wx.navigateTo({
        url: `/pages/address/index?selectPattern=1`
      });
    } else {
      // 如果收货地址未加载完，则提示
      wx.showToast({
        image: '../../icons/close-circled.png',
        title: '收货地址加载中'
      })
    }
  },
  // 提交订单
  submit () {
    let { id, remark, offerPrice, address, date, isSubmit } = this.data;

    // 正在提交中，请勿重复提交
    if (isSubmit) {
      return wx.showToast({
        image: '../../icons/close-circled.png',
        title: '正在提交中，请勿重复提交'
      })
    }

    try {
      // 如果id为0，则提示
      if (!id) {
        throw new Error(`订单id无效，id=${id}`);
      }
      // 如果特价为空，则提示
      if (offerPrice === '') {
        throw new Error('特价未填写');
      }
      // 如果收货地址为空，则提示
      if (address.length === 0) {
        throw new Error('收货地址未选择');
      }
      // 如果日期为空，则提示
      if (date.length === 0) {
        throw new Error('日期未选择');
      }
    } catch (e) {
      return wx.showToast({
        title: e.message,
        image: '../../icons/close-circled.png'
      })
    }

    wx.showLoading();
    http.request({
      url: `${api.order}${id}`,
      method: 'PUT',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        addressId: address[0].id,
        remarks: remark,
        deliveryDate: new Date(date).getTime(),
        offerPrice: offerPrice
      }
    }).then((res) => {
      if (res.errorCode === 200) {
        wx.showToast({
          title: res.moreInfo || '恭喜你，订单创建成功'
        })

        setTimeout(() => {
          wx.switchTab({
            url: `/pages/order/index`,
            success: (e) => {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          });
        }, 1500);
      } else {
        wx.showToast({
          image: '../../icons/close-circled.png',
          title: res.moreInfo || '对不起，订单创建失败'
        })

        this.setData({
          isSubmit: false
        });
      }
    });
  },
  onLoad: function (params) {
    let id = params.id || 26;
    this.getData(id);
    this.getAddress();
    this.setData({
      id
    });
  }
})
