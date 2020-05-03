const db = require('../db');

module.exports = db.sequelize.define('students', {
    id: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    uid: { type: db.type.INTEGER(8), allowNull: false,defaultValue: '',comment:'学生id'},
    course_id: { type: db.type.INTEGER(8), allowNull: false,defaultValue: '', comment: '课程id'},
    check_count: { type: db.type.INTEGER(8), allowNull: false,defaultValue: 0, comment: '签到次数' },
    lack_count: { type: db.type.INTEGER(8), allowNull: false,defaultValue: 0, comment: '缺勤次数' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '学生表',
        timestamps: false
    });