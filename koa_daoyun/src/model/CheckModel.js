const common = require('./common');

module.exports = common.sequelize.define('checks', {
    id: { type: common.type.INTEGER(8), primaryKey: true, allowNull: false, autoIncrement: true },
    user_id: { type: common.type.INTEGER(8), allowNull: false, comment: '学生id' },
    course_id: { type: common.type.INTEGER(8), allowNull: false,defaultValue: '', comment: '课程id' },
    count: { type: common.type.INTEGER(8), allowNull: false, comment: '第几次签到' },
    check_state: { type: common.type.INTEGER(1), allowNull: false,defaultValue: '', comment: '签到状态' },
    time: { type: common.type.BIGINT(15), allowNull: false,defaultValue: '', comment: '签到时间ms' },
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '签到表',
        timestamps: false
    });