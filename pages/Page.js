import toast from '../common/toast/toast'

class WXPage{
  constructor(obj){
    obj.toast = toast
    Page(obj)
  }
}

export default WXPage
