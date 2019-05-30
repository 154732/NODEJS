var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login",(req,res)=>{
  var params = {
    username : req.body.username,
    password : req.body.password,
    captcha : req.body.captcha
  }

  var captchas =  req.session.captchas;
  if(captchas!=params.captcha){
    res.send({error:'验证码错误！','code':'1'});
  }

});
module.exports = router;
