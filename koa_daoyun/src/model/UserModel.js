const common = require('./common');

module.exports = common.sequelize.define('users', {
    id: { type: common.type.INTEGER(8), primaryKey: true, allowNull: false },
    role_id: { type: common.type.INTEGER(8), allowNull: false },
    course_id: { type: common.type.INTEGER(8), allowNull: false },
    name: { type: common.type.STRING(255), allowNull: false, defaultValue: '', comment: '姓名' },
    phone: { type: common.type.STRING(11), allowNull: false, defaultValue: '', comment: '手机号'},
    email: { type: common.type.STRING(255), allowNull: false, comment: '邮箱', unique: 'email' },
    password: { type: common.type.STRING(255), allowNull: false, comment: '密码' },
    school: { type: common.type.STRING(255), allowNull: false, defaultValue: '', comment: '学校' },
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '用户表',
        timestamps: false
    });