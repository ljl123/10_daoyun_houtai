const Koa = require('koa');
// 引入log4js 文件日志
const log_util = require("./log/log-util.js");
// 跨域请求中间件
const cors = require('koa2-cors');
// 存储静态数据
let staticFiles = require('./static-files');
// 处理提交的表单 从 POST 请求的数据体里面提取键值对
const bodyParser = require('koa-body');
// 接口
const rest = require('./rest');
// token令牌
const token = require('./token-interceptor')
// 导入controller middleware:
const controller = require('./controller');
// 端口
const port = require('./config/config').server_port
// 实例化Koa对象 
const app = new Koa();

app.use(async (ctx, next) => {
    // 中间件1 记录所有信息，log的级别为 INFO
    log_util.addlog()
    await next()
});
//中间件2 跨域请求
app.use(cors())

//中间件3 控制台记录请求
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});


// 中间件4 静态数据
app.use(staticFiles('/static/', __dirname + '/static'));

//中间件5 处理post参数 有头像的话上传到./static/img 
app.use(bodyParser({
    multipart: true,
    strict: false,
    formidable: {
        uploadDir: __dirname + "/static/img",
        maxFieldsSize: 20 * 1024 * 1024
    }
}));

//中间件6 RESTApi使用
app.use(rest.restify());

//中间件7 token令牌
app.use(token)

//路由相关
app.use(controller());

//监听端口
app.listen(port);
log_util.info('app started at port ' + port + '...');