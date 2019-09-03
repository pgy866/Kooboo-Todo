/* delete category parameters */
var categoryId = k.request._id;
/* data table */
var levelCategoryTb = k.database.level_category;
var category = levelCategoryTb.get(categoryId);
var checkItemTb = k.database.checkItem_category;
var allArticleTb = k.database.knowledgeArticle;
var articleTb = allArticleTb.findAll("secCategoryId", categoryId);
var commentTb = k.database.comment;
var articleFileTb = k.database.article_file;
var commentFileTb = k.database.comment_file;

if (category && articleTb) {
    /**delete category*/
    levelCategoryTb.delete(categoryId);

    /**delete category checkItem*/
    var allCheckItem = checkItemTb.findAll("categoryId==" + categoryId);
    allCheckItem.forEach(function (item) {
        checkItemTb.delete(item._id)
    })

    /* delete category article */
    articleTb.forEach(function (index) {
        allArticleTb.delete(index._id);

        /* delete article comment */
        var allComments = commentTb.findAll('articleId==' + index._id);
        if (allComments.length > 0) {
            allComments.forEach(function (item) {
                commentTb.delete(item._id)
            })
        }

        /* delete article files */
        var allArticleFiles = articleFileTb.findAll('articleId==' + index._id);
        if (allArticleFiles.length > 0) {
            allArticleFiles.forEach(function (item) {
                var folder = item.originalCategoryId+ "\\" + index._id;
                k.file.deleteFolder(folder);
                articleFileTb.delete(item._id)
            })
        }

        /* delete comment files */
        var allCommentFiles = commentFileTb.findAll('articleId==' + index._id);
        if (allCommentFiles.length > 0) {
            allCommentFiles.forEach(function (item) {
                var folder = index._id+ "\\" + item.commentId;
                k.file.deleteFolder(folder);
                commentFileTb.delete(item._id)
            })
        }
    })
    k.response.json({
        success: true,
        message: '删除类别成功'
    })
} else {
    k.response.json({
        seccess: false,
        message: '找不到该类别'
    })
}