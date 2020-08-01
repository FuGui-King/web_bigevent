// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// $.ajaxPrefilter(function(options) {
//   // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
//   options.url = 'http://ajax.frontend.itheima.net' + options.url
// })


// 设置路径(测试) 测试用的地址
var baseURL = 'http://ajax.frontend.itheima.net';
// 设置路径(生产)  开发用的地址
// var baseURL = 'http://www.baidu.com'
// 拦截/过滤 每一次ajax请求 配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
  // console.log(options)
  options.url = baseURL + options.url;
  // console.log(options)
  // 判断 请求路径是否有/my/
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 3.所有的请求完成后都要进行身份认证判断:
  options.complete = function(res) {
    var data = res.responseJSON;
    console.log(data)
    if(data.status == 1 && data.message == '身份认证失败！') {
      // 1.删除token
      localStorage.removeItem('token')
      // 2. 页面跳转
      location.href = '/login.html';
    }
  }

});