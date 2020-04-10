const Sequelize = require('sequelize');
const LogUtil = require('./log-util')
const config = require('./config');

LogUtil.info('init sequelize...');

// console.log(config.database + config.username + config.password)

var db = {
    sequelize: new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }),
    type: Sequelize
}


module.exports = db;