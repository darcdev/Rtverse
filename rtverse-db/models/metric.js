"use strict";

const { DataTypes } = require("sequelize");

module.exports = function setupMetricModel(sequelize) {
  return sequelize.define("metric", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};
