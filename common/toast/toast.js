/**
 * 自定义的toast 提示浮层
 */

function show(opt, icon = 'ERROR'){
  if (opt.page) {
    this.page = opt.page
  } else {
    const pages = getCurrentPages()
    this.page = pages[pages.length - 1]
  }

  this.page && this.page.setData({ toast: {} })
  clearTimeout(this.timeoutId)

  this.page.setData({
    toast: {
      icon: opt.icon || toast.ICON[icon],
      content: opt.content,
      isShowToast: true
    }
  })

  if (typeof opt.duration == 'undefined')
    opt.duration = 1500

  if (opt.duration > 0)
    this.timeoutId = setTimeout(this.hide.bind(this), opt.duration)
}

const toast = {
  /**
   * 显示提示浮层
   *
   * @param {object} opt 浮层配置数据
   *   {
	 *     icon - Icon 类型 (toast.ICON.XXX)
	 *     content - 提示内容
	 *     duration - 自动消失时间（毫秒），默认1500
	 *     page - 当前页面对象
	 *   }
   */
  show(opt = {}) {
    show.call(this, opt, 'SUCCESS')
  },

  success(opt = {}) {
    show.call(this, opt, 'SUCCESS')
  },

  error(opt = {}) {
    show.call(this, opt)
  },

  loading(opt = {}) {
    show.call(this, opt, 'LOADING')
  },

  /**
   * 隐藏提示浮层
   */
  hide() {
    clearTimeout(this.timeoutId)
    this.page && this.page.setData({
      toast: {
        isShowToast: false
      }
    })
    delete this.page
  }
}

/**
 * Icon 类型
 */
toast.ICON = {
  SUCCESS : 'success_circle',
  LOADING : 'waiting',
  INFO    : 'info',
  SEARCH  : 'search',
  WARNING : 'warn',
  ERROR   : 'cancel'
}

export default toast
