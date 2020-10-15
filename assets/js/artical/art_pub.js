$(function () {
    const { layer, form } = layui;

    initCate();

    // 定义加载文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化分类失败')
                }
                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                form.render();
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

    // 选择封面按钮点击后触发 选择文件上传 按钮 点击
    $('#btnChosseImage').on('click', function () {
        $('#coverFile').click()
    })


    // 监听文件选择框 并且重新设置裁剪图片
    $('#coverFile').on('change', function (e) {
        // console.log(e);
        var filelist = e.target.files;
        // 判断上传文件装的那个框有没有装东西
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }

        // 1. 拿到用户选择的文件
        var file = filelist[0];

        // 3. 重新初始化裁剪区域
        var imgURL = URL.createObjectURL(file);

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 用以存储文章是否发布
    var art_state = '已发布';


    $('#btnSave2').on('click', function () {
        art_state = '草稿'

    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();

        const fd = new FormData($(this)[0])

        //文章发布状态添加到表单中
        fd.append('state', art_state)
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
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/artical/art_list.html'
            }
        })
    }




})