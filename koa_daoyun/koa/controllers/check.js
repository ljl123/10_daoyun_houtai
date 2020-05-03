const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const db = require('../db')
const FaceMatch = require('../face-match')
const Util = require('../utils/utils')
const LogUtil = require('../log/log-util')

const User = require('../models/UserModel')
const Course = require('../models/CourseModel')
const Students = require('../models/StudentsModel')
const SigninList = require('../models/Sign-inListModel')

const config = require('../config/config-override')
const HOST_IP = config.remote ? config.imghost : config.imghost_default

/**
 * 获取返回模板
 */
var getReturnModel = Util.getReturnModel


module.exports = {
    'POST /api/check/check': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let uid = ctx.request.body.fields.uid || null
        let time = ctx.request.body.fields.time || null
        let location = ctx.request.body.fields.location || null
        let course_id = ctx.request.body.fields.course_id || null
        let files = ctx.request.body.files || null
        let file_path, file_name
        let isCheck = await isChecked(uid, course_id)
        if (isCheck == undefined) {
            returnModel.result_code = '0'
            returnModel.result_desc = "签到失败"
            ctx.rest(returnModel)
            return;
        }
        if (isCheck) {
            returnModel.data = false
            returnModel.result_code = '200'
            returnModel.result_desc = "已签到"
            ctx.rest(returnModel)
            return;
        }
        if (files) {
            for (let f in files) {
                file_path = files[f].path
                file_name = files[f].name
            }
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = "人脸信息上传失败"
            ctx.rest(returnModel)
            return;
        }
        let check_flag = await canCheck(course_id)
        if (!check_flag) {
            deleteFile(file_path)
            returnModel.data = check_flag
            if (check_flag === null) {
                returnModel.result_code = '0'
                returnModel.result_desc = '签到失败'
            } else {
                returnModel.result_code = '206'
                returnModel.result_desc = '超出签到时间'
            }
            ctx.rest(returnModel)
            return;
        }
        let finalPath = file_path + '.' + file_name.split('.')[1];
        finalPath = finalPath.replace('upload', 'facecheck')
        let tag = true;
        try {
            fs.renameSync(file_path, finalPath)
        } catch (err) {
            LogUtil.error(err);
            tag = false
        }
        if (tag) {
            let url = (HOST_IP + '/static' + finalPath.split('static')[1]).replace(/\\/g, '/');
            if ((await verifyFace(uid, url.replace(HOST_IP, __dirname.replace('controllers', ''))))) {
                if ((await check(uid, time, location, course_id))) {
                    returnModel.data = true
                    returnModel.result_code = '200'
                    returnModel.result_desc = "签到成功"
                } else {
                    deleteFile(url.replace(HOST_IP, __dirname.replace('controllers', '')))
                    returnModel.data = false
                    returnModel.result_code = '200'
                    returnModel.result_desc = "签到失败"
                }
            } else {
                deleteFile(url.replace(HOST_IP, __dirname.replace('controllers', '')))
                returnModel.result_code = '206'
                returnModel.result_desc = "人脸验证错误"
            }
        } else {
            deleteFile(file_path)
            returnModel.result_code = '0'
            returnModel.result_desc = "人脸信息上传失败"
        }
        ctx.rest(returnModel)
    },
    'POST /api/check/startCheck': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let course_id = ctx.request.body.fields.course_id || null
        let start_time = ctx.request.body.fields.start_time || null
        let duration = ctx.request.body.fields.duration || null
        if (await startCheck(course_id, start_time, duration)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '开始签到成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '无法开始签到'
        }
        ctx.rest(returnModel)
    },
    'POST /api/check/stop': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let course_id = ctx.request.body.fields.course_id || null
        let end_time = ctx.request.body.fields.end_time || null
        if (await stopCheck(course_id, end_time)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '停止签到成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '停止签到失败'
        }
        ctx.rest(returnModel)
    },
    'POST /api/check/cancheck': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let course_id = ctx.request.body.fields.course_id || null
        let result = await canCheck(course_id)
        if (result != null) {
            returnModel.data = result
            returnModel.result_code = '200'
            returnModel.result_desc = '获取成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '获取签到状态失败'
        }
        ctx.rest(returnModel)
    },
    check: check
}

/**
 * 验证人脸信息
 * @param {*} uid 
 * @param {*} face_url 
 */
var verifyFace = async (uid, face_url) => {
    if (!config.need_face) return true
    let face_url_origin = await User.findOne({
        attributes: ['face_info'],
        where: { uid: uid },
        raw: true
    }).then(res => res ? res.face_info : false)
        .catch(err => { LogUtil.error(err); return null })
    if (face_url_origin) {
        return await FaceMatch(face_url_origin.replace(HOST_IP, __dirname.replace('controllers', '')), face_url)
            .then(confidence => {
                console.log("confidence" + confidence)
                if (confidence > 60) return true
                else return false
            }).catch(err => {
                LogUtil.error(err)
                return false
            })
    }
    return false
}

/**
 * 签到
 * @param {*} uid 
 * @param {*} time 
 * @param {*} location
 * @param {*} course_id
 */
var check = async (uid, time, location, course_id) => {
    let distance
    let course_location
    let tag = await Course.findOne({
        attributes: ['check_count', 'location'],
        where: { course_id: course_id },
        raw: true
    }).then(res => {
        if (res) {
            count = res.check_count
            course_location = res.location
            return true
        } else return null
    }).catch(err => { LogUtil.error(err); return null; })
    if (!tag)
        return false
    course_location = course_location.replace(' ', '').split(',')
    check_location = location.replace(' ', '').split(',')
    distance = getDistance(course_location[0], course_location[1], check_location[0], check_location[1])
    return await SigninList.create({
        uid: uid,
        course_id: course_id,
        count: count,
        check_state: 1,
        check_time: time,
        check_location: location,
        distance: distance
    }).then(res => res ? true : false).catch(err => { LogUtil.error(err); return false; })
}

/**
 * 开始签到
 * @param {*} course_id 
 * @param {*} start_time ms
 * @param {*} duration 持续时间(毫秒)
 */
var startCheck = async (course_id, start_time, duration) => {
    let end_time = Number(start_time) + Number(duration.replace(' ', ''))
    return await Course.update({
        start_time: start_time,
        end_time: end_time,
        check_count: db.sequelize.literal("`check_count`+1"),
        // check_count: db.sequelize.fn('1 + abs',db.sequelize.col('courses.check_count')),
    }, {
            where: { course_id: course_id }
        }).then(res => res == 1 ? true : false).catch(err => { LogUtil.error(err); return false; })

}

/**
 * 结束签到
 * @param {*} course_id 
 * @param {*} end_time ms
 */
var stopCheck = async (course_id, end_time) => {
    return await Course.update({
        end_time: Number(end_time)
    }, {
            where: { course_id: course_id }
        }).then(res => res == 1 ? true : false).catch(err => { LogUtil.error(err); return false; })
}

/**
 * 是否在签到时间内
 * @param {*} course_id 
 */
var canCheck = async (course_id) => {
    return await Course.findOne({
        attributes: ['start_time', 'end_time'],
        where: { course_id: course_id },
        raw: true
    }).then(res => {
        let now = Date.now()
        LogUtil.debug('now:' + new Date(now))
        LogUtil.debug('start:' + new Date(res.start_time))
        LogUtil.debug('end:' + new Date(res.end_time))
        if (Number(now) > Number(res.start_time) && Number(now) < Number(res.end_time)) return true;
        else return false;
    }).catch(err => {
        LogUtil.error(err);
        return null;
    })
}

var isChecked = async (uid, course_id) => {
    let check_count = await Course.findOne({
        attributes: ['check_count'],
        where: { course_id: course_id },
        raw: true
    }).then(res => res ? res : null).catch(err => {
        LogUtil.error(err);
        return null;
    })
    console.log("is check")
    if (check_count == null) return undefined
    return await SigninList.findOne({
        where: { uid: uid, course_id: course_id, count: '' + (check_count.check_count) },
        raw: true
    }).then(res => {
        if (res) return true
        else return false
    }).catch(err => {
        LogUtil.error(err);
        return undefined;
    })
}

/**
 * 删除文件
 * @param {*} url 
 */
var deleteFile = (url) => {
    fs.unlink(url, (err) =>
        err ? LogUtil.error(err) : LogUtil.error('delete old file success'));
}

/**
 * 经纬度转换成三角函数中度分表形式
 * @param {*} d 经度或纬度
 */
var Rad = (d) => d * Math.PI / 180.0

/**
 * 获取两个gps定位的距离
 * @param {*} lat1 第一点的纬度
 * @param {*} lng1 第一点的经度
 * @param {*} lat2 第二点的纬度
 * @param {*} lng2 第二点的经度
 */
var getDistance = (lat1, lng1, lat2, lng2) => {
    try {
        var radLat1 = Rad(lat1);
        var radLat2 = Rad(lat2);
        var a = radLat1 - radLat2;
        var b = Rad(lng1) - Rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10; //输出为米
        //s=s.toFixed(4);
        return s;
    } catch (e) {
        LogUtil.error(e);
        return 9999999;
    }
}