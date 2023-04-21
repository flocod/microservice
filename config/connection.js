const commonConfig = {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: true,
  username: "root",
  password: "",
};

const local = Object.assign(commonConfig, {
  username: "root",
  password: "",
  database: "banque",
});

const development = {
  ...commonConfig,
  database: "banque_dev",
};

const testing = {
  ...commonConfig,
  database: "banque_test",
};

const production = {
  ...commonConfig,
  database: "banque_prod",
};

module.exports = {
  development,
  testing,
  production,
  local,
};
