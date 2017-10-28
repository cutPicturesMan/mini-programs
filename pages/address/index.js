import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

var app = getApp()
Page({
  data: {
    list: [],
    // 是否是选择地址模式
    isSelectPattern: false,
    // 显示第几条数据的删除按钮，-1为不显示
    delIndex: -1
  },
  // 获取收货地址数据
  getAddressList () {
    wx.showLoading();

    http.request({
      url: api.address,
    }).then((res) => {
      wx.hideLoading();

      this.setData({
        list: res.data
      });
    });
  },
  // 新增收货地址
  add () {
    wx.chooseAddress({
      success: (res) => {
        wx.showLoading();
        http.request({
          url: api.address,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: {
            name: res.userName,
            stateProvinceRegion: res.provinceName,
            city: res.cityName,
            county: res.countyName,
            addressLine: res.detailInfo,
            phonePrimary: res.telNumber,
            isDefault: 1,
          },
        }).then((res) => {
          wx.showToast({
            title: res.moreInfo,
          })
          setTimeout(() => {
            this.getAddressList();
          }, 1500)
        });
      }
    })
  },
  // 隐藏删除按钮
  cancelDel () {
    this.setData({
      delIndex: -1
    })
  },
  // 显示删除按钮
  showDel (e) {
    this.setData({
      delIndex: e.currentTarget.dataset.index
    })
  },
  // 选择收货地址
  select (e) {
    let item = e.currentTarget.dataset.item;
    let id = e.currentTarget.dataset.item.id;

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    prevPage.setAddress(item);

    wx.navigateBack({
      delta: 1
    })
  },
  // 删除某个收货地址
  del (e) {
    let id = e.currentTarget.dataset.item.id;
    let index = e.currentTarget.dataset.index;

    wx.showModal({
      content: '确实要删除该条收货地址？',
      success: (res) => {
        if (res.confirm) {
          let list = this.data.list;
          let item = list.splice(index, 1)[0];

          this.setData({
            delIndex: -1,
            list: list
          });

          wx.showLoading();
          http.request({
            url: `${api.address}/${id}`,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'DELETE'
          }).then((res) => {
            if (res.errorCode === 200) {
              wx.showToast({
                title: res.moreInfo,
              })

              setTimeout(() => {
                this.getAddressList();
              }, 1500)
            } else {
              wx.showToast({
                image: '../../icons/close-circled.png',
                title: res.moreInfo || '删除失败',
              })
              // 删除失败，则还原刚刚移除的数据
              list.splice(index, 1, item);
              this.setData({
                list: list
              });
            }
          });
        }
      }
    })
  },
  onLoad (params) {
    this.setData({
      isSelectPattern: !!(params && params.selectPattern)
    });
    this.getAddressList();
  }
})
