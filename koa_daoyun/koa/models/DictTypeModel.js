const db = require('../db');

module.exports = db.sequelize.define('dicttype', {
    typeid: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    typename: { type: db.type.STRING(255), allowNull: false, comment: '类型名称' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '字典类型表',
        timestamps: false,
        freezeTableName:true
    });