var app = getApp()
Page({
  data: {
    // 新增备注开关
    addToggle: false,
    list: []
  },
  // 显示/隐藏新增备注框
  switchAddRemark: function () {
    console.log(111);
    // 更新数据
    that.setData({
      addToggle: !this.addToggle
    })
  },
  onLoad: function (url) {
    wx.showLoading();
    wx.request({
      url: `${api.product}${url.id}`,
      header: {
        cookie: `SESSION=${app.globalData.sessionId}`
      },
      success: (res) => {
        let data = res.data.data;
        wx.hideLoading();
        console.log(data);
      }
    });
  }
})
