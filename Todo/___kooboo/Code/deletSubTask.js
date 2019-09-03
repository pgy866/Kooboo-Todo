 /* data table */
 var subTaskTable = k.database.sub_task;
 var allSubTaskData = subTaskTable.findAll('creator==' + k.user.userName);
 if(allSubTaskData) {
    allSubTaskData.forEach(function(index) {
        /** delete subCheckItem */
        subTaskTable.delete(index._id);
    })
    k.response.json({
      success: true,
      message: '删除检查项成功'
    })
 } else {
   k.response.json({
     success: false,
     message: '删除任务失败'
   })
 }