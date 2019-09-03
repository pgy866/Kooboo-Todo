    var bookMRoomTb = k.database.book_mRoom;
    var now = new Date();
    now.setHours(0,0,0,0);
    var todayTimeStamp = now.getTime();
    var sevenDayLater = todayTimeStamp + 86400000 * 7;
    
    var roomOneBook = bookMRoomTb.findAll("startTimesTamp>=" + todayTimeStamp + " && endTimesTamp<=" + sevenDayLater + " && meetingRoom == '活动室大玻璃会议室'" );
    var roomTwoBook = bookMRoomTb.findAll("startTimesTamp>=" + todayTimeStamp + " && endTimesTamp<=" + sevenDayLater + " && meetingRoom == '活动室小玻璃会议室'" );
    var roomThrBook = bookMRoomTb.findAll("startTimesTamp>=" + todayTimeStamp + " && endTimesTamp<=" + sevenDayLater + " && meetingRoom == '活动室沙发'" );
    var roomFouBook = bookMRoomTb.findAll("startTimesTamp>=" + todayTimeStamp + " && endTimesTamp<=" + sevenDayLater + " && meetingRoom == 'gobear玻璃会议室'" );
    var roomFriBook = bookMRoomTb.findAll("startTimesTamp>=" + todayTimeStamp + " && endTimesTamp<=" + sevenDayLater + " && meetingRoom == '前台沙发'" );
    var roomSixBook = bookMRoomTb.findAll("startTimesTamp>=" + todayTimeStamp + " && endTimesTamp<=" + sevenDayLater + " && meetingRoom == '财务室旁大会议室'" );
    var roomSevBook = bookMRoomTb.findAll("startTimesTamp>=" + todayTimeStamp + " && endTimesTamp<=" + sevenDayLater + " && meetingRoom == '财务室旁小会议室'" );
    var bookMRoom = {
        'roomOneBook': roomOneBook,
        'roomTwoBook': roomTwoBook,
        'roomThrBook': roomThrBook,
        'roomFouBook': roomFouBook,
        'roomFriBook': roomFriBook,
        'roomSixBook': roomSixBook,
        'roomSevBook': roomSevBook,
    } 
    /*  var all = bookMRoomTb.all();
     all.forEach(function(item){
        bookMRoomTb.delete(item._id)
    });*/
    
    var projectTeam = k.database.projectTeam.all();
    /* data collection */
    var obj = {
        projectTeam: projectTeam,
        bookMRoom: bookMRoom
    }
     k.response.json({
        success: true,
        message: '预约数据获取成功',
        model: obj
    })