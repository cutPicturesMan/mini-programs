// 订单状态常量
const STATUS = {
  // 待业务员审核
  PENDING_SALEMAN: 'PENDING_SALEMAN',
  // 待经理审核
  EXAMINE_MANAGER: 'EXAMINE_MANAGER',
  // 待财务审核
  EXAMINE_ACCOUNTANT: 'EXAMINE_ACCOUNTANT',
  // 待财务确认
  SUBMITTED: 'SUBMITTED',
  // 财务已确认
  PAID: 'PAID',
  // 待仓管审核
  EXAMINE_FINANCE: 'EXAMINE_FINANCE',
  // 已取消
  CANCELLED: 'CANCELLED',
  // 运输中
  SHIPPED: 'SHIPPED',
  // 确认收货
  CONFIRMED: 'CONFIRMED',
  // 已经结束 -> 即历史订单
  FINISHED: 'FINISHED',
  // 退货中
  BACKING: 'BACKING',
  // 已退货
  BACKED: 'BACKED'
}


export default STATUS;