const LogUtil = require('../log/log-util')
const Util = require('../utils/utils')

const User = require('../models/UserModel')
const Menu = require('../models/MenuModel')


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
    'POST /api/menu/create_menu': async (ctx, next) => { //创建菜单
        let returnModel = getReturnModel();
        let info = {}
        let token = ctx.request.body.fields.token || null
        info.name = ctx.request.body.fields.name || null
        info.link = ctx.request.body.fields.link || null
        info.sort = ctx.request.body.fields.sort || null
        let pre_name = ctx.request.body.fields.pre_name || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await createName(info, pre_name)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '创建成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '创建失败'
        }
        ctx.rest(returnModel)
    },
    'GET /api/menu/infos': async (ctx, next) => { //获取顶层菜单下的所有菜单
        let returnModel = getReturnModel();
        let token = ctx.request.query.token || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        let list = await getInfos()//只获取顶层菜单下的所有菜单
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
    'GET /api/menu/infos4name': async (ctx, next) => { //根据菜单名称查找该菜单下的所有菜单目录
        let returnModel = getReturnModel();
        let name = ctx.request.query.name || null //按照typenameChinese 去找typeid  然后根据typeid去找从表内容
        let list = await getInfos4name(name)
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
    'DELETE /api/menu/del_menu': async (ctx, next) => {
        let returnModel = getReturnModel();
        let token = ctx.request.body.fields.token || null
        let id = ctx.request.body.fields.id || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await deleteMenu(id)) {
            returnModel.result_code = '200'
            returnModel.result_desc = '删除成功'
        } else {
            returnModel.result_code = '206'
            returnModel.result_desc = '删除失败'
        }
        ctx.rest(returnModel)
    },
    'PUT /api/menu/modify_menu': async (ctx, next) => {//根据id来修改  名称 上级id 路由
        let returnModel = getReturnModel();
        let info = {}
        let token = ctx.request.body.fields.token || null
        info.id = ctx.request.body.fields.id || null
        info.name = ctx.request.body.fields.name || null
        info.link = ctx.request.body.fields.link || null
        info.sort = ctx.request.body.fields.sort || null
        let pre_name = ctx.request.body.fields.pre_name || null
        let user_type = await getUserPermissionFromToken(token)
        if (Number(user_type) != 1) {
            returnModel.result_code = '206'
            returnModel.result_desc = '没有权限操作'
            ctx.rest(returnModel)
            return;
        }
        if (await modifyInfo(info, pre_name)) {
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
 * 创建菜单
 * @param {*} info 菜单字段信息
 * @param {*} pre_name 上一级菜单名称
 */
var createName = async (info, pre_name) => {
    //查询上一级菜单的名字 并返回上一级的id 作为当前pre_id
    let pre_id = await Menu.findOne({ where: { name: pre_name }, raw: true })
        .then(res => res ? res.id : null)//返回
        .catch(err => { LogUtil.error(err); return null; })
    if (!pre_id) return false
    info.previous_id = pre_id
    return await Menu.create(info)
        .then(res => res ? true : false)
        .catch(err => { LogUtil.error(err); return false; })
}


/**
 * 获取顶层菜单下的所有菜单信息
 */
var getInfos = async () =>
    await Menu.findAll({ 
        where: {
            previous_id: 1, 
            id : {$ne:1}},
        raw: true 
    })
        .then(res => res ? res : null)
        .catch(err => { LogUtil.error(err); return false })

/**
 * 删除上一级菜单
 * @param {*} id 
 */
var deleteMenu = async (id) =>{
    if(id == 1) return false; //顶层菜单不能删除
    await Menu.destroy({ where: { id: id } })
        .then(res => res ? true : false)
        .catch(err => { LogUtil.error(err); return false })
    }   

/**
 * 修改菜单信息
 * @param {*} info 
 * @param {*} pre_name 
 */
var modifyInfo = async (info, pre_name) =>{
    //查询上一级菜单的名字 并返回上一级的id 作为当前pre_id
    let pre_id = await Menu.findOne({ where: { name: pre_name }, raw: true })
        .then(res => res ? res.id : null)//返回
        .catch(err => { LogUtil.error(err); return null; })
    if (!pre_id) return false
    info.previous_id = pre_id
    await Menu.update(info,
        { where: { id: info.id } })
        .then(res => res == 1 ? true : false)
        .catch(err => { LogUtil.error(err); return false; })
    }
/**
 * 通过上级菜单名称获取该该菜单下的所有信息
 * @param {*} name 
 */
var getInfos4name = async (name) => {
    let pre_id = await Menu.findOne({ where: { name: name }, raw: true })
        .then(res => res ? res.id : null)
        .catch(err => { LogUtil.error(err); return null; })
    if (!pre_id) return []
    return await Menu.findAll({ 
        where: { 
            previous_id: pre_id,
            id : {$ne:1}},
        raw: true 
    })
        .then(res => res ? res : [])
        .catch(err => { LogUtil.error(err); return []; })
    }


