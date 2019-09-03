/* user data*/
var sysNameTb = k.database.user.find('username', k.user.userName);
var userRight = sysNameTb.usertype;

var articleTb = k.database.knowledgeArticle;
var levelCategoryAll = k.database.level_category.all();
/** Get firLevelCategory from parentCategory table according to user permis sions */
var parentCategory = k.database.parentCategory.findAll("permissionGroup contains '"+ userRight +"'");
if(parentCategory){
    var categoryArr = [];
    var allArticle = [];
    parentCategory.forEach(function (item) {
        /* Get categoryArr of first level categories */
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
    
    /** Get articles based on user permissions */
    if(userRight == 'boss'){
        allArticle = articleTb.query('').OrderByDescending('createTime').skip(0).take(900);
    } else {
        if (categoryArr.length == 1){
            allArticle = articleTb.query('firLevelCategory==' + categoryArr[0].value).OrderByDescending('createTime').skip(0).take(900);
        } else {
            categoryArr.forEach(function (item) {
                var curentArticleArr = articleTb.findAll('firLevelCategory==' + item.value);
                allArticle = allArticle.concat(curentArticleArr)
            })
            allArticle.sort(function(a, b) {
                return b.createTime> a.createTime ? 1 : -1;
            })
        }
    }

    var showModel = {
        categoryArr: categoryArr,
        allArticle: allArticle
    }

    k.response.json({
        success: true,
        message: '获取文章成功',
        model: showModel
    })
}