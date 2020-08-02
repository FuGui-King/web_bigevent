$(function() {


    //1. 定义校验规则
    var form = layui.form;
    var layer = layui.layer;    
    form.verify({
        nickname:function(value) {
            if(value.length > 6) {
                return "昵称请输入 1 ~ 6 位之间！"
            }
        }
    });


    // 2. 初始化用户信息
    initUserInfo()

    function initUserInfo(){
        $.ajax({
            method:'get',
            url:'/my/userinfo',
            success:function(res){
                // 获取用户信息校验
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 展示用户信息
                obj = res.data;
                form.val('formUserInfo', res.data)
            }
        })
    }
    
    // 3.重置（只接受click事件绑定）
    var obj = null;
    $('#btnReset').on('click',function(e) {
        // 取消浏览器的重置操作行为(取消清空表单功能)
        e.preventDefault()
        // initUserInfo()
        form.val('formUserInfo', obj)
    })

    // 4.提交用户修改
    $('.layui-form').on('submit',function(e) {
        // 取消form表单的默认提交行为 改为ajax提交
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg('用户信息修改失败！')
                }else {
                    layer.msg('Perfect！用户信息修改成功！')
                    // 刷新父框架里面的用户信息
                    window.parent.getUserInfo()
                    $('.layui-form')[0].reset()
                    console.log($('.layui-form')[0])
                }
            }
        })
    })
})