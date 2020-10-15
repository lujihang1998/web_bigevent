$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //数据渲染完，渲染分页
                renderPage(res.total);
                // res.total是总页面的值
            }
        })
    }


    //   初始化文章分类的方法

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')

                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // layui 的form表单需要重新渲染一遍
                form.render()
            }
        })
    }




    //表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()

        q.cate_id = cate_id;
        q.state = state;

        initTable()
    })

    // 渲染分页
    function renderPage(total) {

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total,//数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum,  //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            theme: '#c00',
            jump: function (obj, first) {
                // obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                q.pagenum = obj.curr; //将当前这页的页码给q参数对象
                q.pagesize = obj.limit; // 将当前的需要显示几条赋值给q参数对象

                // 点击的时候first 是undifined 通过函数调用 first 是true
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });

    }


    // 代理绑定删除事件

    $('tbody').on('click', '.btn-delete', function () {

        // 获取点击时  页面上还有几个删除按钮
        var len = $('.btn-delete').length;


        // 获取文章的id
        var id = $(this).attr('data-id');

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 判断当前页面是否还剩下数据，没有就让页面值减一
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    //重新渲染页面
                    initTable();
                }
            })
            layer.close(index);
        });

    })










})
