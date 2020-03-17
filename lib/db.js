const knex = require('knex');
const config = require('../db/knexfile');

module.exports = knex(config[process.env.NODE_ENV]);
