const Sequelize = require('sequelize');

const dbConfig = {
    database: 'test_sequelize',
    username: 'root',
    password: '123456',
    host: '127.0.0.1',
    dialect: 'mysql', // 'mysql'|'sqlite'|'postgres'|'mssql'
};

// console.log(config.database + config.username + config.password)

const common = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    // …Ë÷√ ±«¯
    timezone: '+08:00',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    
});

module.exports = common;