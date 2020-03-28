const koa = require("koa");
const Router = require("koa-router");

//实例化koa对象  大写引入(上面的) 小写实例化(下面的)
const app = new koa();
const router = new Router();

//路由
router.get("/",async ctx=>{ 
    ctx.body = {msg:'Hello Koa Interfaces'};
});



//配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log('server started on ' + port);
});

