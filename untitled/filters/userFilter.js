/*过滤用户路径*/
exports.filterCheck=function(req,res,next){
    var isToLogin=req.baseUrl==''?true:false;
    var isLogin=req.baseUrl=='/login'?true:false;
    var isOtherLogin=req.baseUrl=='/user/otherLogin'?true:false;
    var captcha = req.baseUrl=='/captcha'?true:false;
    if( isToLogin || isLogin || isOtherLogin || captcha){
        next();
    }else{
        if(req.session.user){
            next();
        }else{
            res.redirect('/');
        }
    }
}