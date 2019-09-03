var member = k.request.username;
var user = k.User.Get(member);
if (!user) {
    k.response.json({
        success: false,
        message: '未找到该用户',
        model: ''
    })
} else {
    k.response.json({
        success: true,
        message: '搜索成功',
        model: user
    })
}
