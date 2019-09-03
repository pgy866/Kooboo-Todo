var title = k.request.title;
var meetingRoom = k.request.meetingRoom;
var date = k.request.date;
var startTime = k.request.startTime;
var endTime = k.request.endTime;
var startTimesTamp = k.request.startTimesTamp;
var endTimesTamp = k.request.endTimesTamp;
var team = k.request.team;
var number = k.request.number;
var currentDate = Date.parse(new Date());
if (title && meetingRoom && date && startTime && endTime && team) {
    
    var meetingRoomTb = k.database.book_mRoom;
    var isBook = false;
    var allBook = meetingRoomTb.findAll("meetingRoom==" + meetingRoom);
    if (allBook.length > 0) {
        allBook.forEach(function (item) {
            if (
                (startTimesTamp < item.startTimesTamp && endTimesTamp > item.startTimesTamp) ||
                (startTimesTamp < item.endTimesTamp && endTimesTamp > item.endTimesTamp) ||
                (startTimesTamp > item.startTimesTamp && endTimesTamp < item.endTimesTamp) ||
                (startTimesTamp < item.startTimesTamp && endTimesTamp > item.endTimesTamp) ||
                (startTimesTamp == item.startTimesTamp && endTimesTamp == item.endTimesTamp) ||
                (startTimesTamp == item.startTimesTamp && endTimesTamp < item.endTimesTamp) ||
                (startTimesTamp == item.startTimesTamp && endTimesTamp > item.endTimesTamp) ||
                (startTimesTamp > item.startTimesTamp && endTimesTamp == item.endTimesTamp) ||
                (startTimesTamp < item.startTimesTamp && endTimesTamp == item.endTimesTamp)
                ){
                    isBook = true;
                }
            })
        }
            if (isBook) {
                k.response.json({
                    success: false,
                    message: '该时间段已经被预约'
                })
            } else {
                var obj = {
                    "title": title,
                    "meetingRoom": meetingRoom,
                    "date": date,
                    "startTime": startTime,
                    "endTime": endTime,
                    "startTimesTamp": startTimesTamp,
                    "endTimesTamp": endTimesTamp,
                    "team": team,
                    "number": number,
                    "creator": k.user.userName,
                    "createTime": currentDate
                }
                meetingRoomTb.add(obj);
                k.response.json({
                    success: true,
                    message: '预约成功'
                })
            }
} else {
    k.response.json({
        success: false,
        message: '参数不正确'
    })
}