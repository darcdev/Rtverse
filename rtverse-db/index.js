"use strict";

if (process.env.NODE_ENV !== "production") require("longjohn");

const setupDatabase = require("./lib/db");
const setupAgentModel = require("./models/agent");
const setupMetricModel = require("./models/metric");

const setupAgent = require("./lib/agent");
const setupMetric = require("./lib/metric");

const defaults = require("defaults");

module.exports = async function (config) {
  config = defaults(config, {
    dialect: "sqlite",
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
    query: {
      raw: true,
    },
  });
  // sequelize instance
  const sequelize = setupDatabase(config);

  //Models
  const AgentModel = setupAgentModel(sequelize);
  const MetricModel = setupMetricModel(sequelize);

  // entities relationship
  AgentModel.hasMany(MetricModel);
  MetricModel.belongsTo(AgentModel);

  await sequelize.authenticate();

  if (config.setup) {
    await sequelize.sync({ force: true });
  }

  const Agent = setupAgent(AgentModel);
  const Metric = setupMetric(MetricModel, AgentModel);

  return {
    Agent,
    Metric,
  };
};
