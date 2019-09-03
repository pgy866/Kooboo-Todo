/* delete parameters */
var articleId = k.request._id;
if (articleId) {
    var articleTb = k.database.knowledgeArticle;
    /* delete article */
    articleTb.delete(articleId);
    /* delete comment */
    var commentTb = k.database.comment;
    var allComments = commentTb.findAll('articleId==' + articleId);
    if (allComments.length > 0) {
        allComments.forEach(function (item) {
            commentTb.delete(item._id)
        })
    }

    /* delete article files */
    var articleFileTb = k.database.article_file;
    var allArticleFiles = articleFileTb.findAll('articleId==' + articleId);
    if (allArticleFiles.length > 0) {
        allArticleFiles.forEach(function (item) {
            var folder = item.originalCategoryId + "\\" + articleId;
            k.file.deleteFolder(folder);
            articleFileTb.delete(item._id)
        })
    }

    /* delete comment files */
    var commentFileTb = k.database.comment_file;
    var allCommentFiles = commentFileTb.findAll('articleId==' + articleId);
    if (allCommentFiles.length > 0) {
        allCommentFiles.forEach(function (item) {
            var folder = articleId+ "\\" + item.commentId;
            k.file.deleteFolder(folder);
            commentFileTb.delete(item._id)
        })
    } 
    k.response.json({
        success: true,
        message: '删除文章成功'
    })
} else {
    k.response.json({
        seccess: false,
        message: '缺失参数articleId'
    })
}