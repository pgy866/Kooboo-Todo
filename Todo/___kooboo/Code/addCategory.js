/*user data*/
var creatorName = k.user.userName;
var sysNameTb = k.database.user.find('username', creatorName);
var userRight = sysNameTb.usertype;
var date = new Date();

/**category parameters*/
var firLevelCategory = k.request.firLevelCategory;
var secLevelCategory = k.request.secLevelCategory;
var checkItemsArr = JSON.parse(k.request.checkItemsArr);
/* Get the data table */
var levelCategoryTb = k.database.level_category;
/* Get firLevelCategory from parentCategory table according to user permissions */
var parentCategory = k.database.parentCategory.findAll("permissionGroup contains '"+ userRight +"' && firCategory==" +firLevelCategory);
if (firLevelCategory && secLevelCategory && parentCategory) {
    var firLevelName = parentCategory[0].firLevelName;
    /* Add the category to the level_category table and get the categoryId*/
    var categoryId = levelCategoryTb.add({
        firLevelCategory: firLevelCategory,
        secLevelCategory: secLevelCategory,
        firstCategoryName: firLevelName,
        creator: creatorName,
        createTime: date.getTime()
    })

    /* Add the category checkItem to the checkItem_category table*/
    if (checkItemsArr.length > 0) {
        var checkItemTb = k.database.checkItem_category;
        checkItemsArr.forEach(function (item) {
            checkItemTb.add({
                categoryId: categoryId,
                checkItem: item
            })
        })
    }
    k.response.json({
        success: true,
        message: '类别添加成功'
    })
} else {
    k.response.json({
        success: false,
        message: '参数不正确'
    })
}