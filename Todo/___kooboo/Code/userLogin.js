var username = k.request.username;
var password = k.request.password;
var user = k.user.login(username,password);
if(user){
    var userfromdb = k.database.user.find("username", k.user.userName); 
    if(!userfromdb){
        /* Match user type */
        var userRole = k.database.sys_role.find("user", k.user.userName);
        if (userRole) {
            var userType = userRole.role
        } else {
            var userType = 'developer'
        }
        var obj = {
            username: k.user.userName,
            usertype: userType
        }; 
        k.database.user.add(obj);
    }
	k.response.json({
        success: true,
        model: '登录成功'
    });
}else{
	k.response.json({
        success: false,
        model: '用户名或密码出错'
    });
}