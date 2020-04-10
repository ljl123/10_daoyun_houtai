const common = require('./common');

module.exports = common.sequelize.define('menu_authority', {
    id: { type: common.type.INTEGER(8), primaryKey: true, allowNull: false},
    name: { type: common.type.STRING(255), allowNull: false, defaultValue: ''},
}, {
        engine: 'InnoDB',
        charset: 'utf-8',
        autoIncrement: 8,
        comment: '菜单权限表',
        timestamps: false,
        freezeTableName: true
    });