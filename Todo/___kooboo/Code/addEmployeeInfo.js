/*user data*/
var sysNameTb = k.database.user.find('username', k.user.userName);
var userRight = sysNameTb.usertype;

/* Query whether the user has permission to create employee information*/
var employeeInfoRightTb = k.database.employeeInfoRight.find('employeeInfoRight', userRight);
var employeeInfoRightTb=''
if(employeeInfoRightTb.length > 0) {
  /* information parameters */
    var name = k.request.name;
    var gender = k.request.gender;
    var email = k.request.email;
    var phoneNum = k.request.phoneNum;
    var birthDate = k.request.birthDate;
    var entryDate = k.request.entryDate;
    var jobRole = k.request.jobRole;
    var idCardNum = k.request.idCardNum;
    var team = k.request.team;
    var addressInfo = k.request.addressInfo;
    var id = k.request._id;
    /* data table */
    var employeeData = k.database.employee_info;
    if (name && gender && email && phoneNum && birthDate && entryDate && jobRole && idCardNum) {
        var addInfo = {
          name: name,
          gender: gender,
          email: email,
          phoneNum: phoneNum,
          birthDate: birthDate,
          entryDate: entryDate,
          jobRole: jobRole,
          idCardNum: idCardNum,
          team: team,
          addressInfo: addressInfo
        }
    
        if (id) {
          /* Update the employee information to the employee_info table*/
          employeeData.update(id, addInfo);
          k.response.json({
              success: true,
              message: '更新信息成功'
          })
    
        } else {
          /* Add employee information to the employee_info table */
          var addInfoId = employeeData.add(addInfo);
          k.response.json({
              success: true,
              message: '添加信息成功',
              model: addInfoId
          })
        }
    } else {
        k.response.json({
            success: false,
            message: '参数不正确'
        })
    }
} else {
  k.response.json({
    success: false,
    message: '无权限创建信息'
  })
}