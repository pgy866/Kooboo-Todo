/* user data*/
var creatorName = k.user.userName;
var sysNameTb = k.database.user.find('username', creatorName);
var userRight = sysNameTb.usertype;

/* Get firLevelCategory from parentCategory table according to user permissions */
var parentCategory = k.database.parentCategory.findAll("permissionGroup contains '"+ userRight +"'");
if(parentCategory){
    var levelCategoryTb = k.database.level_category;
    var levelCategoryAll = levelCategoryTb.all();
    var categoryCheckTable = k.database.checkItem_category;
    var currentUser = k.database.user.find('username==' + creatorName);
    var firCategoryArr = [];
    var getSecCategory = [];
    var articleTb = k.database.knowledgeArticle;

    parentCategory.forEach(function (item) {
        /* Get firCategoryArr of first level categories */
        firCategoryArr.push({
            label: item.firLevelName,
            value: item.firCategory
        })
    })
    /* Get secondary categories based on user permissions */
    if(userRight == 'boss'){
        getSecCategory = levelCategoryTb.query('').OrderByDescending('createTime').skip(0).take(500);
    } else {
        if (firCategoryArr.length == 1){
            getSecCategory = levelCategoryTb.query('firLevelCategory==' + firCategoryArr[0].value).OrderByDescending('createTime').skip(0).take(500);
        } else {
            firCategoryArr.forEach(function (item) {
                var curentCategoryArr = levelCategoryTb.findAll('firLevelCategory==' + item.value);
                getSecCategory = getSecCategory.concat(curentCategoryArr)
            })
            getSecCategory.sort(function(a, b) {
                return b.createTime> a.createTime ? 1 : -1;
            })
        }
    }
    getSecCategory.forEach(function(item) {
        /* Add checkItem to getSecCategory*/
        var checkItemData = categoryCheckTable.findAll('categoryId==' + item._id);
        if(checkItemData) {
            item.checkItemsArr = checkItemData;
        }
        var allArticle = articleTb.query('secCategoryId==' + item._id).OrderByDescending('createTime').skip(0).take(500);
        item.articleLen = allArticle.length
    })
    
    var returnCol = {
        getCategory: getSecCategory,
        firCategoryArr: firCategoryArr,
        /** Get all categories for new category validation */
        allCategory: levelCategoryAll
    }

    k.response.json({
        success: true,
        message: '类别获取成功',
        model: returnCol
    })

} else {
    k.response.json({
        success: false,
        message: '没有权限'
    })
}