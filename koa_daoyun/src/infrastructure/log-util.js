var log4js = require("log4js");
var log4js_config = require("./logConf.json");
const config = require('./config')
log4js.configure(log4js_config);

var LogFile = log4js.getLogger('log_file');

module.exports = {
    trace: (info) => {
        LogFile.trace(info)
    },
    debug: (info) => {
        LogFile.debug(info)
    },
    info: (info) => {
        LogFile.info(info)
    },
    warn: (warn) => {
        LogFile.warn(warn)
    },
    error: (err) => {
        LogFile.error(err)
        return null
    },
    addlog: async () => {
        log4js.connectLogger(log4js.getLogger('log_file'), { level: config.environment[config.ENV] })
        // log4js.connectLogger(log4js.getLogger("log_date"), { level: config.environment[config.ENV] })
    }
}