var member = k.User.Get(k.request.member);
var user = k.User.Get(k.user.userName);
if (member) {
    var userMember = k.database.user_member;
    var isMember = userMember.find("employee=="+user.UserName+" && superior=="+ member.UserName);
    if(!isMember) {
        k.response.json({
            success: false,
            message: '该成员不存在'
        })
    }else {
        userMember.delete(isMember._id);
        k.response.json({
            success: true,
            message: '移除上级成功'
        })
    }
} else {
    k.response.json({
        success: false,
        message: '该成员不存在'
    }) 
}