const remote = true
const log4js = require("log4js");
const SERVER_PORT_LOCAL = 33333
const SERVER_PORT_REMOTE = 33333

var config = {
    dialect: 'mysql',
    database: 'checkserver',
    username: 'root',
    password: '123',
    host: 'localhost',
    port: 3306,
    server_port: remote ? SERVER_PORT_REMOTE : SERVER_PORT_LOCAL,
    imghost_default: "http://192.168.1.101:" + SERVER_PORT_LOCAL,
    imghost: "localhost:" + SERVER_PORT_REMOTE,//服务器ip
    remote: remote,
    environment: { 1: log4js.levels.TRACE, 2: log4js.levels.DEBUG, 3: log4js.levels.INFO, 4: log4js.levels.WARN, 5: log4js.levels.ERROR },
    ENV: 3,
    need_face:true
};

module.exports = config;