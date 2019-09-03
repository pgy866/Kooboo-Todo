if(k.event.url.indexOf("api") > -1){
    if(!k.user.isLogin){
        k.response.redirect("/needLogin");
    };
};