import http from '../../public/js/http.js';
import api from '../../public/js/api.js';
import WXPage from '../Page';

let app = getApp();

new WXPage({
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
        isSelectAll: false,
        list: res.data
      });

      this.countTotalPrice();
    });
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
      this.toast.error({
        content: '选择的数量不能小于1'
      })
    }

    // 如果购买数量大于总库存，则提示
    if (num > list[index].q) {
      num = list[index].q;
      this.toast.error({
        content: '库存不足'
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

      return this.toast.error({
        content: '库存不足'
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

    this.setData({
      [`list[${index}].isSelected`]: !list[index].isSelected
    });

    this.countTotalPrice();
    this.judgeSelectAll();
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
        this.toast.success({
          content: res.moreInfo || '删除成功'
        })
      } else {
        // 删除失败了，把刚刚移除的数据还原
        list.splice(index, 1, item);

        this.toast.error({
          content: res.moreInfo || '删除失败'
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
  // 判断是否已经全选
  judgeSelectAll () {
    let list = this.data.list;

    let isSelectAll = list.every((item)=>{
      return item.isSelected;
    });

    this.setData({
      isSelectAll
    })
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
      return this.toast.error({
        content: '请至少选择一个商品'
      })
    }

    // 正在提交中，请勿重复提交
    if(isSubmit){
      return this.toast.error({
        content: '正在提交中，请勿重复提交'
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
        this.toast.success({
          content: res.moreInfo || '恭喜你，提交成功'
        })

        setTimeout(()=>{
          this.onLoad();

          wx.navigateTo({
            url: `/pages/order_fill/index?id=${res.data.id}`
          });
        }, 1500);
      } else {
        this.toast.error({
          content: res.moreInfo || '对不起，提交失败'
        })
      }

      this.setData({
        isSubmit: false
      });
    }).catch(() => {
      this.setData({
        isSubmit: false
      });
    });
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
  }
})
