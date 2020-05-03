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
const ManageService = require('../services/manage-service')
const UserController = require('../controllers/user')
const CourseController = require('../controllers/course')
const CheckController = require('../controllers/check')
const UserService = require('../services/user-service')

const config = require('../config/config-override')
const HOST_IP = config.remote ? config.imghost : config.imghost_default


const Defalt_Page_Size = 10
const Defalt_Page_Index = 1

module.exports = {
    'GET /api/manage/power': async (ctx, next) => {
        let token = ctx.request.query.token || null
        let page = ctx.request.query.page || null
        let count = ctx.request.query.count || null
        if (page == undefined) page = Defalt_Page_Index
        if (count == undefined) count = Defalt_Page_Size
        ctx.rest(await ManageService.getManagerPowers(token, parseInt(page) - 1, parseInt(count)))
    },
    'POST /api/manage/power': async (ctx, next) => {
        let token = ctx.request.body.fields.token || null
        let id = ctx.request.body.fields.id || null
        let powers = ctx.request.body.fields
        ctx.rest(await ManageService.setManagerPower(token, id, powers))
    },
    'POST /api/manage/user': async (ctx, next) => {
        let token = ctx.request.body.fields.token || null
        let type = ctx.request.body.fields.inter_type || null
        let params = ctx.request.body.fields
        if((await Util.getUserPower(token)).mUser!=1){
            let returnModel = Util.getReturnModel()
            returnModel.result_code = '0'
            returnModel.result_desc = '没有管理权限'
            ctx.rest(returnModel)
            return;
        }
        switch (parseInt(type)) {
            case 1:
                ctx.rest(await ManageService.getUserList(params))
                break
            case 2:
                delete ctx.request.body.fields.inter_type
                await UserController["PUT /api/user/info"](ctx,next)
                break
            case 3:
                ctx.rest(await ManageService.deleteUser(params.uid))
                break
            case 4:
                delete params.token
                delete params.inter_type
                ctx.rest(await UserService.register(params,'',true))
                break
            default:
                throw '缺少type参数，或参数值不正确'
        }
    },
    'POST /api/manage/course': async (ctx, next) => {
        let token = ctx.request.body.fields.token || null
        let type = ctx.request.body.fields.type || null
        let params = ctx.request.body.fields
        if((await Util.getUserPower(token)).mCourse!=1){
            let returnModel = Util.getReturnModel()
            returnModel.result_code = '0'
            returnModel.result_desc = '没有管理权限'
            ctx.rest(returnModel)
            return;
        }
        switch (parseInt(type)) {
            case 1:
                ctx.rest(await ManageService.getCourseList(params))
                break
            case 2:
                delete ctx.request.body.fields.type
                await CourseController["PUT /api/course/info"](ctx,next)
                break
            case 3:
                ctx.rest(await ManageService.deleteCourse(params.course_id))
                break
            default:
                throw '缺少type参数，或参数值不正确'
        }
    },
    'POST /api/manage/check': async (ctx, next) => {
        let token = ctx.request.body.fields.token || null
        let type = ctx.request.body.fields.type || null
        let params = ctx.request.body.fields
        if((await Util.getUserPower(token)).mCheck!=1){
            let returnModel = Util.getReturnModel()
            returnModel.result_code = '0'
            returnModel.result_desc = '没有管理权限'
            ctx.rest(returnModel)
            return;
        }
        switch (parseInt(type)) {
            case 1:
                await CheckController.check(params.uid,params.check_time,params.check_location,params.course_id)
                break
            case 2:
                ctx.rest(await ManageService.modifyCheckInfo(params))
                break
            default:
                throw '缺少type参数，或参数值不正确'
        }
    },
    'POST /api/manage/student': async (ctx, next) => {
        let token = ctx.request.body.fields.token || null
        let type = ctx.request.body.fields.type || null
        let params = ctx.request.body.fields
        if((await Util.getUserPower(token)).mStudent!=1){
            let returnModel = Util.getReturnModel()
            returnModel.result_code = '0'
            returnModel.result_desc = '没有管理权限'
            ctx.rest(returnModel)
            return;
        }
        switch (parseInt(type)) {
            case 1:
                delete ctx.request.body.fields.type
                await CourseController["POST /api/course/stu2course"](ctx,next)
                break
            case 2:
                ctx.rest(await ManageService.modifyStudentInfo(params))
                break
            default:
                throw '缺少type参数，或参数值不正确'
        }
    },
}