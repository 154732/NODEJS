var express = require('express');
var router = express.Router();

var userRoute=require('./userRoute');

module.exports=function(app){
  userRoute.route(app);
}
