$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 2.修改上传图片
    $('#btnChooseImg').on('click', function () {
        $('#file').click();
    })

    // 3.上传图片更改 
    $('#file').on('change', function (e) {
        console.log(e.target.files)
        // console.log($('#file')[0].files)
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }
        // console.log(document.querySelector('#file').files);
        // 1.获取唯一的一个文件
        var file = e.target.files[0];
        // 2. 原生js的方法 在内存中生成一个图片的路径
        var newImgURL = URL.createObjectURL(file);
        // 3.渲染到裁剪区
        $image
            .cropper('destroy')  // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)  // 重新初始化裁剪的区域
    })

    // 4.头像上传
    $('#btnUpload').on('click', function () {
        // 获取base64图片 
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        $.ajax({
            method:'post',
            url:'/my/update/avatar',
            data:{
                avatar: dataURL
            },
            success:function(res){
                // 返回校验
                if(res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('头像上传成功！')
                // 刷新父框架中的个人资料
                window.parent.getUserInfo()
            }
        })
    })



})