var member = k.User.Get(k.request.member);
var user = k.User.Get(k.user.userName);
if (member) {
    var userMember = k.database.user_member;
    /* Find the membership in the user_member table */
    var isMember = userMember.find("employee==" + user.UserName + " && superior==" + member.UserName);
    if (isMember) {
        k.response.json({
            success: false,
            message: '该用户已存在',
            model: k.request
        })
    } else if (user.Id == member.Id) {
        k.response.json({
            success: false,
            message: '你已经在系统中'
        })
    } else {
        var obj = {
            "employee": user.UserName,
            "employeeId": user.Id,
            "superior": member.UserName,
            "superiorId": member.Id
        }
        userMember.add(obj);
        /* Get all the superiors of the current user*/
        var allMembers = userMember.findAll("employee", k.user.userName);
        var membersName = [];
        if (allMembers.length > 0) {
            allMembers.forEach(function (mem) {
                membersName.push(mem.superior);
            })
        }
        k.response.json({
            success: true,
            message: '加入成功',
            model: membersName,
        })
    }
} else {
    k.response.json({
        success: false,
        message: '找不到该成员'
    })
}