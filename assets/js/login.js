$(function () {
    //点击注册按钮发生的事件
    $('#link_reg').on("click", function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //点击登录按钮发生的事件
    $('#link_login').on("click", function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //1.从layui获取form对象
    var form = layui.form;

    // 1.从layui获取message对象
    var layer = layui.layer;
    //通过form.verify自定义表单规则

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 通过value形参拿到的是确认密码框的内容
            // 将确认密码框的内容与密码框进行比较
            var pwd = $('.reg-box [name = password]').val(); //这个是注册的密码框 
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })


    //监听表单提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止默认行为
        e.preventDefault();
        // 2. 发起Ajax的POST请求
        var data1 = {
            username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
        }
        // 使用ajax提交数据
        $.ajax({
            method: "POST",
            url: '/api/reguser',
            data: data1,
            success: function (res) {

                if (res.status !== 0) {

                    //layer.msg是一个提示框
                    return layer.msg(res.message)
                }
                layer.msg("注册成功");

                //清空
                $('#form_reg input').val('');
                // 模拟点击
                $('#link_login').click();
            }
        })
    })

    // 监听表单登录提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();


        //在执行ajax请求会先执行 ajaxPreflter()这个函数，它可以得到 ajax 的配置对象 ，也就是 url method data success,这些对象集合
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 获取表单上所有输入框的内容。先以键值对再用&拼接所有键值对
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登入失败！')
                }
                layer.msg('登入成功！')

                // 将登录成功得到的token 字符串 ，保存到 localStorage 中 
                localStorage.setItem('token', res.token)
                
                // 跳转到 index 页面
                location.href = '/index.html';
            }
        })
    });








})