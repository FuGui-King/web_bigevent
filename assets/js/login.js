$(function () {
  // 1.点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 2. 定义 layui 表单验证规则
  var form = layui.form;
  // 利用form对象 创建规则
  form.verify({
    // 属性的值可以是数组 也可以是函数
    pwd: [/^\S{6,12}$/, "密码为6~ 12位，不能包含空格"],
    repwd: function (value) {
      if ($('#reg-pwd').val() !== value) {
        return "两次密码不一致"
      }
    }
  })

  // 3.注册功能
  var form = layui.layer;
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    console.log($('#form_reg').serialize())

    $.ajax({
      method: 'post',
      url: '/api/reguser',
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg input[name=password]").val()
      },
      success: function (res) {
        // 注册失败校验
        if (res.status != 0) {
          return layer.msg(res.message);
        }
        // 注册成功
        layer.msg(res.message);
        // 触动切换到登录的a链接的点击行为
        $('#link_login').click();
        // 清空列表
        $('#form_reg')[0].reset()
      }
    })
  })

  // 4. 登录功能
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      method: 'post',
      url: '/api/login',
      // 快速获取表单的值
      data: $(this).serialize(),
      success: function (res) {
        // 注册失败校验
        if (res.status != 0) {
          return layer.msg(res.message);
        }
        // 注册成功
        layer.msg(res.message);
        // 保存token
        localStorage.setItem('token', res.token)
        // 页面跳转
        location.href = '/index.html';
      }

    })
  })

})