/*user data*/
var creatorName = k.user.userName;
/*add task parameters */
var id = k.request._id;
var title = k.request.title;
var desc = k.request.desc;
var startFormat = k.request.startFormat;
var endFormat = k.request.endFormat;
var todayDate = k.request.todayDate;
var todayTimestamp = k.request.todayTimestamp;
var startTimestamp = k.request.startTimestamp;
var endTimestamp = k.request.endTimestamp;
var isRepeat = k.request.isRepeat;
var repeatArr = JSON.parse(k.request.repeatArr);
var isShowRemind = k.request.isShowRemind;
var categoryData = JSON.parse(k.request.categoryData);
var assignUser = k.request.assignUser;
var deadline = k.request.deadline;
var repeatMode = '';
var repeatFreq = '';
var firstCategory = '';
var secondCategory = '';
var categoryId = '';
var localTime = new Date().getTime();
/* Get the data table */
var totalTask = k.database.all_task;
var todayDaysTask = k.database.day_task;
var subTaskData = k.database.sub_task;
var categoryCheckTable = k.database.checkItem_category;
var notificationTb = k.database.notification;
if (title && startTimestamp && startFormat && isRepeat) {
    /* User-selected first and second categories */
    if (categoryData.length > 0) {
        firstCategory = categoryData[0];
        secondCategory = categoryData[1];
        /* Query the secondary category to get the category id */
        var categoryTableId = k.database.level_category.find('firLevelCategory==' + firstCategory + ' && secLevelCategory==' + secondCategory); 
        categoryId = categoryTableId._id
    }

    /* Get reminder data */
    if (isRepeat === 'repeat') {
        if (repeatArr.length !== 0) {
            repeatMode = repeatArr[0];
            repeatFreq = repeatArr[1];
        }
    } else {
        repeatMode = '';
        repeatFreq = '';
    }
    /* Get assignUser */
    if (assignUser === null) {
        var assignName = creatorName
    } else {
        var assignName = assignUser
    }
        var addTask = {
            title: title,
            desc: desc,
            startFormat: startFormat,
            endFormat: endFormat,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            showRemind: isShowRemind,
            isRepeat: isRepeat,
            repeatMode: repeatMode,
            repeatFreq: repeatFreq,
            creator: creatorName,
            assignUser: assignName,
            firstCategory: firstCategory,
            secondCategory: secondCategory,
            deadline: deadline,
            secondCategoryId: categoryId,
            createTime: localTime
        }

        /* Add the task to the all_task table*/
        var addTaskId = totalTask.add(addTask);

        /*Add today's tasks into the day_task table*/
        var localDate = new Date().toLocaleDateString();
            /* noRepeat task */
            if (isRepeat == 'noRepeat' && startFormat == todayDate) {
                var dayTaskId = todayDaysTask.add({
                    taskId: addTaskId,
                    title: title,
                    desc: desc,
                    secondCategory: secondCategory,
                    firstCategory: firstCategory,
                    status: '今日待办',
                    planDate: localDate,
                    completeStatus: 'False',
                    creator: creatorName,
                    assignUser: assignName,
                    timeStamp: startTimestamp,
                    createDate: localTime,
                    secCategoryId: categoryId
                })
            } else {
                if( todayDate >= startFormat && todayDate <= endFormat) {
                    var paramsTime = new Date(todayDate);
                    var currentDay = paramsTime.getDay();
                    var currentDate = paramsTime.getDate();
                    var monthNum = parseInt(repeatFreq)
                    /* Task repeated by day */
                    if (repeatMode == 'day')  {
                        var dayTaskId = todayDaysTask.add({
                            taskId: addTaskId,
                            title: title,
                            desc: desc,
                            secondCategory: secondCategory,
                            firstCategory: firstCategory,
                            status: '今日待办',
                            planDate: localDate,
                            completeStatus: 'False',
                            creator: creatorName,
                            assignUser: assignName,
                            timeStamp: startTimestamp,
                            createDate: localTime,
                            secCategoryId: categoryId
                        })
                    } else if (repeatMode == 'week' && monthNum == currentDay) {
                        /* Task repeated by week */
                        var dayTaskId = todayDaysTask.add({
                            taskId: addTaskId,
                            title: title,
                            desc: desc,
                            secondCategory: secondCategory,
                            firstCategory: firstCategory,
                            status: '今日待办',
                            planDate: localDate,
                            completeStatus: 'False',
                            creator: creatorName,
                            assignUser: assignName,
                            timeStamp: startTimestamp,
                            createDate: localTime,
                            secCategoryId: categoryId
                        })
                    } else if (repeatMode == 'month' && monthNum == currentDate) {
                        /* Task repeated by month */
                        var dayTaskId = todayDaysTask.add({
                            taskId: addTaskId,
                            title: title,
                            desc: desc,
                            secondCategory: secondCategory,
                            firstCategory: firstCategory,
                            status: '今日待办',
                            planDate: localDate,
                            completeStatus: 'False',
                            creator: creatorName,
                            assignUser: assignName,
                            timeStamp: startTimestamp,
                            createDate: localTime,
                            secCategoryId: categoryId
                        })
                    }
                }
            }
        /*Determine by category whether to add data in the sub_task table*/
        if (dayTaskId && secondCategory !== "") {
            /* Get category checkItem */
            var checkItemData = categoryCheckTable.findAll('categoryId==' + categoryId)
            checkItemData.forEach(function(index){
                /* Add checkItem to the sub_task table */
                subTaskData.add({
                    parentTitle: title,
                    parentTaskId: addTaskId,
                    dayTaskId: dayTaskId,
                    taskItem: index.checkItem,
                    isCheck: false,
                    assignUser: assignName,
                    creator: creatorName
                })
            })
        }

        /** The task of the day needs to be added to the notification table */
        if (deadline !== '' && deadline == todayTimestamp) {
            notificationTb.add({
                title: title,
                checkMessage: false,
                startDate: deadline,
                typeId: addTaskId,
                creator: assignName,
                messageLen: 0
            })
        }
        k.response.json({
            success: true,
            message: '添加成功'
        })
} else {
    k.response.json({
        success: false,
        message: '参数不正确'
    })
}