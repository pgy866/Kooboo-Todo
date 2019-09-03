  /* Incoming startTime and endtTme get intermediate time period */
  function getDiffDate(startTime, endTime) {
    var startFormat = new Date(startTime);
    var endFormat = endTime
    var dateArr = [];
    while ((endFormat - startFormat.getTime()) >= 0) {
      var year = startFormat.getFullYear();
      var month = startFormat.getMonth().toString().length === 1 ? "0" + (parseInt(startFormat.getMonth().toString(),10) + 1) : (startFormat.getMonth() + 1);
      var day = startFormat.getDate().toString().length === 1 ? "0" + startFormat.getDate() : startFormat.getDate();
      dateArr.push(year + "-" + month + "-" + day);
      startFormat.setDate(startFormat.getDate() + 1);
    }
    return dateArr;
  }
  /* Pass in parameters to get yy-dd-mm format*/
  function getAddDate(endFormat) {
      var dateTime = new Date(endFormat)  
      dateTime = dateTime.setDate(dateTime.getDate()+1);
      var inputDate = new Date(dateTime)
      var year = inputDate.getFullYear();
      var month = inputDate.getMonth().toString().length === 1 ? "0" + (parseInt(inputDate.getMonth().toString(),10) + 1) : (inputDate.getMonth() + 1);
      var day = inputDate.getDate().toString().length === 1 ? "0" + inputDate.getDate() : inputDate.getDate();
      inputTime = year + "-" + month + "-" + day
      return inputTime
  }

  /**Get all the tasks that require showRemind in the all_task table */
  var uerTotalData = k.database.all_task.query('assignUser==' + k.user.userName + '&& showRemind=="True"').OrderByDescending('createTime').skip(0).take(300);
  if (uerTotalData) {
      var showNatureTable = [];
      uerTotalData.forEach(function (index) {
        if (index.isRepeat === 'noRepeat') {
          /* noRepeat task */
            showNatureTable.push({
              title: index.title,
              start: index.startFormat,
              color: '#343a40'
            })
        } else {
          /* Time period for getting repetitive tasks */
          var allDate = getDiffDate(index.startTimestamp, index.endTimestamp);
          var monthNum = parseInt(index.repeatFreq)
          /* Repeat by day */
          if (index.repeatMode == 'day') {
            var dateTime = getAddDate(index.endFormat)
            showNatureTable.push({
              title: index.title,
              start: index.startFormat,
              end: dateTime,
              color: '#3a87ad'
            })
          }
          /* Repeat by week */
          else if (index.repeatMode === 'week') {
            /* Traversal time array */
            allDate.forEach(function(item) {
              var dateStr = new Date(item);
              var dayList = dateStr.getDay();
              if (monthNum === dayList) {
                showNatureTable.push({
                  title: index.title,
                  start: item,
                  color: '#6f42c1'
                })
              }
            })
            /* Repeat by month */
          } else if (index.repeatMode === 'month') {
            /* Traversal time array */
            allDate.forEach(function(item) {
              var dateStr = new Date(item);
              var dateList = dateStr.getDate();
              if (monthNum === dateList) {
                showNatureTable.push({
                  title: index.title,
                  start: item,
                  color: '#dc3545'
                })
              }
            })
          }
        }
    })
      k.response.json({
        success: true,
        message: '提醒数据请求成功',
        model: showNatureTable
      })
  } else {
    k.response.json({
        success: false,
        message: '提醒数据请求失败'
    })
  }