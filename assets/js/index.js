$(function () {

    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()

    //退出按钮事件操作
    $('#btnLogout').on('click', function () {

        //提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清空本地存储中的token
            localStorage.removeItem('token');

            // 跳转页面到登录页面
            location.href = '/login.html';

            //关闭询问框
            layer.close(index);
        });


    })

})
// 请求数据
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象    
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用渲染函数
            renderAvatar(res.data);
        },
        //  把complete 放在公共的js里面 在有请求数据的时候就会调用这个函数，就不用一个一个去写了
        // complete: function (res) {
        //     console.log(res);
        //     //在 complete 回调函数中 res.responseJSON 可以拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token，防止有不法分子手动输入token获取数据
        //         localStorage.removeItem('token');

        //         // 强制跳转登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}


//渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 如果有设置了头像就直接渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
        // 如果没有设置头像就直接把用户名的第一个拿过来渲染进去
    } else {
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }

}