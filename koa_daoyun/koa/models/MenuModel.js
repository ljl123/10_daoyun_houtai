const db = require('../db');

module.exports = db.sequelize.define('menu_authority', {
    id: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    previous_id: { type: db.type.INTEGER(8), allowNull: false, comment: '上级菜单目录' },
    name: { type: db.type.STRING(255), allowNull: false, comment: '菜单名称' },
    is_show: { type: db.type.STRING(255), allowNull: false,defaultValue: '是', comment: '是否展示' },
    link: { type: db.type.STRING(255), allowNull: false, comment: '路由信息' },
    sort: { type: db.type.INTEGER(8), allowNull: false ,comment: '排列序号' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '菜单管理',
        timestamps: false,
        freezeTableName:true
    });
