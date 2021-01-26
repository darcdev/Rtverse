"use strict";

const { DataTypes } = require("sequelize");

module.exports = function setupAgentModel(sequelize) {
  return sequelize.define("agent", {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hostname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    connected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
