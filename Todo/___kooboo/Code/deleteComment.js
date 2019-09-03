/* delete comment parameters */
var commentId = k.request.commentId;
var articleId = k.request.articleId;
if (commentId && articleId) {
    /* Get comment */
    var commentTb = k.database.comment;
    var comment = commentTb.get(commentId);
    if (comment) {
        /* Get comment files */
        var commentFile = k.database.comment_file;
        var allFiles = commentFile.findAll("commentId==" + commentId);
        if (allFiles.length > 0) {
            allFiles.forEach(function (file) {
                /* Delete comment file */
                commentFile.delete(file._id)
            })
            var folder = comment.articleId + '\\' + comment._id;
            k.file.deleteFolder(folder);
            
        }
        /* Delete comment */
        commentTb.delete(commentId);
        /* Get all comment and comment file */
        var comments = commentTb.query('articleId==' + articleId).OrderByDescending('createTime').skip(0).take(99);
        if (comments.length > 0) {
            comments.forEach(function (item) {
                var commentFiles = k.database.comment_file;
                var files = commentFiles.findAll("commentId==" + item._id);
                if (files.length > 0) {
                    item.attach = files
                }
            })
        }

        k.response.json({
            success: true,
            message: '删除成功',
            model: comments
        })
    } else {
        k.response.json({
            success: false,
            message: '找不到评论'
        })
    }
} else {
    k.response.json({
        success: false,
        message: '参数缺失'
    })
}