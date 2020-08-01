$(function() {
    // 1.获取用户信息
    getUserInfo()

    // 3.退出登录
    var layer = layui.layer;
    $('#btnLogout').on('click',function() {
        layer.confirm('Are u sure delete me?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 关闭提示框
            layer.close(index);
            localStorage.removeItem('token');
            location.href = '/login.html'
          });
    })


})


// 获取用户信息封装
function getUserInfo() {
    $.ajax({
        method:'get',
        url:'/my/userinfo',
        // jquery中的ajax 专门用作设置请求头信息的属性
        //  注意：header属性区分大小写
        // headers:{
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success:function(res){
            // token可能24小时就失效了 所以需要重新登录
            // console.log(res)
            // 1.判断用户信息是否查询成功
            console.log(res)
            // console.log(res.status === 0)
            if(res.status !== 0) {
                // console.log(11111)
                return layui.layer.msg(res.message)
            }
            // 2.调用用户渲染函数
            renderUser(res.data)
        }
    })
}

function renderUser(user) {
    // 1.渲染用户名
    var uname = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uname);
    // 2/ 渲染用户头像
    // 判断 用户头像信息 如果有就渲染图片 如果没有就渲染文字
    if(user.user_pic !== null) {
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avatar').hide()
    }else {
        $('.layui-nav-img').hide()
        $('.text-avatar').show().html(uname[0].toUpperCase())
    }
}