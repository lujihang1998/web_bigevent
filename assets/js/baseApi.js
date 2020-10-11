// 每次调用 $.get() 或 $.post() 或 $.ajax()的时候，会调用 ajaxPrefilter 这个函数

//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //此步的目的 是在执行ajax会先改变 配置里的url，然后再去该地址请求数据
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})