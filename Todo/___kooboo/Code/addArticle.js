/* user data*/
var creatorName = k.user.userName;
var sysNameTb = k.database.user.find('username', creatorName);
var userRight = sysNameTb.usertype;

/* article parameters*/
var title = k.request.title;
var desc = k.request.desc;
var firLevelCategory = k.request.firLevelCategory;
var secLevelCategory = k.request.secLevelCategory;
var files = k.request.files;
/* Get the data table */
var date = new Date();
var articleTb = k.database.knowledgeArticle;
if (title && firLevelCategory && secLevelCategory) {
    /* Get firLevelCategory from parentCategory table according to user permissions */
    var parentCategory = k.database.parentCategory.findAll("permissionGroup contains '"+ userRight +"' && firCategory==" + firLevelCategory);
    /* Pass in the parameter to get the corresponding category */
    var thisCategory = k.database.level_category.find('firLevelCategory=='+firLevelCategory + ' && secLevelCategory==' + secLevelCategory);
    if (parentCategory && thisCategory) {
            /* Get the category id */
            var categoryId = thisCategory._id;
            var firLevelName = parentCategory[0].firLevelName;
            /* add the article data to the article table*/
            var article = {
                title: title,
                desc: desc,
                firLevelCategory: firLevelCategory,
                firstCategoryName: firLevelName,
                secLevelCategory: secLevelCategory,
                creator: creatorName,
                date: date.toLocaleDateString(),
                createTime: date.getTime(),
                secCategoryId: categoryId,
            }
            var articleId = articleTb.add(article);
            if (!articleId) {
                k.response.json({
                    success: false,
                    message: '文章发布失败',
                })
            } 
            
            /* add the article file to the article_file table*/
            if (files.length > 0) {
                /* get article_file table */
                var File = k.database.getTable('article_file');
                files.forEach(function (file) {
                    var filename = file.fileName;
                    k.file.createFolder(categoryId.toString() + "\\" + articleId.toString());
                    file.save(categoryId.toString() + "\\" + articleId.toString() + "\\" + filename);
                    /** File data is stored in the article_file table */
                    var fileId = File.add({
                        category: secLevelCategory,
                        categoryId: categoryId.toString(),
                        originalCategoryId: categoryId.toString(),
                        articleTitle: title,
                        articleId: articleId.toString(),
                        name: filename,
                        url: "__kb/kfile/"+ categoryId.toString() + "\\" + articleId.toString() + "\\" + filename
                    });
        
                    if (!fileId) {
                        k.response.json({
                            success: false,
                            message: '文件上传失败',
                        })
                    }
                })
            }
            k.response.json({
                success: true,
                message: '文章发布成功'
            })
    } else {
        k.response.json({
            success: false,
            message: '文章参数不正确',
            model: thisCategory
        })
    }
} else {
    k.response.json({
        success: false,
        message: '文章参数缺失'
    })
}