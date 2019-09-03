  /* update category parameters */
  var articleId = k.request.id;
  var firLevelCategory = k.request.firLevelCategory;
  var secLevelCategory = k.request.secLevelCategory;
  /* data table */
  var articleTb = k.database.knowledgeArticle;
  var articleFileTb = k.database.article_file;
  /* Match secLevelCategory in the level_category */
  var thisCategory = k.database.level_category.find('firLevelCategory==' + firLevelCategory + ' && secLevelCategory==' + secLevelCategory);
  if (thisCategory) {
    /* Get category id */
    var categoryId = thisCategory._id;
    var firstCategoryName = thisCategory.firstCategoryName
    /* update article category data */
    var updateCategory = {
      firLevelCategory: firLevelCategory,
      secLevelCategory: secLevelCategory,
      secCategoryId: categoryId,
      firstCategoryName: firstCategoryName
    }
    articleTb.update(articleId, updateCategory)
    /* Get article file */
    var articleFileAll = articleFileTb.findAll('articleId==' +	articleId);
    if (articleFileAll) {
      /* update article file data */
      articleFileAll.forEach(function(item) {
          var updateFile = {
            category: secLevelCategory,
            categoryId: categoryId
          }
          articleFileTb.update(item._id, updateFile)
      })
    }
    var dataCol = {
      secCategoryId: categoryId,
      firLevelCategory: firLevelCategory,
      secLevelCategory: secLevelCategory
    }
      k.response.json({
        success: true,
        message: '更改类别成功',
        model: dataCol
      })
  } else {
    k.response.json({
      success: false,
      message: '更改类别失败'
    })
  }