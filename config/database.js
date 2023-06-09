const Sequelize = require("sequelize");
// const path = require('path');

const connection = require("./connection");

let database;

switch (process.env.NODE_ENV) {
  case "production":
    database = new Sequelize(
      connection.production.database,
      connection.production.username,
      connection.production.password,
      {
        host: connection.production.host,
        dialect: connection.production.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      }
    );
    break;
  case "local":
    database = new Sequelize(
      connection.local.database,
      connection.local.username,
      connection.local.password,
      {
        host: connection.local.host,
        dialect: connection.local.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      }
    );
    break;
  case "test":
    database = new Sequelize(
      connection.test.database,
      connection.test.username,
      connection.test.password,
      {
        host: connection.test.host,
        dialect: connection.test.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      }
    );
    break;
  default:
    database = new Sequelize(
      connection.development.database,
      connection.development.username,
      connection.development.password,
      {
        host: connection.development.host,
        dialect: connection.development.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        // storage: path.join(process.cwd(), 'db', 'database.sqlite'),
      }
    );
}

module.exports = database;
