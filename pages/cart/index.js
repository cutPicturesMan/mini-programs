import http from '../../public/js/http.js';
import api from '../../public/js/api.js';

Page({
  data: {
    // 购物车数据
    list: [],
    // 是否是编辑模式
    editObj: {},
    // 总价
    totalPrice: 0,
    // 是否全选
    isSelectAll: false,
    // 是否提交中
    isSubmit: false
  },
  // 购物车减
  reduce (e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;

    list[index].quantity--;
    if (list[index].quantity < 1) {
      list[index].quantity = 1;
    }

    list[index].itemPrice = (list[index].quantity * list[index].price).toFixed(2);

    this.setData({
      list: list
    });
    this.countTotalPrice();
  },
  // 输入数字
  inputNumber (e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;
    let num = parseInt(e.detail.value) || 1;

    if (num < 1) {
      num = 1;
      wx.showToast({
        title: '选择的数量不能小于1',
        image: '../../icons/close-circled.png'
      })
    }

    // 如果购买数量大于总库存，则提示
    if (num > list[index].q) {
      num = list[index].q;
      wx.showToast({
        title: '库存不足',
        image: '../../icons/close-circled.png'
      })
    }

    list[index].quantity = num;
    list[index].itemPrice = (list[index].quantity * list[index].price).toFixed(2);

    this.setData({
      list: list
    });
    this.countTotalPrice();
  },
  // 购物车加
  add (e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;

    list[index].quantity++;

    // 如果购买数量大于总库存，则提示
    if (list[index].quantity > list[index].q) {
      list[index].quantity = list[index].q;

      return wx.showToast({
        title: '库存不足',
        image: '../../icons/close-circled.png'
      })
    }

    list[index].itemPrice = (list[index].quantity * list[index].price).toFixed(2);

    this.setData({
      list: list
    });
    this.countTotalPrice();
  },
  // 切换购物车条目的编辑模式
  toggleEdit (e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;

    list[index].isEditPattern = !list[index].isEditPattern;

    this.setData({
      list: list
    });
  },
  // 编辑完成
  conformEdit (e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;

    list[index].isEditPattern = !list[index].isEditPattern;

    this.setData({
      list: list
    });

    wx.showLoading();
    http.request({
      url: `${api.cart}/${list[index].id}`,
      method: 'PUT',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        skuId: list[index].skuId,
        num: list[index].quantity
      }
    }).then((res) => {
      wx.hideLoading();

      this.getData();
    })
  },
  // 选中、不选购物车条目
  addToEditArr (e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;

    list[index].isSelected = !list[index].isSelected;

    this.setData({
      list: list
    });

    this.countTotalPrice();
  },
  // 显示、隐藏详情
  showDetail (e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;

    list[index].isShowDetail = !list[index].isShowDetail;

    this.setData({
      list: list
    });
  },
  // 删除某个条目
  deleteItem (e) {
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;
    let id = list[index].id;
    // 先直接移除数据
    let item = list.splice(index, 1)[0];
    this.setData({
      list: list
    })

    wx.showLoading();
    http.request({
      url: `${api.cart}/${id}`,
      method: 'DELETE'
    }).then((res) => {
      wx.hideLoading();

      if (res.errorCode === 200) {
        wx.showToast({
          title: res.moreInfo || '删除成功',
        })
      } else {
        // 删除失败了，把刚刚移除的数据还原
        list.splice(index, 1, item);

        wx.showToast({
          image: '../../icons/close-circled.png',
          title: res.moreInfo || '删除失败',
        })
      }

      this.setData({
        list: list
      })
      this.countTotalPrice();
    });
  },
  // 全选
  selectAll () {
    let { list, isSelectAll } = this.data;

    list.forEach((item, index) => {
      item.isSelected = !isSelectAll;
    });

    this.setData({
      list: list,
      isSelectAll: !isSelectAll
    });

    this.countTotalPrice();
  },
  // 计算总价
  countTotalPrice () {
    let list = this.data.list;
    let totalPrice = 0;

    list.forEach((item, index) => {
      if(item.isSelected){
        totalPrice += item.price * item.quantity;
      }
    });

    this.setData({
      totalPrice: totalPrice.toFixed(2)
    });
  },
  // 获取购物车数据
  getData () {
    wx.showLoading();
    http.request({
      url: api.cart
    }).then((res) => {
      wx.hideLoading();

      // 为每个数据添加编辑模式标识、选中标识、显示详情标识
      res.data.forEach((item, key) => {
        item.isEditPattern = false;
        item.isSelected = false;
        item.isShowDetail = false;
        item.itemPrice = (item.quantity * item.price).toFixed(2);
      });

      this.setData({
        list: res.data
      });

      this.countTotalPrice();
    });
  },
  // 结算
  submit () {
    let { list, isSubmit } = this.data;
    let cartIds = [];

    list.forEach((item, index) => {
      if (item.isSelected) {
        cartIds.push(item.id);
      }
    });

    if (cartIds.length === 0) {
      return wx.showToast({
        image: '../../icons/close-circled.png',
        title: '请至少选择一个商品'
      })
    }

    // 正在提交中，请勿重复提交
    if(isSubmit){
      return wx.showToast({
        image: '../../icons/close-circled.png',
        title: '正在提交中，请勿重复提交'
      })
    }
    this.setData({
      isSubmit: true
    });

    wx.showLoading();
    http.request({
      url: api.order,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cartIds: cartIds
      }
    }).then((res) => {
      wx.hideLoading();

      if (res.errorCode === 200) {
        wx.showToast({
          title: res.moreInfo || '恭喜你，提交成功'
        })

        setTimeout(()=>{
          this.onLoad();

          wx.navigateTo({
            url: `/pages/order_fill/index?id=${res.data.id}`
          });
        }, 1500);
      } else {
        wx.showToast({
          image: '../../icons/close-circled.png',
          title: res.moreInfo || '对不起，提交失败'
        })
      }

      this.setData({
        isSubmit: false
      });
    });
  },
  onLoad: function () {
    this.getData();
  }
})
