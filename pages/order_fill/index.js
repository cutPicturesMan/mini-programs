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
    // remark临时输入值
    remarkText: '',
    // 特价
    cheapMoney: '',
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
      wx.hideLoading();

      this.setData({
        order: res.data
      });
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

      if(res.errorCode === 200){
        // 没有收货地址，则直接提示去新增
        if(res.data.length === 0){
          return;
        } else {
          // 有收货地址，则检查是否有默认收货地址，否则选择地址第一个
          let hasDefault = false;
          let address = [];

          res.data.some((item, index) => {
            if(item.default){
              hasDefault = true;
              address.push(item);
              return true;
            }else{
              return false;
            }
          });

          if(!hasDefault){
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
  selectAddress(){
    let { id, isAddressLoaded } = this.data;

    // 如果收货地址加载完，则可以跳转选择
    if(isAddressLoaded){
      wx.navigateTo({
        url: `/pages/address/index?select=1&orderId=${id}`
      });
    } else {
      // 如果收货地址未加载完，则提示
      wx.showToast({
        image: '../../icons/close-circled.png',
        title: '收货地址加载中'
      })
    }
  },
  onLoad: function (params) {
    let id = params.id || 20;
    this.getData(id);
    this.getAddress();
    this.setData({
      id
    });
  }
})
