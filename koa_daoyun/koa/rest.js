const LogUtil = require('./log/log-util')

module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                LogUtil.info((new Date()).toUTCString() + ":")
                LogUtil.info(`Process API ${ctx.request.method} ${ctx.request.url}...`);
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    // data.data = data.data ? formatJson(data.data) : data.data
                    ctx.response.body = data;
                }
                try {
                    await next();
                } catch (e) {
                    var format_time = new Date().toLocaleString()
                    var now = Date.now()
                    LogUtil.error((new Date()).toUTCString() + ' Process API error...');
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        data: null,
                        request_id: now,
                        result_code: e.code || '0',
                        result_desc: e.message || '未知错误',
                        timestamp: format_time
                    };
                    LogUtil.error(ctx.response.body.result_desc)
                }
            } else {
                await next();
            }
        };
    }
};



