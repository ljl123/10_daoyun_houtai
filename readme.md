
##[2020-04-26] 
完成日志的编写， 无论任何请求都需要先通过中间件1(打印所有日志)
一个在线编辑markdown文档的编辑器
日志的具体配置方法：https://segmentfault.com/a/1190000017193811 

##[2020-04-27] 
* 跨域请求，浏览器不同的来源想要从服务端获得同样的资源 
A web application executes a cross-origin HTTP request when it requests a resource 
that has a different origin (domain, protocol, or port) from its own.
详细见：https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS 

* restful_api的解释： http://www.ruanyifeng.com/blog/2014/05/restful_api.html

* 注释了token-interceptor 里面的getUserTypeFromToken 和 getUserPower





##后端大致框架：
    所有的请求
               通过中间件1 记录在log日志上
               通过中间件2 跨域传输，不同url 进行跨域的传输 请求到服务器相同的资源
               通过中间件3 请求送进服务器时打印method在console上，请求完成后执行时间打印在console上
               通过中间件4 对post参数进行处理 这里涉及到了static资源上，没有static代码要研究一下
               通过中间件5 api接口的处理
               通过中间件6 token令牌，里面注释掉了两个类 后面人记得改下
               
               control层 ...没看了

               通过中间件6 token令牌的一些异常或错误处理
               通过中间件5 api接口返回给前端信息
               通过中间件4 无操作
               通过中间件3 无操作
               通过中间件2 无操作
               通过中间件1 无操作
    
    监听端口16666



##文件夹设置：

    ── /          # 后端代码目录
       ├── app.js # 后端服务入口文件
       ├── controllers/    # 操作层目录     没创建
       ├── models/ # 数据模型model层目录    没创建
       ├── routers/ # 路由目录              没创建
       ├── services/   # 业务层目录         没创建
       ├── utils/  # 工具类目录
       ├── config/  #配置文件目录
       ├── print_log/  #日志输出目录
       └── log/   #日志文件目录