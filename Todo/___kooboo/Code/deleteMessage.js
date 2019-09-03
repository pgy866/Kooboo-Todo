var notificationTb = k.database.notification;
var allNotification = notificationTb.findAll("creator==" + k.user.userName);
var dataNum = allNotification.length;
  if (dataNum > 0) {
    /** Delete all notifications*/
    allNotification.forEach(function(item) {
        notificationTb.delete(item._id);
      });
      k.response.json({
        success: true,
        message: '清除全部消息成功',
        model: allNotification
      })
  } else if (dataNum == 0) {
    k.response.json({
      success: false,
      message: '没有消息'
    })
  } else {
    k.response.json({
      success: false,
      message: '删除消息失败, 缺少参数'
    })
  }