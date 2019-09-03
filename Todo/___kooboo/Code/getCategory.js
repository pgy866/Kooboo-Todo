/* user data*/
var sysNameTb = k.database.user.find('username', k.user.userName);
var userRight = sysNameTb.usertype;
/* data table */
var levelCategoryAll = k.database.level_category.all();
var articleTb = k.database.knowledgeArticle;

var categoryArr = [];
var allArticle = [];

/** Get firLevelCategory from parentCategory table according to user permissions */
var parentCategory = k.database.parentCategory.findAll("permissionGroup contains '"+ userRight +"'");
if(parentCategory){
    var sum = 0;
    parentCategory.forEach(function (item, num) {
        /** Get categoryArr of first level categories */
        categoryArr.push({
            label: item.firLevelName,
            value: item.firCategory,
            children: [],
            id: ++sum
        })
    })
    if(categoryArr.length > 0) {
        /** Match secondary categories based on first level categories */
        levelCategoryAll.forEach(function (item, num) {
            categoryArr.forEach(function(index) {
                if (item.firLevelCategory == index.value){
                    index.children.push({
                        label: item.secLevelCategory,
                        value: item.secLevelCategory,
                        categoryId: item._id,
                        id: ++sum,
                        parentId: index.id
                    })
                }
            })
        })
    }
    /** Get articles based on user permissions */
    if(userRight == 'boss'){
        allArticle = articleTb.query('').OrderByDescending('createTime').skip(0).take(900);
    } else {
        if (categoryArr.length == 1){
            allArticle = articleTb.query('firLevelCategory==' + categoryArr[0].value).OrderByDescending('createTime').skip(0).take(900);
        } else {
            categoryArr.forEach(function (item) {
                var curentArticleArr = articleTb.query('firLevelCategory==' + item.value).OrderByDescending('createTime').skip(0).take(500);
                allArticle = allArticle.concat(curentArticleArr)
            })
            allArticle.sort(function(a, b) {
                return b.createTime> a.createTime ? 1 : -1;
            })
        }
    }
    var findStr = "&& startDate== ''" + "&&checkMessage== 'False'"
    var articleNotification = k.database.notification.findAll('creator==' + k.user.userName + findStr);
    

    var showModel = {
        categoryArr: categoryArr,
        articles: allArticle,
        articleNotification: articleNotification
    }
    k.response.json({
        success: true,
        messzge: '获取类别以及文章成功',
        model: showModel
    })
} else {
    k.response.json({
        success: false,
        message: '没有权限'
    })
}