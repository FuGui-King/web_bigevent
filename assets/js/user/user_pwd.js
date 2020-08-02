$(function() {
    // 1. 获取 layui 提供的成员
    var form = layui.form;
    // 2. 自定义 form 校验规则
    form.verify({
        // 密码长度
        pwd:[/^\S{6,12}$/, '密码必须6到12位，切不能出现空格'],
        // 新密码和原密码不能一样
        samePwd: function(val) {
            if(val === $('[name=oldPwd]').val()) {
                return '新密码不能和原密码一样！'
            }
        },
        // 确认新密码和修改密码一致
        rePwd: function(val) {
            if(val !== $('[name=newPwd]').val()) {
                return '两次输入的密码不一致！'
            }
        }
    })

    // 3.修改密码
    $('.layui-form').on('submit',function(e) {
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method:'post',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                console.log(res)
                if(res.status !== 0) {
                    return layui.layer.msg(res.message)
                } else {
                    layui.layer.msg('密码修改成功！')
                    // 重置表单
                    $('.layui-form')[0].reset()
                }
            }
        })
    })

})