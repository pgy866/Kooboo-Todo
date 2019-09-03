var params = k.request.params;
var data = JSON.parse(k.request.data);
var bookMRoomTb = k.database.book_mRoom;
if(params == 'deleteRow'){
    var id = data._id
    var currentRight = bookMRoomTb.get(id);
    if (currentRight) {
         bookMRoomTb.delete(id);
        k.response.json({
            success: true,
            message: '删除预约成功'
        })
    } else {
        k.response.json({
            seccess: false,
            message: '不能删除该预约'
        })
    }
} else if(params == 'deleteTotal') {
    data.forEach(function(item) {
        var bookId = item._id;
         bookMRoomTb.delete(bookId);
    })
    var myBook = bookMRoomTb.query("creator==" + k.user.userName).OrderByDescending("createTime").skip(0).take(500);
    k.response.json({
        success: true,
        message: '清空全部数据成功',
        model: myBook
    })
} else {
    k.response.json({
        seccess: false,
        message: '参数不正确'
    })
}