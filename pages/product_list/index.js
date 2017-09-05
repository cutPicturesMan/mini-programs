var app = getApp()
Page({
  data: {
    // 新增备注开关
    addToggle: false
  },
  // 显示/隐藏新增备注框
  switchAddRemark: function () {
    console.log(111);
    console.log(this.data.addToggle);
    // 更新数据
    this.setData({
      addToggle: !this.data.addToggle
    })
  }
})
