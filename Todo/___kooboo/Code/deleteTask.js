 /* delete task parameters */
 var params = k.request.params;
 var data = JSON.parse(k.request.data);
 /* data table */
 var totalTable = k.database.all_task; 

 var subTaskTable = k.database.sub_task;
 var dayTaskTable = k.database.day_task;
 
 if (params=="deleteRow") {
   var taskId = data._id
   var currentRight = totalTable.get(taskId);
   if (currentRight) {
       /** delete allTask*/
        totalTable.delete(taskId);
       /** delete dayTask*/
       var dayTitleTable = dayTaskTable.findAll("taskId==" + taskId);
       if (dayTitleTable) {
         dayTitleTable.forEach(function(item) {
            dayTaskTable.delete(item._id);
         });
       }
       /** delete subCheckItem */
       var subTitleTable = subTaskTable.findAll("parentTaskId==" + taskId);
       if (subTitleTable) {
         subTitleTable.forEach(function(item) {
            subTaskTable.delete(item._id);
         });
       }
       k.response.json({
         success: true,
         message: '删除当前任务成功'
       })
   } else {
       k.response.json({
         success: false,
         message: '找不到任务'
       })
   }
 } else if(params=="deleteTotal") {
      var allData = totalTable.findAll('creator==' + k.user.userName);
      allData.forEach(function(index) {
        /** delete allTask*/
        totalTable.delete(index._id);
    })
    k.response.json({
      success: true,
      message: '删除所有任务成功'
    })
 } else {
   k.response.json({
     success: false,
     message: '删除任务失败'
   })
 }