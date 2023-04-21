const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const hooks = {};

const tableName = "Account";

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isInt: true,
        min: 8,
      },
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
      },
    },
    createAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updateAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
  { hooks, tableName }
);

// eslint-disable-next-line
Account.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Account;
