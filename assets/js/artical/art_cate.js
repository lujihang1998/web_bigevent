$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    //初始化
    function initArtCateList() {
        $.ajax({
            mmethod: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取类别失败')
                }

                // 将得到的数据传到模板引擎的模板中
                const htmlstring = template('tpl-table', res);
                // 模板作为内容渲染到tbody中
                $('tbody').html(htmlstring)
            }

        })
    }

    var index = null;
    // 添加按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        // 调用弹出框的时候会返回一个索引，只需要接收下，然后就可以知道要关闭那个弹出框了
        index = layer.open({
            // 将type改成1就可以去掉确定按钮，默认是0
            type: '1',
            // 设置弹出框的大小
            area: ['500px', '250px'],
            title: '添加文章类别'
            , content: $('#dialog-add').html()
        })
    })

    // 数据因为是动态添加的所以用事件委托的方法
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增分类成功！')
                // 关闭弹出框
                layer.close(index);
            }
        })
    })

    var indexEdit = null;
    // 通过代理的形式，给编辑按钮添加点击事件
    $('tbody').on('click', '#btn-edit', function () {
        // 调用弹出框的时候会返回一个索引，只需要接收下，然后就可以知道要关闭那个弹出框了
        indexEdit = layer.open({
            // 将type改成1就可以去掉确定按钮，默认是0
            type: '1',
            // 设置弹出框的大小
            area: ['500px', '250px'],
            title: '编辑文章类别'
            , content: $('#dialog-edit').html()
        })
        // 获取自定义属性(当前表单的id值)
        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // layui 里面form.val('filter', object);用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
                form.val('form-edit', res.data)
            }
        })
    })

    // 确定修改按钮点击事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList();
            }
        })
    })

    //通过代理的形式，给删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');

        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList();
                }
            })
        });

    })







})