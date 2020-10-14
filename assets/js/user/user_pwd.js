$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 自定义规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        samePwd: function (value) {
            if (value === $('input[name=oldPwd]').val()) {
                return '新密码不能与旧密码一样'
            }
        },

        rePwd: function (value) {
            if (value !== $('input[name=newPwd]').val()) {
                return '两次输入的密码不一致'
            }
        }


    })


    // 表单监听 重置密码模块
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败');
                }
                layer.msg('更新密码成功')
                // 重置密码框 (要使用原生 DOM 方法去操作layui-form表单重置)
                $('.layui-form')[0].reset();
            }
        })
    })


})