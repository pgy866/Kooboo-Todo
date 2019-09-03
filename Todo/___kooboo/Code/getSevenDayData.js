  /* Incoming startTime and endTime get time array */
  function getDiffDate(startTime, endTime) {
    var startFor = new Date(startTime);
    var dateArr = [];
    while ((endTime - startFor.getTime()) >= 0) {
      var year = startFor.getFullYear();
      var month = startFor.getMonth().toString().length === 1 ? "0" + (parseInt(startFor.getMonth().toString(),10) + 1) : (startFor.getMonth() + 1);
      var day = startFor.getDate().toString().length === 1 ? "0" + startFor.getDate() : startFor.getDate();
      var joinStr = year + "-" + month + "-" + day
      var dateStr = new Date(joinStr)
      dateArr.push({
        joinStr: joinStr,
        dayList: dateStr.getDay(),
        dateList: dateStr.getDate()
      });
      startFor.setDate(startFor.getDate() + 1);
    }
    return dateArr;
  }

  /* Timestamp of today's zero hour date */
  var setHoursDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  /* Get the timestamp after one days */
  var tomDaysTime = setHoursDate + 1 * 86400 * 1000;
  /* Get the timestamp after seven days */
  var sevenDaysAfterTime = setHoursDate + 7 * 86400 * 1000;
  var allDate = getDiffDate(tomDaysTime, sevenDaysAfterTime);
  var startStr = allDate[0].joinStr;
  var endStr = allDate[6].joinStr;

  /* data table */
  var allTask = k.database.all_task;
  var findStr = "&& isRepeat=='noRepeat'" + "&&startFormat >=" + startStr + "&&startFormat <=" + endStr
  var noRepeatTask = allTask.query('assignUser==' + k.user.userName + findStr).OrderBy('createTime').skip(0).take(300);
  var repeatTask = allTask.query('assignUser==' + k.user.userName + '&& isRepeat=="repeat"').OrderBy('createTime').skip(0).take(300);
  var levelCategoryTb = k.database.level_category;
  var categoryCheckTable = k.database.checkItem_category;
  var showTodayAfterData = [];

  var userTotalTask = noRepeatTask.concat(repeatTask)
  /* Get data for the next seven days*/
  if (userTotalTask) {
     userTotalTask.forEach(function (index) {
          if (index.secondCategory !== "") {
            var checkItemData = categoryCheckTable.findAll('categoryId ==' + index.secondCategoryId)
          } else {
            var checkItemData = []
            index.secondCategory = '无'
          }
          if (index.desc == null) {
              index.desc = '无'
          }
            /* noRepeat task */
          if (index.isRepeat === 'noRepeat') {
            showTodayAfterData.push({
                title: index.title,
                desc: index.desc,
                secondCategory: index.secondCategory,
                planDate: index.startFormat,
                creator: index.creator,
                subTasks: checkItemData
            })
          } else {
            var monthNum = parseInt(index.repeatFreq);
            allDate.forEach(function(element){
              if (element.joinStr >= index.startFormat && element.joinStr <= index.endFormat) {
                    /* Task repeated by day */
                    if (index.repeatMode == 'day') {
                        showTodayAfterData.push({
                          title: index.title,
                          desc: index.desc,
                          secondCategory: index.secondCategory,
                          planDate: element.joinStr,
                          creator: index.creator,
                          subTasks: checkItemData
                      })
                  } else if (index.repeatMode == 'week' && monthNum == element.dayList) {
                      /* Task repeated by week */    
                      showTodayAfterData.push({
                          title: index.title,
                          desc: index.desc,
                          secondCategory: index.secondCategory,
                          planDate: element.joinStr,
                          creator: index.creator,
                          subTasks: checkItemData
                      })
                  } else if (index.repeatMode === 'month' && monthNum == element.dateList) {
                    /* Task repeated by month */  
                    showTodayAfterData.push({
                        title: index.title,
                        desc: index.desc,
                        secondCategory: index.secondCategory,
                        planDate: element.joinStr,
                        creator: index.creator,
                        subTasks: checkItemData
                    })
                  }
              }
            })
          }
      })
    k.response.json({
      success: true,
      message: '未来七天任务数据获取成功',
      model: showTodayAfterData
    })
  } else {
    k.response.json({
      success: false,
      message: '任务数据获取失败'
    })
  }