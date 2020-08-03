$(function () {

    // 1. 文章分类列表渲染
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                // 模板引擎渲染 传递对象 使用属性
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList()

    // 2. 添加文章分类
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 3. 文章分类添加
    var indexAdd = null;
    $('body').on('submit', '#boxAddCate', function (e) {
        e.preventDefault()
        // console.log($(this).serialize())
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return laiui.layer.msg('新增文章分类失败！')
                }
                initArtCateList()
                layui.layer.msg('新增文章分类成功！')
                layui.layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式 为btn-edit 按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layui.layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'get',
            // 通过 / 后面添加请求参数  像/?id=1&name=2
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                console.log(res.data)
                layui.form.val('dialog-edit', res.data)
            }
        })
    })

    // 通过代理的形式 为修改分类的表单绑定 submit事件
    $('body').on('submit', '#boxEditCate', function (e) {
        e.preventDefault()
        // console.log($(this).serialize())
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return laiui.layer.msg('更新文章分类失败！')
                }
                initArtCateList()
                layui.layer.msg('更新文章分类成功！')
                layui.layer.close(indexEdit)
            }
        })
    })

    // 通过代理的形式 为btn-delete 按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('真的要删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        })
    })
})