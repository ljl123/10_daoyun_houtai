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
        let is_manage_create = user.is_manage_create
        if(is_manage_create==='1'){
            is_manage_create=true
            user.password='e10adc3949ba59abbe56e057f20f883e'
        }else{
            is_manage_create=false
        }
        delete user.email_code
        ctx.rest(await UserService.register(user,email_code,is_manage_create))
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
    'POST /api/user/email_code': async (ctx, next) => {
        let email = ctx.request.body.fields.email || null
        ctx.rest(await UserService.sendEmailCode2User(email))
    }
}