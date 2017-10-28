// 订单状态常量
const STATUS = {
  // 业务员审核
  PENDING_SALEMAN: 'PENDING_SALEMAN',
  // 财务审核
  EXAMINE_FINANCE: 'EXAMINE_FINANCE',
  // 经理审核
  EXAMINE_MANAGER: 'EXAMINE_MANAGER',
  // 已提交
  SUBMITTED: 'SUBMITTED',
  // 已取消
  CANCELLED: 'CANCELLED',
  // 已经支付
  PAID: 'PAID',
  // 运输中
  SHIPPED: 'SHIPPED',
  // 确认收货
  CONFIRMED: 'CONFIRMED',
  // 已经结束 -> 即历史订单
  FINISHED: 'FINISHED',
  // 退货中
  BACKING: 'BACKING',
  // 已退货
  BACKED: 'BACKED',
  // 已取消
  CANCELLED: 'CANCELLED'
}


export default STATUS;