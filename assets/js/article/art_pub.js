$(function () {

    let layer = layui.layer;
    let form = layui.form;
    initCate()

    // 定义加载文章分类的方法

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            data: {},
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎 渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听 coverFile 的change事件 获取用户选择的文件列表
    // 4. 修改文字封面
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return '请选择文件'
        }
        // 根据文件 创建对用的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 5.1 确定发布状态 可以先设定个默认值
    var state = "已发布";
    // $('#btnSave1').click(function() {
    //     state =  "已发布";
    // })
    $('#btnSave2').click(function () {
        state = "草稿";
    })
    // 5.2 添加文章（上面的两个按钮 点击哪个都会触发）
    $('#form-add').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append('state', state);
        // console.log(...fd)
        // 生成的二进制文件  base64是字符串  二进制图片文件
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // console.log(...fd);
                publishArticle(fd)
                // 6. 发起 ajax 数据请求
                //   ajax一定要放到回调函数里面
                // 因为生成文件是耗时操作 异步 所以必须保证发送ajax的时候图片已经生成 所以必须写到回调函数中
                 //  小bug：发布完文章后跳转 类名layui-this
                 window.parent.document.querySelector('#list2').click();
                //  window.parent.document.querySelector('#list2').className = 'layui-this';
                //  window.parent.document.querySelector('#list3').className = '';
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method:'post',
            url:'/my/article/add',
            data:fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据
            // 必须添加一下两个配置项
            contentType: false,
            processData: false,
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后 跳转到文章列表页面
                location.href = '/article/art_list.html'
               
            }
        })
    }

})