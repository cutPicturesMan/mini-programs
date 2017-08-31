const utils = {
  /**
   * 将时间戳格式化为时间 '2017-05-26 09:06:03'
   * @param time 日期，默认为今天
   * @param format 格式化后的排版
   * @returns {string}
   */
  formatDate (time = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
    var obj = {
      YYYY: time.getFullYear(),
      MM: ('0' + (time.getMonth() + 1)).slice(-2),
      DD: ('0' + time.getDate()).slice(-2),
      HH: ('0' + time.getHours()).slice(-2),
      mm: ('0' + time.getMinutes()).slice(-2),
      ss: ('0' + time.getSeconds()).slice(-2),
      w: ['日', '一', '二', '三', '四', '五', '六'][time.getDay()],
      YY: ('' + time.getFullYear()).slice(-2),
      M: time.getMonth() + 1,
      D: time.getDate(),
      H: time.getHours(),
      m: time.getMinutes(),
      s: time.getSeconds()
    };

    // 循环错误对象的键组成的数组
    Object.keys(obj).forEach((value) => {
      format = format.replace(value, obj[value]);
    });

    return format;
  }
}

module.exports = utils;