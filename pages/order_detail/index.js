let { formatDate } = require('../../public/js/utils.js');

Page({
  data: {
    promptToggle: false,
    isCancel: false,
    form: {
      cheapMoney: '',
      remark: '',
      date: formatDate(new Date(), 'YYYY-MM-DD'),
    }
  },
  listCancel() {
    this.setData({
      promptToggle: true,
      isCancel: true
    });

    setTimeout(()=>{
      this.setData({
        promptToggle: false
      });
    }, 2000)
  },
})
