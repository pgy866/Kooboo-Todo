/* user data*/
var sysNameTb = k.database.user.find('username', k.user.userName);
var userRight = sysNameTb.usertype;
/**  Query whether the user has permission to delete employee information */
var employeeInfoRightTb = k.database.employeeInfoRight.find('employeeInfoRight', userRight);
if(employeeInfoRightTb.length > 0) {
    var id = k.request._id;
    var getInfoTb = k.database.employee_info;

    if (id) {
        /** delete information */
        getInfoTb.delete(id);
        k.response.json({
            success: true,
            message: '信息删除成功'
        })
    } else {
            k.response.json({
            success: true,
            message: '信息删除失败, 缺少id'
        })
    }
} else {
    k.response.json({
    success: false,
    message: '无权限删除信息'
    })
}