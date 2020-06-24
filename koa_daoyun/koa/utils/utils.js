const jwt = require('jsonwebtoken');
const LogUtil = require('../log/log-util')
const User = require('../models/UserModel')
const Manager = require('../models/ManagerModel')

const secret = "jwt verify";
let format_time = new Date().toLocaleString()
let now = Date.now()

/**
 * 获取token
 * @param {*} uid uid
 * @param {*} time 持续时间 '1d 1h 1s'
 */
let getToken = async (uid, time = '1d') => {
    let token = jwt.sign({
        msg: uid
    }, secret, {
            expiresIn: time
        });
    return token
}

let getUidFromToken = (token) => jwt.decode(token).msg.split(',')[0]


module.exports = {
    'getErrObj': () => {
        return {
            'err_level': 3,
            'message': ''
        }
    },
    'getToken': getToken,
    'getUidFromToken': getUidFromToken,
    'tokenVerify': async (token) => {
        if (!token) return false;
        let result = false;
        jwt.verify(token, secret, function (err, decoded) {
            if (!err) {
                result = true;
            } else {
                LogUtil.info(err)
                result = false;
            }
        })
        return result;
    },
    'getReturnModel': () => {
        let now = Date.now()
        let now_short = Number(String(now).substring(5, 15));
        return {
            data: null,
            request_id: now_short,
            result_code: "0",
            result_desc: "none content",
            timestamp: format_time
        }
    },
    'getUserTypeFromToken': async (token) =>
        await User.findOne({
            attributes: ['type'],
            where: { uid: getUidFromToken(token) },
            raw: true
        }).then(res => res ? Number(res.type) : null).catch(err => { LogUtil.error(err); return null; }),
    'getUserPower': async (token) => {
        let uid = getUidFromToken(token)
        return Manager.findOne({
            attributes: ['mUser', 'mCourse', 'mCheck', 'mStudent', 'mDict','mManage'],
            where: {
                uid: uid
            },
            raw: true
        }).then(res => res ? res : LogUtil.error('数据库出错或不存在该管理员用户')).catch(err => {
            LogUtil.error(err)
            return null
        })
    }
}