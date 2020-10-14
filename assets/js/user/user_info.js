$(function () {
    //解构layui里面的属性
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })


    //初始化用户的基本信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res.data);

                // 可以将拿到的数据赋值到表单中，前提是表单要添加一个lay-filter="formUserInfo"这样一个属性，请查看 html 中form的行内样式
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置按钮点击事件
    $('#btnReset').click(function (e) {
        //阻止表单默认行为
        e.preventDefault()

        // 重新获取用户信息，并将其数据渲染到表单上
        initUserInfo();
    })

    //监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0){
                    return layer.msg('更新用户失败')
                }
                layer.msg('更新用户成功')
                //调用父页面的方法，更新信息
                window.parent.getUserInfo();
            }
        })
    })


})