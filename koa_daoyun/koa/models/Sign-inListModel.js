const db = require('../db');

module.exports = db.sequelize.define('checks', {
    id: { type: db.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    uid: { type: db.type.INTEGER(8), allowNull: false, comment: '学生id' },
    course_id: { type: db.type.INTEGER(8), allowNull: false,defaultValue: '', comment: '课程id' },
    count: { type: db.type.INTEGER(8), allowNull: false, comment: '第几次签到' },
    check_state: { type: db.type.INTEGER(1), allowNull: false,defaultValue: '', comment: '签到状态' },
    check_time: { type: db.type.BIGINT(15), allowNull: false,defaultValue: '', comment: '签到时间' },
    check_location: { type: db.type.STRING(255), allowNull: false,defaultValue: '', comment: '签到地点信息' },
    remarks: { type: db.type.STRING(255), allowNull: true, comment: '备注' },
    distance: { type: db.type.INTEGER(6), allowNull: false, defaultValue: 999999,comment: '距离' }
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '签到表',
        timestamps: false
    });