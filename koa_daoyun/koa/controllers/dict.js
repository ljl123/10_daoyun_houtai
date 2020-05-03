const LogUtil = require('../log/log-util')
const Util = require('../utils/utils')

const User = require('../models/UserModel')
const DictType = require('../models/DictTypeModel')
const DictInfo = require('../models/DictInfoModel')

const config = require('../config/config-override')
const HOST_IP = config.remote ? config.imghost : config.imghost_default

/**
 * 获取返回模板
 */
var getReturnModel = Util.getReturnModel

/**
 * 获取用户权限
 * @param {*} token 
 */
var getUserPermissionFromToken = async (token) =>
    await User.findOne({
        attributes: ['type'],
        where: { uid: Util.getUidFromToken(token) },
        raw: true
    }).then(res => res ? res.type : null).catch(err => { LogUtil.error(err); throw err })


module.exports = {
    'POST /api/dict/create_type': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let typename = ctx.request.body.fields.typename || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await createType(typename)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '创建成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '创建失败'
        }
        ctx.rest(returnModel)
    },
    'POST /api/dict/create_info': async (ctx, next) => {
        let returnModel = getReturnModel();
        let info = {}
        let token = ctx.request.body.fields.token || null
        info.typeid = ctx.request.body.fields.typeid || null
        info.type_level = ctx.request.body.fields.type_level || null
        info.type_belong = ctx.request.body.fields.type_belong || null
        info.info = ctx.request.body.fields.info || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await createInfo(info)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '创建成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '创建失败'
        }
        ctx.rest(returnModel)
    },
    'GET /api/dict/types': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.query.token || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        let list = await getTypes()
        if (list) {
            returnModel.data = list
            returnModel.result_code = '200'
            returnModel.result_desc = '获取成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '获取失败'
        }
        ctx.rest(returnModel)
    },
    'GET /api/dict/infos': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.query.token || null
        let typeid = ctx.request.query.typeid || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        let list = await getInfos(typeid)
        if (list) {
            returnModel.data = list
            returnModel.result_code = '200'
            returnModel.result_desc = '获取成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '获取失败'
        }
        ctx.rest(returnModel)
    },
    'GET /api/dict/infos4name': async (ctx, next) => {
        let returnModel = getReturnModel();
        let typename = ctx.request.query.typename || null
        let list = await getInfos4name(typename)
        if (list) {
            returnModel.data = list
            returnModel.result_code = '200'
            returnModel.result_desc = '获取成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '获取失败'
        }
        ctx.rest(returnModel)
    },
    'DELETE /api/dict/type': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let typeid = ctx.request.body.fields.typeid || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await deleteType(typeid)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '删除成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '删除失败'
        }
        ctx.rest(returnModel)
    },
    'DELETE /api/dict/info': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let infoid = ctx.request.body.fields.infoid || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await deleteInfo(infoid)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '删除成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '删除失败'
        }
        ctx.rest(returnModel)
    },
    'PUT /api/dict/type': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let typename = ctx.request.body.fields.typename || null
        let typeid = ctx.request.body.fields.typeid || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await modifyType(typeid, typename)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '修改成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '修改失败'
        }
        ctx.rest(returnModel)
    },
    'PUT /api/dict/info': async (ctx, next) => {
        let returnModel = getReturnModel();
        let info = {}
        let token = ctx.request.body.fields.token || null
        info.type_level = ctx.request.body.fields.type_level || null
        let id = ctx.request.body.fields.infoid || null
        info.type_belong = ctx.request.body.fields.type_belong || null
        info.info = ctx.request.body.fields.info || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await modifyInfo(id, info)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '修改成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '修改失败'
        }
        ctx.rest(returnModel)
    },
}

/**
 * 创建新类型
 * @param {*} typename 类型名称
 */
var createType = async (typename) => {
    return await DictType.create({ typename: typename })
        .then(res => res ? true : false)
        .catch(err => { LogUtil.error(err); return false; })
}

/**
 * 创建字典信息
 * @param {*} info 包含具体信息
 */
var createInfo = async (info) => {
    return await DictInfo.create(info)
        .then(res => res ? true : false)
        .catch(err => { LogUtil.error(err); return false; })
}

/**
 * 获取所有字典类
 */
var getTypes = async () =>
    await DictType.findAll({ raw: true })
        .then(res => res ? res : null)
        .catch(err => { LogUtil.error(err); return false })

/**
 * 获取所有具体大类别下的类别信息
 * @param {*} typeid 大类id
 */
var getInfos = async (typeid) =>
    await DictInfo.findAll({
        where: { typeid: typeid },
        raw: true
    })
        .then(res => res ? res : null)
        .catch(err => { LogUtil.error(err); return null; })

/**
 * 删除大类
 * @param {*} typeid 
 */
var deleteType = async (typeid) =>
    await DictType.destroy({ where: { typeid: typeid } })
        .then(res => res ? true : false)
        .catch(err => { LogUtil.error(err); return false })

/**
 * 删除具体类别信息
 * @param {*} infoid 
 */
var deleteInfo = async (infoid) =>
    await DictInfo.destroy({ where: { id: infoid } })
        .then(res => res == 1 ? true : false)
        .catch(err => { LogUtil.error(err); return false; })

/**
 * 修改大类名称
 * @param {*} typeid 
 * @param {*} typename 
 */
var modifyType = async (typeid, typename) =>
    await DictType.update({ typename: typename },
        { where: { typeid: typeid } })
        .then(res => res == 1 ? true : false)
        .catch(err => { LogUtil.error(err); return false; })

/**
 * 删除具体类别信息
 * @param {*} id id
 * @param {*} info 具体信息 除id和typeid外
 */
var modifyInfo = async (id, info) =>
    await DictInfo.update(info, { where: { id: id } })
        .then(res => res == 1 ? true : false)
        .catch(err => { LogUtil.error(err); return false; })

/**
 * 通过typename获取字典内容
 * @param {*} typename 
 */
var getInfos4name = async (typename) => {
    let typeid = await DictType.findOne({ where: { typename: typename }, raw: true })
        .then(res => res ? res.typeid : null)
        .catch(err => { LogUtil.error(err); return null; })
    if (!typeid) return []
    return await DictInfo.findAll({ where: { typeid: typeid }, raw: true })
        .then(res => res ? res : [])
        .catch(err => { LogUtil.error(err); return []; })
}