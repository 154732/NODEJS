var createError = require('http-errors');
var express = require('express');
var bodyParser=require('body-parser');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var initSQL=require('./util/sqlMapUtil').initSQL;
var ejs=require('ejs');
var otherConfig=require('./config/config').otherConfig;
var app = express();
var server=http.createServer(app);

//监听端口
app.set('port', process.env.PORT || otherConfig.port);

//session支持
app.use(session({
  secret:'snowPanther',
  name: 'sid',
  cookie: {maxAge: 1000*60*60*24 },
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.engine('ejs', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//post请求拿参数支持
app.use(bodyParser.urlencoded({extended: true}));
//cookie支持，session支持需要cookie支持
app.use(cookieParser());
var filters=require('./filters');
var routes = require('./routes');


//过滤控制
filters(app);
//路由控制
routes(app);
//启动监听
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  // /*定时任务*/
  // schedule();
  /*初始化sql*/
  initSQL();
});
