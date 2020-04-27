const Koa = require('koa');
// 引入log4js 文件日志
const log_util = require("./log/log-util.js");
// 跨域请求中间件
const cors = require('koa2-cors');
// 处理提交的表单 从 POST 请求的数据体里面提取键值对
const bodyParser = require('koa-body');
// 接口
const rest = require('./rest');
// token令牌
const token = require('./token-interceptor')

// 实例化Koa对象 
const app = new Koa();

app.use(async (ctx, next) => {
    // 中间件1 记录所有
    log_util.addlog()
    await next()
});
//中间件2 跨域请求
app.use(cors())

//中间件3 控制台记录请求(不大重要)。
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

//中间件4 处理post参数 有头像的话上传到./static/img 
app.use(bodyParser({
    multipart: true,
    formidable: {
        uploadDir: __dirname + "/static/img",
        maxFieldsSize: 20 * 1024 * 1024
    }
}));

//中间件5 RESTApi使用
app.use(rest.restify());

//中间件6 token令牌
app.use(token)






//监听端口
const port = require('./config/config').server_port
app.listen(port);
log_util.info('app started at port ' + port + '...');