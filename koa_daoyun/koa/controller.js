/**
 * 处理url映射
 */
const LogUtil = require('./log/log-util')
const fs = require('fs');

// add url-route in /controllers:

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            LogUtil.info(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            LogUtil.info(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            LogUtil.info(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            LogUtil.info(`register URL mapping: DELETE ${path}`);
        } else {
            LogUtil.info(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    //读取controllers文件夹下的js文件
    fs
    .readdirSync(__dirname + '/' + dir).filter((f) => {
        return f.endsWith('.js');
    })
    //对于每个文件 require每个文件暴露出来的函数
    .forEach((f) => {
        LogUtil.info(`process controller: ${f}...`);
        //处理函数
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    let
        controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};
