// 每次调用 $.get() 或 $.post() 或 $.ajax()的时候，会调用 ajaxPrefilter 这个函数

//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //此步的目的 是在执行ajax会先改变 配置里的url，然后再去该地址请求数据
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    //统一为有权限的接口 设置header 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function (res) {
        console.log(res);
        //在 complete 回调函数中 res.responseJSON 可以拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token，防止有不法分子手动输入token获取数据
            localStorage.removeItem('token');

            // 强制跳转登录页面
            location.href = '/login.html'
        }
    }

})