const utils = require('./utils/utils.js')
const LogUtil = require('./log/log-util')

const allowpage = ['/api/user/login',
    '/api/user/register',
    '/api/user/password',
    '/api/user/email_code',
    '/api/dict/infos4name']


module.exports = async (ctx, next) => {
    let url = ctx.path
    let token = null

    if (allowpage.indexOf(url) > -1 || url == '/favicon.ico') {
        await next()
    } else {
        if (ctx.request.body.fields != undefined && ctx.request.body.fields.token != 'undefined') {
            token = ctx.request.body.fields.token
        } else if (ctx.request.query != undefined && ctx.request.query.token != undefined) {
            token = ctx.request.query.token
        }
        if (token != null && await utils.tokenVerify(token)) {
            await next()
        } else {
            let model = utils.getReturnModel()
            model.result_code = '206'
            model.result_desc = token ? 'token time out' : 'need token arg'
            LogUtil.info(model.result_desc)
            ctx.rest(model)
        }
    }
}