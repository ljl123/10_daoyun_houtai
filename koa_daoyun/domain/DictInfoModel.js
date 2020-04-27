const common = require('./common');

module.exports = common.sequelize.define('dictinfo', {
    id: { type: common.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    typeid: { type: common.type.INTEGER(8), allowNull: false, comment: '类型id' },
    type_level: { type: common.type.INTEGER(3), allowNull: false, comment: '在大类中的级别' },
    type_belong: { type: common.type.INTEGER(3), allowNull: false, comment: '在大类中 又是谁的子类 1为最高level' },
    info: { type: common.type.STRING(255), allowNull: false, comment: '字典内容' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '字典信息表',
        timestamps: false,
        freezeTableName:true
    });