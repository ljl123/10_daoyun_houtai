const LogUtil = require('../log/log-util')
const Util = require('../utils/utils')

const User = require('../models/UserModel')
const systemInfo = require('../models/SystemModel')

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
    'POST /api/system/infos': async (ctx, next) => {
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
    'PUT /api/system/info': async (ctx, next) => {
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
 * @param {*} typeid 
 */
var getInfos = async (typeid) =>
    await systemInfo.findAll({
        where: { id: typeid },
        raw: true
    })
        .then(res => res ? res : null)
        .catch(err => { LogUtil.error(err); return null; })

/**
 * 删除具体类别信息
 * @param {*} id id
 * @param {*} info 具体信息 除id和typeid外
 */
var modifyInfo = async (id, info) =>
    // await systemInfo.update(info, { where: { uid: id } })
    await systemInfo.update( info.info, { where: { uid: id } })
        .then(res => res == 1 ? true : false)
        .catch(err => { LogUtil.error(err); return false; })