var app = getApp()
Page({
  data: {
    // 备注的开关
    addToggle: false,
    list: [1]
  },
  // 显示/隐藏新增备注框
  switchAddRemark: function () {
    // 更新数据
    this.setData({
      addToggle: !this.data.addToggle
    })
  }
})
