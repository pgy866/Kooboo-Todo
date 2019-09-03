/* user data*/
var creatorName = k.user.userName;
var sysNameTb = k.database.user.find('username', creatorName);
var userRight = sysNameTb.usertype;
/* data table */
var levelCategoryAll = k.database.level_category.all();
var allMembers = k.database.user_member.findAll("superior", creatorName);  
var categoryArr = [];
/**  Get firLevelCategory from parentCategory table according to user permissions  */
var parentCategory = k.database.parentCategory.findAll("permissionGroup contains '"+ userRight +"'");
if(parentCategory){
    parentCategory.forEach(function (item) {
        /* Get firCategoryArr of first level categories */
        categoryArr.push({
            label: item.firLevelName,
            value: item.firCategory,
            children: []
        })
    })
    if(categoryArr.length > 0) {
        /* Match secondary categories based on first level categories */
        levelCategoryAll.forEach(function (item) {
            categoryArr.forEach(function(index) {
                if (item.firLevelCategory == index.value){
                    index.children.push({
                        label: item.secLevelCategory,
                        value: item.secLevelCategory
                    })
                }
            })
        })
    }
}
/*Returns the employee data in the user_member table */
var assignName = [];
if (allMembers.length > 0) {
    allMembers.forEach(function (member) {
        assignName.push({
            value: member.employee,
            label: member.employee
        });
    })
}
/** data collection */
var returnCol = {
    categoryArr: categoryArr,
    assignName: assignName
};

    k.response.json({
        success: true,
        message: '请求成功',
        model: returnCol
    })