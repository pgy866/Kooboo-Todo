  /* data table */
  var dayTask = k.database.day_task;
  var subTaskTb = k.database.sub_task;
  var userMember = k.database.user_member;
  
  /*user data*/
  var creatorName = k.user.userName
  /* Timestamp of today's zero hour date */
  var setHoursDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  /*  Get the timestamp seven days ago  */
  var sevenDaysAgoTime = setHoursDate - 7 * 86400 * 1000;
  
  if (dayTask) {
  /** Get user's task data in the day_task table */
    var uerJobData = dayTask.query('assignUser==' + creatorName).OrderByDescending('createTime').skip(0).take(300);
        /* Task data details */
      uerJobData.forEach(function(item){
        /** find task checkItem */
        var taskId = item._id
        var subTasks = subTaskTb.findAll("dayTaskId==" + taskId)
        if (subTasks.length > 0) {
            item.subTasks = subTasks
        }
      })
  
  /* Get an employee's seven-day mission and unfinished tasks seven days ago*/
    /** All data within seven days */
    var SevenDaysTask = dayTask.query("timeStamp>=" + sevenDaysAgoTime).OrderByDescending('createTime').skip(0).take(300);
    /** Data for all outstanding tasks seven days ago */
    var SevenDaysAgoTask = dayTask.query("timeStamp<=" + sevenDaysAgoTime + '&& completeStatus == "False"').OrderByDescending('createTime').skip(0).take(300);
    /** Get all employee information of the current user */
    var allMembers = userMember.findAll("superior", creatorName);
    var employeeJobData = SevenDaysTask.concat(SevenDaysAgoTask);

    if (allMembers) {
      /* Task data details */
      employeeJobData.forEach(function(item){
        var taskId = item._id    
        var subTasks = subTaskTb.findAll("dayTaskId==" + taskId)
        if (subTasks.length > 0) {
            item.subTasks = subTasks
        }
      })
    }
  /* Data collection */
  var returnCol = {
    uerJobData: uerJobData,
    employeeJobData: employeeJobData,
    allMembers: allMembers
  }

    k.response.json({
      success: true,
      message: '任务数据获取成功',
      model: returnCol
    })
  } else {
    k.response.json({
      success: false,
      message: '任务数据获取失败'
    })
  }