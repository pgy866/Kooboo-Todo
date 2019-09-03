/* user data */
var creatorName = k.user.userName;
/* comment parameters */
var articleId = k.request.articleId;
var articleTitle = k.request.articleTitle;
var articleCreator = k.request.articleCreator;
var content = k.request.content;
var files = k.request.files;
/* Get the data table */
var commentTb = k.database.comment;
var articleTb = k.database.knowledgeArticle;
var notificationTb = k.database.notification;
if(articleId && content && articleCreator && articleTitle) {
    var date = new Date();
    var comment = {
        articleId: articleId,
        content: content,
        creator: creatorName,
        createTime: date.getTime(),
        time: date.toLocaleString()
    }
    /* Add a comment to the comment table*/
    var commentId = commentTb.add(comment);
    if (!commentId) {
        k.response.json({
            success: false,
            message: '评论失败',
        })
    }
    /* Determine if the creatorName is an article creator, and if so, false*/
    if (articleCreator != creatorName) {
        var findMessageData = notificationTb.findAll("typeId==" + articleId +"&&checkMessage=='False'");
        if (findMessageData.length > 0) {
            var num = findMessageData[0].messageLen
            var updateData = { messageLen: num + 1 }  
            notificationTb.update(findMessageData[0]._id, updateData);
        } else {
            /* Add a notification to the notification table */
            notificationTb.add({
                title: articleTitle,
                creator: articleCreator,
                typeId: articleId,
                checkMessage: false,
                messageLen: 1
            })
        }
    }
    /* add the comment file to the commnet_file table*/
    if (files.length > 0) {
        files.forEach(function (file) {
            var filename = file.fileName;
            var File = k.database.getTable('comment_file');
            k.file.createFolder(articleId.toString() + "\\" + commentId.toString());

            file.save(articleId.toString() + "\\" + commentId.toString() + "\\" + filename);

            var fileId = File.add({
                article: articleTb.get(articleId).title,
                articleId: articleId.toString(),
                commentId: commentId.toString(),
                name: filename,
                url: "__kb/kfile/"+articleId.toString() + "\\" + commentId.toString() + "\\" + filename
            });

            if (!fileId) {
                k.response.json({
                    success: false,
                    message: '评论文件上传失败',
                })
            }
        })
    }
    /* The basic article id gets all the comments of the current article */
    var comments = commentTb.query('articleId==' + articleId).OrderByDescending('createTime').skip(0).take(99);
    if (comments) {
        /* Get the comment file*/
        var commentFiles = k.database.comment_file;
        comments.forEach(function (item) {
            var files = commentFiles.findAll("commentId==" + item._id);
            if (files.length > 0) {
                item.attach = files
            }
        })
    }
    k.response.json({
        success: true,
        message: '评论成功',
        model: comments
    })
} else {
    k.response.json({
        success: false,
        message: '评论参数缺失'
    })
}