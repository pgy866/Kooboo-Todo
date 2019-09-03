  var params = k.request.params;
  var notificationTb = k.database.notification;
  var data = JSON.parse(k.request.data);
  var updateData = {};
  if(data) {
    if(params == 'updateMessage') {
      /* Update notification of a single article in the menu bar */
        var findArr = notificationTb.findAll('typeId==' + data.typeId);
    } else if (params == 'updateArticleMessage') {
        /* Update the current article notification in the knowledge */
        var findArr = notificationTb.findAll('typeId==' + data._id)
    }
    if (findArr.length > 0) {
      if (findArr.length == 1) {
          updateData.checkMessage = 'True';
          notificationTb.update(findArr[0]._id, updateData);
      } else {
        var sum = findArr[0].messageLen + findArr[1].messageLen;
        updateData.checkMessage = 'True';
        updateData.messageLen = sum;
        findArr.forEach(function (item) {
         if (item.checkMessage == 'False') {
                notificationTb.delete(item._id);           
         } else {
            notificationTb.update(item._id, updateData);
          }
        })
      }
      k.response.json({
        success: true,
        message: '该条通知更新成功'
      })
    } else {
      k.response.json({
        success: false,
        message: '更新失败'
      })
    }
  } else {
    k.response.json({
      success: false,
      message: '删除失败'
    })
  }