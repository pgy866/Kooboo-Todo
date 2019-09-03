/* data table */
var prev = JSON.parse(k.request.prev);
var categoryCheckTable = k.database.checkItem_category;
var allTaskTb = k.database.all_task
var totalTaskData = allTaskTb.findAll('creator==' + k.user.userName);
var dataNum = totalTaskData.length

if (dataNum > 0) {
    if(prev) {
        var findData = allTaskTb.query('creator==' + k.user.userName).OrderByDescending('createTime').skip(prev).take(30);
    } else {
        var findData = allTaskTb.query('creator==' + k.user.userName).OrderByDescending('createTime').skip(0).take(30);
    }

    /* Determine by category whether to add checkItem to findData */
    var weekday = ["周日","周一","周二","周三","周四","周五","周六"];
    findData.forEach(function(item) {
        if (item.secondCategory !== "") {
            /* Get category checkItem */
            item.subTasks = categoryCheckTable.findAll('categoryId==' + item.secondCategoryId)
        } else {
            item.secondCategory = '无'
        }
        if (item.desc == "") {
            item.desc = '无'
        }

        if(item.endFormat == "") {
            item.endFormat = '-'
        }

        if (item.isRepeat == 'noRepeat') {
            item.repeat = '不重复'
        } else {
            item.repeat = "重复"
        }

        if (item.showRemind == 'False') {
            item.isShowRemind = '否'
        } else {
            item.isShowRemind = '是'
        }

        if(item.repeatMode == '') {
            item.repeatShow = '仅当天';
        } else if (item.repeatMode == 'day') {
            item.repeatShow = '每天'
        } else if (item.repeatMode == 'week') {
            item.repeatShow = '按周-' + weekday[item.repeatFreq]
        } else if (item.repeatMode == 'month') {
            item.repeatShow = '按月-'+ item.repeatFreq + '号'
        }
    })
    var dataCol = {
        dataNum: dataNum,
        findData: findData
    }
    k.response.json({
        success: true,
        message: '任务获取成功',
        model: dataCol
    })
} else if(dataNum == 0){
    var dataCol = {
        dataNum: dataNum,
        findData: []
    }
    k.response.json({
        success: true,
        message: '暂无数据',
        model: dataCol
    })
} else {
    k.response.json({
        success: false,
        message: '任务获取失败'
    })
}