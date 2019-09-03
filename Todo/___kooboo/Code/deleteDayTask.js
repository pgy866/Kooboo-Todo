 /* data table */
 var dayTaskTable = k.database.day_task;
 var allDayData = dayTaskTable.findAll('creator==' + k.user.userName);
 if(allDayData) {
      allDayData.forEach(function(index) {
          /** delete dayTask*/
        dayTaskTable.delete(index._id);
      })
    k.response.json({
      success: true,
      message: '删除子任务成功'
    })
 } else {
   k.response.json({
     success: false,
     message: '删除任务失败'
   })
 }