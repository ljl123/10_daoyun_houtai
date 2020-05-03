const db = require('../db');

module.exports = db.sequelize.define('dictinfo', {
    id: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    typeid: { type: db.type.INTEGER(8), allowNull: false, comment: '类型id' },
    type_level: { type: db.type.INTEGER(3), allowNull: false, comment: '在大类中的级别' },
    type_belong: { type: db.type.INTEGER(3), allowNull: false, comment: '在大类中 又是谁的子类 1为最高level' },
    info: { type: db.type.STRING(255), allowNull: false, comment: '字典内容' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '字典信息表',
        timestamps: false,
        freezeTableName:true
    });