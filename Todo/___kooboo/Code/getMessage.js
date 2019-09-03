/* user data*/
var creatorName = k.user.userName;
var notificationTb = k.database.notification;
var prev = JSON.parse(k.request.prev)
var messageLength = notificationTb.findAll('creator==' + creatorName);
var unReadLength = notificationTb.findAll('creator==' + creatorName + "&& checkMessage=='False'");
if (prev) {
  /* Get the current user notification in the notification table */
    var unReadNotification = notificationTb.query('creator==' + creatorName + "&& checkMessage=='False'").OrderByDescending('createTime').skip(0).take(prev);
    if(unReadNotification.length < prev) {
      var num = prev - unReadNotification.length
      var readNotification = notificationTb.query('creator==' + creatorName + "&& checkMessage=='True'").OrderByDescending('createTime').skip(0).take(num);
    } else {
      var readNotification = [];      
    }
} else {
  /* Get the current user notification in the notification table */
    var unReadNotification = notificationTb.query('creator==' + creatorName + "&& checkMessage=='False'").OrderByDescending('createTime').skip(0).take(30);
    if(unReadNotification.length < 30) {
      var num = 30 - unReadNotification.length
      var readNotification = notificationTb.query('creator==' + creatorName + "&& checkMessage=='True'").OrderByDescending('createTime').skip(0).take(num);
    } else {
      var readNotification = [];      
    }
}
if (readNotification && unReadNotification) {
  var returnCol = {
      readNotification: readNotification,
      unReadNotification: unReadNotification,
      userName: creatorName,
      unReadLength: unReadLength.length,
      messageLength: messageLength.length
    }
    k.response.json({
      success: true,
      message: '通知获取成功',
      model: returnCol
    })
} else {
    k.response.json({
      success: false,
      message: '通知获取失败'
    })
}