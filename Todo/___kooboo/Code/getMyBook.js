/** Get the current user information */
var myBook = k.database.book_mRoom.query("creator==" + k.user.userName).OrderByDescending("createTime").skip(0).take(500);
if (myBook) {
    k.response.json({
        success: true,
        message: '我的预约获取成功',
        model: myBook
    })
} else {
    k.response.json({
        success: false,
        message: '我的预约获取失败'
    })
}