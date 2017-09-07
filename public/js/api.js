let api = {
  login: '/site/wx/login',
}

for(var attr in api){
  api[attr] = 'https://www.byunfu.com' + api[attr];
}

export default api;