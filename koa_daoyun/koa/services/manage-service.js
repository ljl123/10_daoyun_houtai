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
const Manager = require('../models/ManagerModel')
const UserService = require('../services/user-service')

const config = require('../config/config-override')
const HOST_IP = config.remote ? config.imghost : config.imghost_default


let now = Date.now()


module.exports = {
    getManagerPowers: async (token, page, count) => {
        let returnModel = Util.getReturnModel()
        let power = await Util.getUserPower(token)
        if (power.mManage != 1) {
            returnModel.result_code = '0'
            returnModel.result_desc = '没有管理权限'
            return returnModel
        }
        returnModel.data = await getManagerList(page, count, token)
        returnModel.result_code = '200'
        returnModel.result_desc = '操作成功'
        return returnModel
    },
    setManagerPower: async (token, id, powers) => {
        let returnModel = Util.getReturnModel()
        let power = await Util.getUserPower(token)
        if (power.mManage != 1) {
            returnModel.result_code = '0'
            returnModel.result_desc = '没有管理权限'
            return returnModel
        }
        let res = await Manager.update({
            mUser: powers.mUser,
            mCourse: powers.mCourse,
            mCheck: powers.mCheck,
            mStudent: powers.mStudent,
            mDict: powers.mDict,
            mManage: powers.mManage
        }, {
                where: { id: id },
                raw: true
            }).then(res => res == 1 ? true : false).catch(err => {
                LogUtil.error(err); return false;
            })
        if (res) {
            returnModel.result_code = '200'
            returnModel.result_desc = '操作成功'
            return returnModel
        }
        returnModel.result_code = '0'
        returnModel.result_desc = '操作失败'
        return returnModel
    },
    getUserList: async (params) => {
        let returnModel = Util.getReturnModel()
        let page = params.page || '1'
        let count = params.count || '10'
        let filter = {
            school: params.school,
            department: params.department,
            profession: params.profession
        }
        if (filter.school == undefined) delete filter.school
        if (filter.department == undefined) delete filter.department
        if (filter.profession == undefined) delete filter.profession
        let data = await User.findAll({
            where: filter,
            limit: parseInt(count),
            offset: (parseInt(page) - 1) * parseInt(count),
            raw: true
        }).then(res => res ? res : null).catch(err => {
            LogUtil.error(err); return null;
        })
        returnModel.data = data
        returnModel.result_code = '200'
        returnModel.result_desc = '操作成功'
        return returnModel
    },
    deleteUser: async (uid) => {
        let returnModel = Util.getReturnModel()
        if (uid == undefined) {
            returnModel.result_code = '0'
            returnModel.result_desc = '参数错误'
            return returnModel
        }
        let res = await User.destroy({
            where: { uid: uid },
            raw: true
        }).then(res => res == 1 ? true : false).catch(err => {
            LogUtil.error(err); return false;
        })
        if (res) {
            returnModel.result_code = '200'
            returnModel.result_desc = '删除成功'
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = '删除失败'
        }
        return returnModel
    },
    getCourseList: async (params) => {
        let returnModel = Util.getReturnModel()
        let page = params.page || '1'
        let count = params.count || '10'
        let data = await Course.findAll({
            attributes: ['course_id', 'course_name', 'teacher', 'time'],
            where: {
                $or: [
                    { teacher: { $like: '%' + params.teacher_key + '%' } },
                    { course_code: { $like: '%' + params.course_key + '%' } },
                    { course_name: { $like: '%' + params.course_key + '%' } }
                ]
            },
            limit: parseInt(count),
            offset: (parseInt(page) - 1) * parseInt(count),
            raw: true
        }).then(res => res ? res : null).catch(err => {
            LogUtil.error(err); return null;
        })
        returnModel.data = data
        returnModel.result_code = '200'
        returnModel.result_desc = '操作成功'
        return returnModel
    },
    deleteCourse: async (course_id) => {
        let returnModel = Util.getReturnModel()
        if (course_id == undefined) {
            returnModel.result_code = '0'
            returnModel.result_desc = '参数错误'
            return returnModel
        }
        let res = await Course.destroy({
            where: { course_id: course_id },
            raw: true
        }).then(res => res == 1 ? true : false).catch(err => {
            LogUtil.error(err); return false;
        })
        if (res) {
            returnModel.result_code = '200'
            returnModel.result_desc = '删除成功'
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = '删除失败'
        }
        return returnModel
    },
    modifyCheckInfo: async (params) => {
        let returnModel = Util.getReturnModel()
        let id = params.id
        delete params.token
        delete params.type
        delete params.id
        let res = await SigninList.update(params, {
            where: { id: id },
            raw: true
        }).then(res => res == 1 ? true : false).catch(err => {
            LogUtil.error(err); return null;
        })
        if (res) {
            returnModel.result_code = '200'
            returnModel.result_desc = '修改成功'
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = '修改失败'
        }
        return returnModel
    },
    modifyStudentInfo: async (params) => {
        let returnModel = Util.getReturnModel()
        let id = params.id
        delete params.id
        delete params.token
        delete params.type
        let res = await Students.update(params, {
            where: { id: id },
            raw: true
        }).then(res => res == 1 ? res : false).catch(err => {
            LogUtil.error(err); return null;
        })
        if (res) {
            returnModel.result_code = '200'
            returnModel.result_desc = '修改成功'
        } else {
            returnModel.result_code = '0'
            returnModel.result_desc = '修改失败'
        }
        return returnModel
    }
}


var getManagerList = async (page, count, token) => {
    let uid = Util.getUidFromToken(token)
    User.hasMany(Manager, { foreignKey: 'uid' })
    Manager.belongsTo(User, { foreignKey: 'uid' })
    return await Manager.findAll({
        where: { uid: { $not: uid } },
        order: [['id', 'DESC']],
        limit: parseInt(count),
        offset: parseInt(page) * parseInt(count),
        include: [{
            model: User,
            attributes: [
                db.sequelize.literal('user.email as email'),
                db.sequelize.literal('user.nick_name as nick_name'),
                db.sequelize.literal('user.school as school')]
        }],
        raw: true
    }).then(res => res ? res : null).catch(err => {
        LogUtil.error(err); return null;
    })
}