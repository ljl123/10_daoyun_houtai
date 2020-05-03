const UserService = require('../services/user-service')

module.exports = {
    'POST /api/user/login': async (ctx, next) => {
        let username = ctx.request.body.fields.username || null
        let pwd = ctx.request.body.fields.password || null
        ctx.rest(await UserService.login(username,pwd))
    },
    'POST /api/user/register': async (ctx, next) => {
        let user = ctx.request.body.fields
        let email_code = user.email_code
        delete user.email_code
        ctx.rest(await UserService.register(user,email_code))
    },
    'PUT /api/user/password': async (ctx, next) => {
        let email = ctx.request.body.fields.email || null
        let email_code = ctx.request.body.fields.email_code || null
        let token = ctx.request.body.fields.token || null
        let old_pwd = ctx.request.body.fields.old_pwd || null
        let new_pwd = ctx.request.body.fields.new_pwd || null
        ctx.rest(await UserService.changePassword(token,email,email_code,new_pwd,old_pwd))
    },
    'PUT /api/user/info': async (ctx, next) => {
        let uid = ctx.request.body.fields.uid || null
        let user = ctx.request.body.fields
        delete user.token
        delete user.uid
        ctx.rest(await UserService.modifyUserInfo(uid,user))
    },
    'GET /api/user/face': async (ctx, next) => {
        let token = ctx.request.query.token || null
        ctx.rest(await UserService.getUserFaceInfo(token))
    },
    'POST /api/user/avatar': async (ctx, next) => {
        let token = ctx.request.body.fields.token || null
        let uid = ctx.request.body.fields.uid || null
        let files = ctx.request.body.files || null
        ctx.rest(await UserService.uploadAvatar(token,uid,files))
    },
    'POST /api/user/face': async (ctx, next) => {
        let uid = ctx.request.body.fields.uid || null
        let files = ctx.request.body.files || null
        ctx.rest(await UserService.uploadFaceInfo(uid,files))
    },
    'POST /api/user/email_code': async (ctx, next) => {
        let email = ctx.request.body.fields.email || null
        ctx.rest(await UserService.sendEmailCode2User(email))
    }
}