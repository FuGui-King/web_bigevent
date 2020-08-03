$(function () {
    // 定义一个全局变量 存储分页参数
    var p = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: "", //文章分类的 Id
        state: "",  // 文章的状态 可选值有 ： 已发布、草稿
    }

    initTable()

    // 获取文章列表数据的方法

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                // 文章分页
                renderPage(res.total)
            }
        })
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initCate()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            data: {},
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的 UI 结构
                layui.form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 p 中对应的属性赋值
        p.cate_id = cate_id;
        p.state = state;
        // 根据最新的筛选条件 重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    var laypage = layui.laypage;
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号,
            count: total, //数据总数，从服务端得到
            limit: p.pagesize, // 每页显示几条数据
            curr: p.pagenum, // 设置默认被选中的分页
            limits: [1,2,3,5,10], // 每页显示多少条数据的选择器
            layout:['count','limit','prev','page','next','skip'],
            // 分页发生切换的时候 触发 jump 回调
            // 触发 jump 回调方式有：
            // 1. 点击页码的时候， 会触发 jump 回调
            // 2. 只要调用了  laypage.render() 方法 就会触发jump 回调
            jump: function (obj, first) {
                // 可以通过first 的值 来判断是通过哪种方式 触发的jump 回调
                // 如果first 的值为true 证明是方式2 触发的
                // 否则就是方式1 触发的
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(first);
                // 把最新的页码值 赋值到 p 这个查询参数对象中
                p.pagenum = obj.curr
                // 把最新的条目数，赋值到p 这个查询参数对象的pagesize属性中
                p.pagesize = obj.limit;
                // 根据最新的 p 获取对应的数据列表 并渲染表格
                // 此时如果直接调用initTable() 会出现死循环
                if(!first) {
                    initTable()
                }
            }

        })
    }

    // 通过代理的形式 为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn-delete',function() {
        // 获取文章的id
        var id = $(this).attr('data-id');
        var len = $('.btn-delete').length;
        // 询问用户是否要删除数据
        layer.confirm('当真要删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'get',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后 需要判断当前这一页中 是否还有剩余的数据
                    // 如果没有剩余的数据  则让页码值 -1 之后,再重新调用 initTable
                    if(len === 1 && p.pagenum > 1 && p.pagenum --);
                    initTable()
                }
            })

            layer.close(index)
            
          });
    })


})