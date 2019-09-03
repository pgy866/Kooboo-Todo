/* user data*/
var creatorName = k.user.userName;
var userMember = k.database.user_member;
/* Get the current user's employee*/
var empMembers = userMember.findAll("employee", creatorName);
/* Get the current user's superior*/
var supMembers = userMember.findAll("superior", creatorName);
var membersName = [];
var assignName = [];
if (empMembers.length > 0) {
    /* push data to membersName */
    empMembers.forEach(function (mem) {
        membersName.push(mem.superior);
    })
}

if (supMembers.length > 0) {
    /* push data to assignName */
    supMembers.forEach(function (member) {
        assignName.push(member.employee);
    })
}
var returnMem = {
    membersName: membersName,
    assignName: assignName
}

k.response.json({
    success: true,
    message: '成员信息获取成功',
    model: returnMem
})
