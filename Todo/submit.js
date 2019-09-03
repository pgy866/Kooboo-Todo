var submitFun = function(url, data) {
    var result = '';
     $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        async:false,
        success: function(data){
        	result = data;;
        },
        error: function(){
        	alert("提交失败")
        }
    })
     return result;
}