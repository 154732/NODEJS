var userFilter=require('./userFilter');
/*过滤*/
module.exports=function(app){
    /*过滤用户路径*/
    app.use('/*',userFilter.filterCheck);
}