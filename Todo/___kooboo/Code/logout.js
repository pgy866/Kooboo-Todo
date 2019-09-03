k.user.logout();
k.response.json({
    message: '退出成功'
})
k.response.redirect("/");