const db = require('../db')
const HashMap = require('hashmap');
const stringRandom = require('string-random');
const Util = require('../utils/utils')
const LogUtil = require('../log/log-util')

const User = require('../models/UserModel')
const Course = require('../models/CourseModel')
const Students = require('../models/StudentsModel')
const SigninList = require('../models/Sign-inListModel')

const config = require('../config/config-override')



/**
 * 获取返回模板
 */
let getReturnModel = Util.getReturnModel


module.exports = {
    createCourse: async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let uid = ctx.request.body.fields.uid || null
        let course = ctx.request.body.fields
        delete course.token
        delete course.uid
        let type = await Util.getUserTypeFromToken(token)
        if (type && type < 3)
            if (await createCourse(uid, course)) {
                returnModel.result_code = '200'
                returnModel.result_desc = '创建成功'
            } else {
                returnModel.result_code = '206'
                returnModel.result_desc = '创建失败'
            }
        else {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
        }
        return returnModel
    },
    getCourseList: async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.query.token || null
        let list = await getCourseList(token)
        if (list) {
            returnModel.data = list
            returnModel.result_code = '200'
            returnModel.result_desc = '获取课程成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '获取课程失败'
        }
        return returnModel
    },
    getCourseInfo: async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.query.token || null
        let course_id = ctx.request.query.course_id || null
        await Course.findOne({
            attributes: ['course_id', 'course_name', 'course_code', 'place', 'location', 'time', 'stu_count', 'teacher', 'check_count', 'creater_uid'],
            where: {
                course_id: course_id
            },
            raw: true
        }).then(res => {
            if (res) {
                returnModel.data = res
                returnModel.result_code = '200'
                returnModel.result_desc = '获取课程成功'
            } else {
                returnModel.result_code = '206'
                returnModel.result_desc = '课程不存在'
            }
        }).catch(err => {
            LogUtil.error(err);
            returnModel.result_code = '206'
            returnModel.result_desc = '获取课程信息失败\n' + err.name
        })
        return returnModel
    },
    searchCourse: async (ctx, next) => {
        let returnModel = getReturnModel();
        let keys = ctx.request.query.keys || null
        let token = ctx.request.query.token || null
        let page = ctx.request.query.page
        let page_size = ctx.request.query.page_size
        if (page == undefined) page = '1'
        if (page_size == undefined) page_size = '10'
        let list = await searchCourses(keys, token, page, page_size)
        if (list) {
            returnModel.data = list
            returnModel.result_code = '200'
            returnModel.result_desc = '搜索成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '搜索失败'
        }
        return returnModel
    },
    addCourse: async (ctx, next) => {
        let returnModel = getReturnModel();
        let uid = ctx.request.body.fields.uid || null
        let course_id = ctx.request.body.fields.course_id || null
        if (await addCourse(uid, course_id)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '添加成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '添加失败'
        }
        return returnModel
    },
    modifyCourseInfo: async (ctx, next) => {
        let returnModel = getReturnModel();
        let course = ctx.request.body.fields
        let course_id = ctx.request.body.fields.course_id || null
        delete course.token
        delete course.course_id
        if (await modifyCourseInfo(course_id, course)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '修改成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '修改失败'
        }
        return returnModel
    },
    getStudentsList: async (ctx, next) => {
        let returnModel = getReturnModel();
        let course_id = ctx.request.query.course_id || null
        let list = await getStudents(course_id)
        if (list) {
            returnModel.data = list
            returnModel.result_code = '200'
            returnModel.result_desc = '获取学生列表成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '获取学生列表失败'
        }
        return returnModel
    },
    deleteStudent: async (ctx, next) => {
        let returnModel = getReturnModel();
        let course_id = ctx.request.body.fields.course_id || null
        let uid = ctx.request.body.fields.uid || null
        if (await deleteStudents(uid, course_id)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '删除学生成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '删除学生失败'
        }
        return returnModel
    },
    modifyStudent: async (ctx, next) => {
        let returnModel = getReturnModel();
        let id = ctx.request.body.fields.id || null
        let lack_count = ctx.request.body.fields.lack_count || null
        if (await modifyStudents(id, lack_count)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '修改学生成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '修改学生失败'
        }
        return returnModel
    },
    getCheckList: async (ctx, next) => {
        let returnModel = getReturnModel();
        let course_id = ctx.request.query.course_id || null
        let list = await getCheckList(course_id)
        let newList = []
        if (list) {
            uids = new HashMap()
            for (x in list) {
                if (uids.get(list[x].uid))
                    continue
                uids.set(list[x].uid, 1)
                newList.push(list[x])
            }
            returnModel.data = newList
            returnModel.result_code = '200'
            returnModel.result_desc = '获取签到列表成功'
        }else {
            returnModel.result_code = '206'
            returnModel.result_desc = '获取签到列表失败'
        }
        return returnModel
    },
    deleteCheckList: async (ctx, next) => {
        let returnModel = getReturnModel();
        let id = ctx.request.body.fields.id || null
        if (await deleteCheckList(id)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '删除签到列表项成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '删除签到列表项失败'
        }
        return returnModel
    },
    modifyCheckList: async (ctx, next) => {
        let returnModel = getReturnModel();
        let id = ctx.request.body.fields.id || null
        let remarks = ctx.request.body.fields.remarks || null
        let distance = ctx.request.body.fields.distance || null
        if (await modifyCheckList(id, remarks, distance)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '修改签到列表项成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '修改签到列表项失败'
        }
        return returnModel
    },
    addStudent2Course: async (ctx, next) => {
        let returnModel = getReturnModel();
        let course_id = ctx.request.body.fields.course_id || null
        let stu_code = ctx.request.body.fields.stu_code || null
        let email = ctx.request.body.fields.email || null
        let phone = ctx.request.body.fields.phone || null
        let result = await addStu2Course(course_id, stu_code, email, phone)
        if (result) {
            returnModel.result_code = '200'
            returnModel.result_desc = '添加学生到课程成功'
        } else if (result == null) {
            returnModel.result_code = '206'
            returnModel.result_desc = '添加的学生用户不存在'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '添加失败'
        }
        return returnModel
    }
}

/**
 * 创建课程
 * @param {*} uid 创建者uid
 * @param {*} course 课程信息
 */
var createCourse = async (uid, course) => {
    course.creater_uid = uid
    course.course_code = stringRandom(6)
    return await Course.create(course).then(res => res ? true : false).catch(err => { LogUtil.error(err); return false; })
}

/**
 * 获取用户添加的课程的列表
 * @param {*} uid 
 * @param {*} type 用户类型
 */
var getCourseList = async (token) => {
    let whereModel = {}
    let course_ids
    let uid = Util.getUidFromToken(token)
    let type = await Util.getUserTypeFromToken(token)
    switch (type) {
        case 1: break;
        case 2:
            whereModel.creater_uid = uid
            break;
        default:
            course_ids = await Students.findAll({
                attributes: ['course_id'],
                where: { uid: uid },
                raw: true
            }).then(res => {
                let c = []
                for (r in res)
                    c.push(res[r].course_id)
                return c
            }).catch(err => {
                LogUtil.error(err)
                whereModel = null
            })
            if (whereModel)
                whereModel = { course_id: { in: course_ids } }
    }
    if (!whereModel) return null;
    return await Course.findAll({
        attributes: ['course_id', 'course_name', 'teacher', 'time'],
        where: whereModel,
        raw: true
    }).then(res => res ? res : null).catch(err => { LogUtil.error(err); return null; })
}

/**
 * 搜索课程
 * @param {*} keys 搜索的内容
 */
var searchCourses = async (keys, token, page, page_size) => {
    let courseList = await getCourseList(token)
    return await Course.findAll({
        attributes: ['course_id', 'course_name', 'teacher', 'time'],
        where: {
            $or: [
                { course_code: { $like: '%' + keys + '%' } },
                { course_name: { $like: '%' + keys + '%' } },
                { teacher: { $like: '%' + keys + '%' } },
            ]
        },
        limit: parseInt(page_size),
        offset: (parseInt(page) - 1) * parseInt(page_size),
        raw: true
    }).then(res => {
        if (!res) return null;
        let ids = new HashMap();
        for (let i in courseList)
            ids.set(courseList[i].course_id, i)
        for (let j in res)
            if (ids.get(res[j].course_id))
                res[j].added = 1
            else
                res[j].added = 0
        return res
    }).catch(err => { LogUtil.error(err); return null; })
}

/**
 * 添加课程到自己的课程列表中
 * @param {*} uid 
 * @param {*} course_id 
 */
var addCourse = async (uid, course_id) => {
    return await Students.create({
        uid: uid,
        course_id: course_id
    }).then(res => res ? true : false).catch(err => { LogUtil.error(err); return false })
}

/**
 * 修改课程内容
 * @param {*} course_id 课程id
 * @param {*} course 修改的内容
 */
var modifyCourseInfo = async (course_id, course) => {
    return await Course.update(course, {
        where: { course_id: course_id }
    }).then(res => res ? true : false).catch(err => { LogUtil.error(err); return false; })
}

/**
 * 获取课程的学生列表
 * @param {*} course_id 课程id
 */
var getStudents = async (course_id) => {
    let uids = []
    let ids = new HashMap()
    let lacks = new HashMap()
    //签到数当作经验值(ljl)
    let checks=new HashMap()
    await Students.findAll({
        where: { course_id: course_id },
        raw: true
    }).then(res => {
        if (res.length && res.length != 0)
            for (u in res) {
                //获取uid和缺勤次数 放入list和map中
                uids.push(res[u].uid)
                ids.set(res[u].uid, res[u].id)
                lacks.set(res[u].uid, res[u].lack_count)
                checks.set(res[u].uid, res[u].check_count)//签到数当作经验值(ljl)
            }
    }).catch(err => { LogUtil.error(err) })

    if (uids.length == 0) return [];

    return await User.findAll({
        attributes: ['uid', 'stu_code', 'name', 'gender',
            'school', 'department', 'profession', 'phone',],
        where: { uid: { in: uids } },
        raw: true
    }).then(res => {
        //添加缺勤次数字段
        for (let i = 0; i < res.length; i++) {
            res[i].lack_count = lacks.get(res[i].uid)
            res[i].check_count = checks.get(res[i].uid)//签到数当作经验值(ljl)
            res[i].id = ids.get(res[i].uid)
        }
        return res
    }).catch(err => {
        LogUtil.error(err)
        return null
    })
}

/**
 * 获取签到列表
 * @param {*} course_id 
 */
var getCheckList = async (course_id) => {
    User.hasMany(SigninList, { foreignKey: 'uid' })
    SigninList.belongsTo(User, { foreignKey: 'uid' })
    return await SigninList.findAll({
        attributes: ['id', 'uid', 'count', 'check_state', 'check_time', 'check_location',
            'remarks', 'distance'],
        where: { course_id: course_id },
        order: [['check_time', 'DESC']],
        include: [{
            model: User,
            attributes: [
                db.sequelize.literal('user.stu_code as stu_code'),
                db.sequelize.literal('user.avatar as avatar'),
                db.sequelize.literal('user.name as name'),
                db.sequelize.literal('user.gender as gender'),
                db.sequelize.literal('user.school as school'),
                db.sequelize.literal('user.department as department'),
                db.sequelize.literal('user.profession as profession'),
                db.sequelize.literal('user.phone as phone')]
        }],
        raw: true
    }).then(res => res ? res : null).catch(err => { LogUtil.error(err); return null; })
}

/**
 * 删除学生列表中的学生
 * @param {*} uid 
 * @param {*} course_id 
 */
var deleteStudents = async (uid, course_id) => {
    return await Students.destroy({
        where: { uid: uid, course_id: course_id }
    }).then(res => res == 1 ? true : false).catch(err => { LogUtil.error(err); return false; })
}

/**
 * 删除签到列表项
 * @param {*} id 
 */
var deleteCheckList = async (id) => {
    return await SigninList.destroy({
        where: { id: id }
    }).then(res => res == 1 ? true : false).catch(err => { LogUtil.error(err); return false; })
}

/**
 * 修改学生列表的缺勤次数
 * @param {*} id 
 * @param {*} lack_count 
 */
var modifyStudents = async (id, lack_count) => {
    return await Students.update({ lack_count: lack_count }, {
        where: { id: id }
    }).then(res => res == 1 ? true : false).catch(err => { LogUtil.error(err); return false; })
}

/**
 * 修改签到列表项的内容
 * @param {*} id 
 * @param {*} remarks 
 * @param {*} distance 
 */
var modifyCheckList = async (id, remarks, distance) => {
    return await SigninList.update({
        remarks: remarks,
        distance: distance
    }, {
            where: { id: id }
        }).then(res => res == 1 ? true : false).catch(err => { LogUtil.error(err); return false; })
}

/**
 * 添加学生到课程
 * @param {*} course_id 
 * @param {*} stu_code 
 * @param {*} email 
 * @param {*} phone 
 */
var addStu2Course = async (course_id, stu_code = '0', email = '0', phone = '0') => {
    let user = await User.findOne({
        where: {
            $or: [{ stu_code: stu_code }, { email: email }, { phone: phone }]
        },
        raw: true
    }).then(res => res ? res : null).catch(err => { LogUtil.error(err); return false; })
    if (!user) return user
    return await Students.create({
        uid: user.uid,
        course_id: course_id
    }).then(res => res ? true : false).catch(err => { LogUtil.error(err); return false; })
}

