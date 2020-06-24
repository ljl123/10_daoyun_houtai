const db = require('../db');

module.exports = db.sequelize.define('dicttype', {
    typeid: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    typenameChinese: { type: db.type.STRING(255), allowNull: false, comment: '中文' },
    typenameEnglish: { type: db.type.STRING(255), allowNull: false, comment: '英文' },
    description: { type: db.type.STRING(255), allowNull: false, comment: '描述' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '字典类型表',
        timestamps: false,
        freezeTableName:true
    });