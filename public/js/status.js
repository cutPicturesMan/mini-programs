// 订单状态常量
// 0 '' 当前订单
// 1 SUBMITTED  已提交
// 2 PENDING_SALEMAN 业务员审核
// 3 EXAMINE_FINANCE 财务审核
// 4 EXAMINE_MANAGER 经理审核
// 5 PAID       已经支付
// 6 SHIPPED    运输中
// 7 CONFIRMED  确认收货
// 8 FINISHED   已经结束 -> 即历史订单
// 9 CANCELLED  已取消
// 10 BACKING    退货中
// 11 BACKED     已退货

const STATUS = [
  '',
  'PENDING_SALEMAN',
  'EXAMINE_FINANCE',
  'EXAMINE_MANAGER',
  'SUBMITTED',
  'CANCELLED',
  'PAID',
  'SHIPPED',
  'CONFIRMED',
  'FINISHED',
  'BACKING',
  'BACKED',
  'CANCELLED'
];

export default STATUS;