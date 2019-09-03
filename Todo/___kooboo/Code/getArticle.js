/* Get article parameters*/
var value = k.request.value;
var children = k.request.children;
var childrenArr = JSON.parse(children);
/* datat table */
var articleTb = k.database.knowledgeArticle;
var categoryCheckTable = k.database.checkItem_category;

if (value) {
    if(children){
        /* Filter all articles under firLevelCategory in the knowledgeArticle table*/
        var allArticle = articleTb.query('firLevelCategory==' + value).OrderByDescending('createTime').skip(0).take(500);
    } else {
        var categoryId = k.request.categoryId;
        /* Filter all articles under secLevelCategory  in the knowledgeArticle table */
        var allArticle = articleTb.query('secCategoryId==' + categoryId).OrderByDescending('createTime').skip(0).take(500);
        /* Find checkItem in the checkItem_category table */
        var checkItemData = k.database.checkItem_category.findAll('categoryId', categoryId);
    }
    var findStr = "&& startDate== ''" + "&&checkMessage== 'False'"
    var articleNotification = k.database.notification.findAll('creator==' + k.user.userName + findStr);

    var returnCol = {
        allArticle: allArticle,
        checkItemData: checkItemData,
        articleNotification: articleNotification
    }
    k.response.json({
        success: true,
        message: '文章以及文章未读评论获取成功',
        model: returnCol
    })
} else {
    k.response.json({
        success: false,
        message: '数据获取失败，参数不正确'
    })
}