/* Get today time */
var date = new Date();
/* Timestamp of today's zero hour date */
var setHoursDate = new Date(date.setHours(0, 0, 0, 0)).getTime();
var localYear = date.getFullYear();
/* data table */
var falseTb = k.database.day_task.query('assignUser=='+k.user.userName+"&& timeStamp<"+setHoursDate+"&&completeStatus==False").OrderByDescending('createDate').skip(0).take(200);
var dateTb = k.database.day_task.query('assignUser==' + k.user.userName + "&& timeStamp ==" + setHoursDate).OrderByDescending('createDate').skip(0).take(130);
var subTaskTb = k.database.sub_task;
var getTodayData = dateTb.concat(falseTb)
if (getTodayData) {
    getTodayData.forEach(function (index){
        /** Match all tasks that are not completed and today's tasks */
        var taskYear = new Date(index.timeStamp).getFullYear();
        if (taskYear == localYear) {
            var taskId = index._id;
            var subTasks = subTaskTb.findAll("dayTaskId==" + taskId);
    
            if (index.completeStatus =="True"){
                index.isFinished = true
            } else {
                index.isFinished = false
            }
            if(subTasks.length > 0){
                index.allFinish = index.isFinished
                index.subTasks = subTasks;
            } else {
                index.singleFinish = index.isFinished;
            }
    
            if (index.secondCategory == "") {
                index.secondCategory = '无';
            }
    
            if (index.desc == "") {
                index.desc = '无';
            }
        }
    });
    k.response.json({
        success: true,
        message: '今日任务获取成功',
        model: getTodayData
    })
} else {
    k.response.json({
        success: true,
        message: '今日任务获取失败'
    }) 
}