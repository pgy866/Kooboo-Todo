  /* update data */
  var getRequestData = JSON.parse(k.request.todo);
  /* data table */
  var todayDaysTask = k.database.day_task;
  var subTaskTb = k.database.sub_task;
  /* Get time */
  var date = new Date();
  var localDate = date.getTime();
  var actualDate = date.toLocaleDateString();

  /** update the completeStatus, actualDate, delayTime field of the day_task table */
  if (getRequestData.length > 0) {
      getRequestData.forEach(function(item) {
        /* Get data in the day_task table */
          var taskData = todayDaysTask.get(item._id);
          var isFinished = item.isFinished;
          var subTasks = item.subTasks;
          if (taskData) {
            if (isFinished == true) {
                taskData.actualDate = actualDate;
                taskData.endTimeStamp = localDate;
                taskData.completeStatus = 'True';
                taskData.delayTime = Math.floor((localDate - taskData.timeStamp)/86400000)
            } else if(isFinished == false) {
                taskData.actualDate = '';
                taskData.completeStatus = 'False';
                taskData.delayTime = '';
            }
    
            if (subTasks) {
              /* update subtask */
              subTasks.forEach(function(element){
                subTaskTb.update(element._id, element)
              })
            }
            todayDaysTask.update(taskData);
          }
      });
  
      k.response.json({
          success: true,
          message: '任务状态更新成功'
      })
  } else {
    k.response.json({
      success: false,
      message: '参数不正确'
    })
  }