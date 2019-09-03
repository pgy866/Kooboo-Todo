/*user data*/
var sysNameTb = k.database.user.find('username', k.user.userName);
var userRight = sysNameTb.usertype;

/* Query whether the user has permission to create employee information*/
var employeeInfoRightTb = k.database.employeeInfoRight.find('employeeInfoRight', userRight);
if(employeeInfoRightTb.length > 0) {
    /* data table */
    var getInfoTb = k.database.employee_info.all();
    var projectTeam = k.database.projectTeam.all();
    var jobRole = k.database.jobRole.all();
    getInfoTb.forEach(function(item) {
        if(item.gender == 'Female') {
            item.genderRole = '女'
        } else {
            item.genderRole = '男'
        }
        if (item.team == '') {
            item.teamName = '-'
        } else {
            item.teamName = item.team
        }
        

    })

    /* 数据合集 */
    var obj = {
        getInfoTb: getInfoTb,
        projectTeam: projectTeam,
        jobRole: jobRole
    }
    k.response.json({
        success: true,
        message: '信息获取成功',
        model: obj
    })
} else {
    k.response.json({
        success: false,
        message: '无权获取信息'
    })
}