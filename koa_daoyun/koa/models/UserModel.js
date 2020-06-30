const db = require('../db');

module.exports = db.sequelize.define('users', {
    uid: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    email: { type: db.type.STRING(255), allowNull: false, comment: '邮箱', unique: 'email' },
    password: { type: db.type.STRING(255), allowNull: false, comment: '密码' },
    type: { type: db.type.INTEGER(1), allowNull: false, comment: '用户类型' },
    name: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '姓名' },
    nick_name: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '昵称' },
    gender: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '性别' },
    phone: { type: db.type.STRING(11), allowNull: false, defaultValue: '', comment: '手机号'},
    stu_code: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '学号' },
    school: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '学校' },
    department: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '学院' },
    profession: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '专业' },
    last_login_time: { type: db.type.BIGINT(15), allowNull: false, defaultValue: 0, comment: '上次登录时间' },
    reg_time: { type: db.type.BIGINT(15), allowNull: false, defaultValue: 0, comment: '注册时间' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '用户表',
        timestamps: false
    });