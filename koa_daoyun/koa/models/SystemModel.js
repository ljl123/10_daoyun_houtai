const db = require('../db');

module.exports = db.sequelize.define('systemenv', {
    id: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    uid: { type: db.type.INTEGER(8), allowNull: false,defaultValue: '',comment:'sys_id'},
    experience: { type: db.type.INTEGER(8), allowNull: false, defaultValue: 3, comment: '签到一次几点经验值' },
    distance: { type: db.type.INTEGER(6), allowNull: false, defaultValue: 1000,comment: '允许签到距离' },
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '系统配置表',
        timestamps: false
    });
