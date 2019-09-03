/*Get the date of the day zero */
var date = new Date();
var thisYear = date.getFullYear(),
    thisMonth = date.getMonth() + 1,
    thisDate = date.getDate(),
    thisWeek = date.getDay(),
    localDate = date.toLocaleDateString();
var thisMidnight = date.setHours(0, 0, 0, 0);
/* data table */
var todayDaysTask = k.database.day_task;
var notificationTb = k.database.notification;
var allTasks = k.database.all_task;
var noRepeatTasks = allTasks.findAll("startTimestamp==" + thisMidnight + ' && isRepeat=="noRepeat"');
var findStr = "startTimestamp <="+ thisMidnight + '&&' + thisMidnight + '<= endTimestamp'
var repeatTasks = allTasks.findAll(findStr + ' && isRepeat=="repeat"');
var deadlineTasks = allTasks.findAll("deadline==" + thisMidnight);
var subTableData = k.database.sub_task;
var categoryCheckTable = k.database.checkItem_category;
// /* Turning yesterday’s unfinished task into legacy task */
var tasks = todayDaysTask.findAll('completeStatus=="False"');
if (tasks) {
    tasks.forEach(function(item) {
        item.status = '遗留任务'
        todayDaysTask.update(item)
    })
}

// /* Add today's tasks into day_task table*/
if (allTasks) {
    var concatTask = noRepeatTasks.concat(repeatTasks);
    concatTask.forEach(function (item) {
        item.planDate = localDate;
        item.status = '今日待办';
        var startMidnight = item.startTimestamp;
        /* noRepeat task */
        if (item.isRepeat == 'noRepeat') {
            var addTaskId = todayDaysTask.add({
                taskId: item._id,
                title: item.title,
                desc: item.desc,
                secondCategory: item.secondCategory,
                firstCategory: item.firstCategory,
                status: item.status,
                planDate: item.planDate,
                completeStatus: 'False',
                creator: item.creator,
                assignUser: item.assignUser,
                timeStamp: startMidnight,
                createDate: item.createTime,
                secCategoryId: item.secondCategoryId
            })
        } else {
            /* Task repeated by day */
            if (item.repeatMode == 'day') {
                var addTaskId = todayDaysTask.add({
                    taskId: item._id,
                    title: item.title,
                    desc: item.desc,
                    secondCategory: item.secondCategory,
                    firstCategory: item.firstCategory,
                    status: item.status,
                    planDate: item.planDate,
                    completeStatus: 'False',
                    creator: item.creator,
                    assignUser: item.assignUser,
                    timeStamp: thisMidnight,
                    createDate: item.createTime,
                    secCategoryId: item.secondCategoryId
                })
            } else if (item.repeatMode == 'week' && item.repeatFreq == thisWeek) {
                /* Task repeated by week */
                var addTaskId = todayDaysTask.add({
                    taskId: item._id,
                    title: item.title,
                    desc: item.desc,
                    secondCategory: item.secondCategory,
                    firstCategory: item.firstCategory,
                    status: item.status,
                    planDate: item.planDate,
                    completeStatus: 'False',
                    creator: item.creator,
                    assignUser: item.assignUser,
                    timeStamp: thisMidnight,
                    createDate: item.createTime,
                    secCategoryId: item.secondCategoryId
                })
            } else if (item.repeatMode == 'month' && item.repeatFreq == thisDate) {
                /* Task repeated by month */
                var addTaskId = todayDaysTask.add({
                    taskId: item._id,
                    title: item.title,
                    desc: item.desc,
                    secondCategory: item.secondCategory,
                    firstCategory: item.firstCategory,
                    status: item.status,
                    planDate: item.planDate,
                    completeStatus: 'False',
                    creator: item.creator,
                    assignUser: item.assignUser,
                    timeStamp: thisMidnight,
                    createDate: item.createTime,
                    secCategoryId: item.secondCategoryId
                })
            }
        }

      /*Determine by category whether to add task in the sub_task table*/
        if (addTaskId && item.secondCategory !== "") {
            /* Get category checkItem */
            var checkItemData = categoryCheckTable.findAll('categoryId==' + item.secondCategoryId);
            if (checkItemData) {
                checkItemData.forEach(function(index){
                /* Add checkItem to the sub_task table */
                    subTableData.add({
                        parentTitle: item.title,
                        parentTaskId: item._id,
                        dayTaskId: addTaskId,
                        taskItem: index.checkItem,
                        isCheck: false,
                        assignUser: item.assignUser,
                        creator: item.creator
                    })
                })
            }
        }
    })
    /** The task of the day needs to be added to the notification table */
    if (deadlineTasks) {
        deadlineTasks.forEach(function(element) {
            notificationTb.add({
                title: element.title,
                checkMessage: false,
                startDate: element.deadline,
                typeId: element._id,
                creator: element.assignUser,
                messageLen: 0
            })
        })
    }
}