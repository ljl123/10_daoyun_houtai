const log_util = require("./src/infrastructure/log-util");
const koa = require('koa');
const port = require('./src/infrastructure/config').server_port

// 创建一个Koa对象表示web app本身:
const app = new koa();

app.use(async (ctx, next) => {
    log_util.addlog()
    await next()
});

// 1、log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});






app.listen(port);
log_util.info('app started at port ' + port + '...');
