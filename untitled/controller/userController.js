var uuid=require('node-uuid');
var ejs=require('ejs');
var ms=require('../util/mysqlUtil');
var sql=require('../util/sqlMapUtil').sql;
var captcha = require('svg-captcha');
var math=require('../util/mathUtil');
var loginOutConfig=require('../config/config').loginOutConfig;
var dateUtil=require('../util/dateUtil');
let Ut = require("../util/sleep");

/*进入登录页*/
exports.toLogin=function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*")
    if(loginOutConfig.user!=''){
        res.redirect(loginOutConfig.user);
    }else{
        res.render('index',{});
    }
}

exports.login=function(req,res,next){
    // setTimeout(function(){
        //所有的逻辑
    var postParam=req.body;
    var captchas =  req.session.captchas;
    if(captchas!=postParam.captcha){
        return res.send({error:'验证码错误！','code':'1'});
    }

    ms.exc(ejs.render(sql.loginSQL.userInfoSelf,postParam),function(userInfo){
        var result={code:1};
        if(userInfo.length>0){
            /*放入session*/
            req.session.user={
                userId:userInfo[0].id,
                userName:userInfo[0].user_name,
                loginName:userInfo[0].login_name,
                phone:userInfo[0].phone_number,
                img:userInfo[0].img
            };
            result['code']=0;
            result['msg']='success';
            return res.send(result);
        }else{
            result['code'] = -1;
            result['msg'] = 'fail';
            return res.send(result);

        }
    });
    // },10000);
}

exports.captcha=function (req,res,next) {

    const cap = captcha.createMathExpr();
    req.session.captchas = cap.text; // session 存储
    console.log(req.session.captchas)
    res.type('svg'); // 响应的类型
    res.send(cap.data);
}

exports.index=function (req,res,next) {

    res.render('home',{user:req.session.user});
}

exports.main=function (req,res,next) {
    res.render('main',{});
}

exports.gallery=function (req,res,next) {
    res.render('gallery',{});
}

exports.sys_user=function (req,res,next) {
    var result={};
    var queryParam=req.query;
    var curentpage=parseInt(queryParam.curentpage?queryParam.curentpage:0);
    var pagesize=5;
    var msgs = "";
    if(queryParam.keyword!=null&&queryParam.keyword!=''){
        queryParam['sql'] = " and user_name like '%"+queryParam.keyword+"%' ";
    }else{
        queryParam['sql']="";
    }
    queryParam['pagesize'] = pagesize;
    ms.exc(ejs.render(sql.loginSQL.querySysUserCount,queryParam),function(querySysUserListCount){
        var pageNumber=math.ceil(querySysUserListCount[0].count/pagesize);
        curentpage=curentpage>=pageNumber?pageNumber-1:curentpage;
        curentpage=curentpage<0?0:curentpage;
        queryParam['startLine']=curentpage*pagesize;
        ms.exc(ejs.render(sql.loginSQL.querySysUser,queryParam),function(querySysUserList){
            for(var index in querySysUserList){
                querySysUserList[index].create_time = dateUtil.format_datetime(querySysUserList[index].create_time,false);
            }
            result['counselorList']=querySysUserList;
            result['page']={curentpage:curentpage,pagesize:pagesize,pageNumber:pageNumber};
            result['keyword'] = queryParam.keyword;
            res.render('sys/sys_user',result);
        })
    });
}

exports.pages_profile=function (req,res,next) {
    res.render('sys/pages_profile',{user:req.session.user});
}


exports.file=function (req,res,next) {
    var filename=req.file.filename;
    var postParam=req.body;
    var user = req.session.user;
    postParam['filename'] = filename;
    postParam['id'] = user.userId;
    ms.exc(ejs.render(sql.loginSQL.updateUser,postParam),function(num){
        var pd = {'id':user.userId}
        ms.exc(ejs.render(sql.loginSQL.selectUser,pd),function(userInfo){
            /*修改session*/
            req.session.user={
                userId:userInfo[0].id,
                userName:userInfo[0].user_name,
                loginName:userInfo[0].login_name,
                phone:userInfo[0].phone_number,
                img:userInfo[0].img
            };
            res.render('sys/pages_profile',{user:req.session.user});
        })
    })
}

exports.loginOut=function (req,res,next) {
    delete(req.session.user);
    res.redirect('index');
}

exports.edit_pwd=function (req,res,next) {
    res.render("sys/edit_pwd");
}
