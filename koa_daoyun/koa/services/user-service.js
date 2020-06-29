const fs = require('fs');
const db = require('../db')
const nodemailer = require("nodemailer");
const Cache = require('memory-cache');
const getError = require('../utils/utils').getErrObj
const Util = require('../utils/utils')
const User = require('../models/UserModel')
const LogUtil = require('../log/log-util')
const Manager = require('../models/ManagerModel')

const config = require('../config/config-override')
const HOST_IP = config.remote ? config.imghost : config.imghost_default
console.log(HOST_IP)
const MailSender = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: "376806225@qq.com",
        pass: "wickcgsndsgkcabd"
    }
});

let now = Date.now()
/**
 * 获取返回模板
 */
var getReturnModel = Util.getReturnModel

module.exports = {
    login: async (username, pwd) => {
        let returnModel = getReturnModel();
        let user_exist = await getUser(username)
        if (user_exist) {
            let user = await checkPassword(username, pwd)
            if (user) {
                updateUserLoginTime(user.uid)
                let user_token = await Util.getToken(String(user.uid) + ',' + now)
                returnModel.data = {
                    token: user_token,
                    uid: user.uid,
                    email: user.email,
                    name: user.name,
                    nick_name: user.nick_name,
                    gender: user.gender,
                    stu_code: user.stu_code,
                    phone: user.phone,
                    type: user.type,
                    avatar: user.avatar,
                    school: user.school,
                    department: user.department,
                    profession: user.profession,
                    rg_time: user.rg_time,
                    last_login_time: user.last_login_time
                }
                returnModel.result_code = '200'
                returnModel.result_desc = '登录成功'
            } else {
                returnModel.result_code = "204"
                returnModel.result_desc = "密码错误"
            }
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '用户不存在'
        }
        return returnModel
    },
    register: async (user, email_code, is_manage_create = false) => {
        let returnModel = getReturnModel()
        if (await getUser(user.email)) {
            returnModel.result_code = '206'
            returnModel.result_desc = '用户已存在'
            ctx.rest(returnModel)
            return;
        }
        await do_register(user, email_code, is_manage_create).then(res => {
            if (res) {
                returnModel.result_code = '200'
                returnModel.result_desc = '注册成功'
            } else {
                returnModel.result_code = "0"
                returnModel.result_desc = "注册失败"
            }
        }).catch(err => {
            LogUtil.error(err)
            returnModel.result_code = "206"
            returnModel.result_desc = err.message
        })
        return returnModel
    },
    changePassword: async (token, email, email_code = '', new_pwd = '', old_pwd = '') => {
        let returnModel = getReturnModel()
        if (!(await Util.tokenVerify(token))) {
            if (!verifyEmailCode(email, email_code)) {
                returnModel.result_code = '206'
                returnModel.result_desc = '修改失败，验证码不正确'
            } else {
                if (await modifyPassword(email, new_pwd)) {
                    returnModel.result_code = '200'
                    returnModel.result_desc = '修改成功'
                } else {
                    returnModel.result_code = '206'
                    returnModel.result_desc = '修改失败'
                }
            }
        } else {
            await modifyPassword(email, new_pwd, old_pwd).then(res => {
                if (res) {
                    returnModel.result_code = '200'
                    returnModel.result_desc = '修改成功'
                } else {
                    returnModel.result_code = '0'
                    returnModel.result_desc = '旧密码错误'
                }
            }).catch(err => {
                returnModel.result_code = '206'
                returnModel.result_desc = err.message
            })
        }
        return returnModel
    },
    modifyUserInfo: async (uid, user) => {
        let returnModel = getReturnModel();
        await updateUserInfo(uid, user).then(res => {
            if (res) {
                returnModel.result_code = '200'
                returnModel.result_desc = '修改成功'
            } else {
                returnModel.result_code = "206"
                returnModel.result_desc = "修改失败(手机号重复或不存在用户)"
            }
        }).catch(err => {
            returnModel.result_code = "0"
            returnModel.result_desc = err.message
        })
        return returnModel
    },
    getUserFaceInfo: async (token) => {
        let returnModel = getReturnModel()
        let user = await getUser(Util.getUidFromToken(token))
        if (user.face_info) {
            returnModel.result_code = '200'
            returnModel.result_desc = '人脸信息存在'
        } else {
            returnModel.result_code = "206"
            returnModel.result_desc = "人脸信息不存在"
        }
        return returnModel
    },
    uploadAvatar: async (token, uid, files) => {
        let returnModel = getReturnModel();
        let file_path, file_name
        if (files) {
            for (let f in files) {
                file_path = files[f].path
                file_name = files[f].name
            }
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = "头像文件上传失败"
            ctx.rest(returnModel)
            return;
        }
        let finalPath = file_path + '.' + file_name.split('.')[1];
        let tag = true;
        try {
            fs.renameSync(file_path, finalPath)
        } catch (err) {
            LogUtil.error(err);
            tag = false
        }
        if (tag) {
            let origin_url = (await getUserImageUrl(uid)).avatar || null
            let url = (HOST_IP + '/static' + finalPath.split('static')[1]).replace(/\\/g, '/');
            if (await User.update(
                { avatar: url },
                { where: { uid: uid } })
                .then(res => res == 1 ? true : false)
                .catch(err => { LogUtil.error(err); return false; })) {
                if (origin_url) fs.unlink(__dirname.replace('services', '') + origin_url.replace(HOST_IP, ''), (err) => err ? LogUtil.error(err) : LogUtil.info('delete old file success'));
                returnModel.data = { avatar: url }
                returnModel.result_code = '200'
                returnModel.result_desc = "头像上传成功"
            } else {
                returnModel.result_code = '206'
                returnModel.result_desc = "头像上传失败"
            }
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = "头像上传失败"
        }
        return returnModel
    },
    uploadFaceInfo: async (uid, files) => {
        let returnModel = getReturnModel()
        let file_path, file_name
        if (files) {
            for (let f in files) {
                file_path = files[f].path
                file_name = files[f].name
            }
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = "人脸信息上传成功"
            ctx.rest(returnModel)
            return;
        }
        let finalPath = (file_path + '.' + file_name.split('.')[1]).replace('upload', 'faceinfo');
        let tag = true;
        try {
            fs.renameSync(file_path, finalPath)
        } catch (err) {
            LogUtil.error(err);
            tag = false
        }
        if (tag) {
            let url = (HOST_IP + '/static' + finalPath.split('static')[1]).replace(/\\/g, '/');
            let origin_url = (await getUserImageUrl(uid)).face_info || null
            if (await User.update(
                { face_info: url },
                { where: { uid: uid } })
                .then(res => res == 1 ? true : false)
                .catch(err => { LogUtil.error(err); return false; })) {
                if (origin_url) fs.unlink(__dirname.replace('services', '') + origin_url.replace(HOST_IP, ''), (err) => err ? LogUtil.error(err) : LogUtil.error('delete old file success'));
                returnModel.result_code = '200'
                returnModel.result_desc = "请求成功"
            } else {
                returnModel.result_code = '206'
                returnModel.result_desc = "人脸信息上传失败"
            }
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = "人脸信息上传失败"
        }
        return returnModel
    },
    sendEmailCode2User: async (email) => {
        let returnModel = getReturnModel()
        await sendEmailCode(email).then(res => {
            if (res) {
                returnModel.result_code = '200'
                returnModel.result_desc = "发送成功"
            } else {
                returnModel.result_code = '206'
                returnModel.result_desc = "发送失败"
            }
        }).catch(err => {
            LogUtil.error(err)
            returnModel.result_code = '0'
            returnModel.result_desc = err.message
        })
        return returnModel
    }
}

/**
 * 获取用户
 * @param {*} name 邮箱或者手机号
 */
var getUser = async (name) => await User.findOne({
    where: {
        $or: { email: name, phone: name, uid: name }
    },
    raw: true
}).then(res => {
    return res ? res : false
}).catch(err => {
    LogUtil.error(err)
    return false
})

/**
 * 验证密码
 * @param {*} name 用户名或者邮箱或者电话
 * @param {*} p 密码
 */
var checkPassword = async (name, p) =>
    await User.findOne({
        where: {
            $or: { email: name, phone: name ,name:name},
            password: p
        },
        raw: true
    }).then(res => res ? res : null).catch(err => {
        LogUtil.error(err)
        return null
    });

/**
 * 更新用户登录时间
 * @param {*} uid user id 
 */
var updateUserLoginTime = (uid) => {
    let time = Date.now()
    User.update({ last_login_time: time }, {
        where: { uid: uid }
    }).then(res => res == 1 ? LogUtil.debug('update last login time success') : LogUtil.debug('update last login time failed'))
        .catch(err => LogUtil.err('update last login time failed' + '\n' + err))
}

/**
 * 注册
 * @param {Object} user 用户信息类
 */
var do_register = async (user, email_code, is_manage_create = false) => {
    let e = getError()
    if (user.type != '1' && !is_manage_create && !verifyEmailCode(user.email, email_code)) { e.message = '邮箱验证码不正确'; throw e; }
    let now = Date.now()
    let form = {
        email: user.email,
        phone: user.phone,
        password: user.password,
        nick_name: '到云_' + user.email.substring(4),
        name: user.name,
        type: user.type,
        reg_time: now,
        stu_code: user.stu_code,
        gender: user.gender,
        school: user.school,
        department: user.department,
        profession: user.profession
    }

    return await User.create(form).then(res => {
        if (res) {
            if (Number(user.type) == 1)
                createPower(res.uid)
            return res
        }
        return null
    }).catch(err => {
        LogUtil.error(err);
        if (err.fields.phone != null)
            e.message = '此手机号已被使用'
        else
            e.message = err.name;
        throw e;
    })
}

var createPower = (uid) => {
    Manager.create({
        uid: uid
    }).then(res => {
        if (res)
            LogUtil.info('管理员权限初始化成功')
        else LogUtil.info('管理员权限初始化失败')
    }).catch(err => {
        LogUtil.error(err);
    })
}

/**
 * 修改密码
 * @param {*} email email
 * @param {*} pwd 新密码
 */
var modifyPassword = async (email, pwd, old_pwd = null) => {
    if (!old_pwd) {
        return await User.update({ password: pwd }, {
            where: {
                email: email
            }
        }).then(res => res == 1 ? true : false).catch(err => { LogUtil.error(err); e.message = err.name; throw e; })
    }
    return await User.update({ password: pwd }, {
        where: {
            email: email,
            password: old_pwd
        }
    }).then(res => res == 1 ? true : false).catch(err => { LogUtil.error(err); e.message = err.name; throw e; })
}

/**
 * 修改用户信息
 * @param {*} uid uid
 * @param {*} user 用户信息
 */
var updateUserInfo = async (uid, user) => {
    let e = Util.getErrObj()
    return await User.update(user, {
        where: { uid: uid }
    }).then(res => res == 1 ? true : false).catch(err => {
        LogUtil.error(err);
        if (err.fields.phone != null)
            e.message = '此手机号已被使用'
        else
            e.message = err.name;
        throw e;
    })
}

/**
 * 获取用户头像和人脸信息的url
 * @param {*} uid 
 */
var getUserImageUrl = async (uid) => await User.findOne({
    attributes: ['face_info', 'avatar'],
    where: { uid: uid },
    raw: true
}).then(res => res ? res : null).catch(err => { LogUtil.error(err); return null; })

/**
 * 生成随机数
 * @param {Number} l 长度
 */
var generateRandomNumber = (l = 0) => {
    if (typeof (l) != Number) l = 6;
    let s = ''
    for (let i = 0; i < l; i++)
        s += parseInt(Math.random() * 10)
    return s
}

/**
 * 发送邮箱验证码
 * @param {*} email 
 */
var sendEmailCode = async (email) => {
    let e = { message: '' }
    let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if (!reg.test(email)) { e.message = '邮箱地址不正确'; throw e }
    let code = generateRandomNumber(6);
    let sendOption = {
        from: '<376806225@qq.com>', // sender address
        to: email, // list of receivers
        subject: "\"第10组到云\"验证码", // Subject line
        text: "验证码为：" + code + ",十分钟内有效。" // plain text body
    }
    let result = await MailSender.sendMail(sendOption)
        .then(res => res ? true : false)
        .catch(err => {
            LogUtil.error(err)
            throw err
        })
    if (result)
        Cache.put(email, code, 1000 * 60 * 10)
    return result
}

/**
 * 判断邮箱验证码
 * @param {*} email 
 * @param {*} code 
 */
var verifyEmailCode = (email, code) => {
    LogUtil.debug(Cache.get(email))
    LogUtil.debug(code)
    return '' + Cache.get(email) === code
}