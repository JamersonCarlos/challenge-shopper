const Sequelize = require('sequelize');
const configDatabase = require('./database');

const sequelize = new Sequelize(configDatabase);
export { sequelize };