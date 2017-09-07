let api = {
  productSearch: '/product/search',
  login: '/wx/login',
}

for(var attr in api){
  api[attr] = 'https://www.byunfu.com/site' + api[attr];
}

export default api;