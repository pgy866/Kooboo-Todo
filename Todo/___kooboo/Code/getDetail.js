var articleId = k.request.id;
var articleTb = k.database.knowledgeArticle;
var articleFileTb = k.database.article_file;
var article = articleTb.get(articleId);

if (article) {
    var allFiles = articleFileTb.findAll('articleId==' + articleId);
    /** Get article file */
    if(allFiles.length > 0){
        article.attach = allFiles;
    }

    /** Get article comment */
    var commentTb = k.database.comment;
    var comments = commentTb.query('articleId==' + articleId).OrderByDescending('createTime').skip(0).take(99);
    if (comments.length > 0) {
        /* Get comment file */
        comments.forEach(function (item) {
            var commentFiles = k.database.comment_file;
            var files = commentFiles.findAll("commentId==" + item._id);
            if (files.length > 0) {
                item.attach = files
            }
        })
    }

    var articleDetail = {
        username: k.user.userName,
        article: article,
        comments: comments
    }
    k.response.json({
        success: true,
        message: '页面跳转成功',
        model: articleDetail
    })
} else {
    k.response.json({
        success: false,
        message: '找不到文章',
        model: articleId
    })
}