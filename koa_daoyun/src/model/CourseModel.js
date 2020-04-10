const common = require('./common');

module.exports = common.sequelize.define('courses', {
    course_id: { type: common.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    course_name: { type: common.type.STRING(255), allowNull: false, comment: '课程信息' },
    course_code: { type: common.type.STRING(255), allowNull: false, comment: '课程代码' },
    place: { type: common.type.STRING(255), allowNull: false, defaultValue: '', comment: '上课地点' },
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '课程表',
        timestamps: false
    });