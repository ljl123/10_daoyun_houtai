const db = require('../db');

module.exports = db.sequelize.define('dictinfo', {
    id: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    typeid: { type: db.type.INTEGER(8), allowNull: false, comment: '类型id' },
    mvalue: { type: db.type.INTEGER(8), allowNull: false, comment: '值' },
    info: { type: db.type.STRING(255), allowNull: false, comment: '文本描述' },
    typestate: { type: db.type.INTEGER(1), allowNull: false, defaultValue: 0, comment: '默认' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '字典信息表',
        timestamps: false,
        freezeTableName:true
    });