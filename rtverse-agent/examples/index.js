const RtverseAgent = require("../");

const agent = new RtverseAgent({
  name: "myapp",
  username: "admin",
  interval: 2000,
});

agent.addMetric("rss", function getRss() {
  return process.memoryUsage().rss;
});

agent.addMetric("promiseMetric", function getRandomPromise() {
  return Promise.resolve(Math.random());
});

agent.addMetric("callbackMetric", function getRandomCallbakc(callback) {
  setTimeout(() => {
    callback(null, Math.random());
  }, 1000);
});

agent.connect();

const handler = (payload) => {
  console.log(payload);
};

agent.on("connected", handler);
agent.on("disconnected", handler);
agent.on("message", handler);

agent.on("agent/connected", handler);
agent.on("agent/disconnected", handler);
agent.on("agent/message", (payload) => {
  console.log(payload);
});

// setTimeout(() => agent.disconnect(), 10000);
