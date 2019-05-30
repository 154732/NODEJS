var user=require('../controller/userController');
var multer  = require('multer')
var upload = multer({ dest: 'upload/' });
var fs = require('fs');
var multer  = require('multer')
var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './public/upload/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now()+ "." + fileFormat[fileFormat.length - 1]);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })


exports.route=function(app){
    /*进入登录页*/
    app.get('/',user.toLogin);
    app.post('/login',user.login);
    /*获取验证码*/
    app.get('/captcha',user.captcha);
    /*进入首页*/
    app.get("/index",user.index);
    app.get("/main",user.main);
    app.get("/gallery",user.gallery);
    app.get("/sys_user",user.sys_user);
    app.get("/pages_profile",user.pages_profile);
    app.post("/file", upload.single("logo"),user.file);
    app.get("/loginOut",user.loginOut);
    app.get("/edit_pwd",user.edit_pwd);
}
