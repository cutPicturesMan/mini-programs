let api = {
  // 获取分类
  category: '/category',
  // 获取分类商品
  category_products: '/category/products/',

  // 获取某个商品
  product: '/product/',
  // 商品搜索
  product_search: '/product/search',

  // 登录
  login: '/wx/login',
}

for (var attr in api) {
  api[attr] = 'https://www.byunfu.com/site' + api[attr];
}

export default api;