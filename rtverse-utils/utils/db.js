const debug = require("debug")("rtverse:utils:setupDB");

module.exports = function setConfigDB(extraConfig) {
  const config = {
    database: process.env.DB_NAME || "rtverse",
    username: process.env.DB_USER || "darcdev",
    password: process.env.DB_PASS || "diego",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: (s) => debug(s),
    ...extraConfig,
  };
  return config;
};
