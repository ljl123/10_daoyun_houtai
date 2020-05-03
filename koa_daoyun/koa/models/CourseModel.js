const db = require('../db');

module.exports = db.sequelize.define('courses', {
    course_id: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    course_name: { type: db.type.STRING(255), allowNull: false, comment: '课程信息' },
    course_code: { type: db.type.STRING(255), allowNull: false, comment: '课程代码' },
    place: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '上课地点' },
    location: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '地点位置 gps信息 11.1,12.1' },
    time: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '上课时间' },
    stu_count: { type: db.type.INTEGER(5), allowNull: false, defaultValue: '', comment: '学生人数' },
    teacher: { type: db.type.STRING(255), allowNull: false, defaultValue: '', comment: '老师' },
    creater_uid: { type: db.type.INTEGER(8), allowNull: false, defaultValue: '', comment: '课程创建者uid' },
    check_count: { type: db.type.INTEGER(8), allowNull: false, defaultValue: 0, comment: '签到次数' },
    start_time: { type: db.type.BIGINT(15), allowNull: false, defaultValue: '0', comment: '签到开始时间' },
    end_time: { type: db.type.BIGINT(15), allowNull: false, defaultValue: '0', comment: '签到结束时间' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '课程表',
        timestamps: false
    });