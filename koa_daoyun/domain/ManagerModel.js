const common = require('./common');
module.exports = common.sequelize.define('manager', {
    id: { type: common.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    uid: { type: common.type.INTEGER(8), allowNull: false, comment: 'uid' },
    mUser: { type: common.type.INTEGER(8), allowNull: false, defaultValue: 0, comment: '管理用户表的权限' },
    mCourse: { type: common.type.INTEGER(8), allowNull: false, defaultValue: 0, comment: '课程表管理权限' },
    mCheck: { type: common.type.INTEGER(8), allowNull: false, defaultValue: 0, comment: '签到表管理权限' },
    mStudent: { type: common.type.INTEGER(8), allowNull: false, defaultValue: 0, comment: '学生表管理权限' },
    mDict: { type: common.type.INTEGER(8), allowNull: false, defaultValue: 0, comment: '数据字典管理权限' },
    mManage: { type: common.type.INTEGER(8), allowNull: false, defaultValue: 0, comment: '管理员权限表管理权限' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '管理权限表',
        timestamps: false,
        freezeTableName: true
    });