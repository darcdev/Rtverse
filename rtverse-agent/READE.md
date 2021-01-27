# Rtverse Agent

## Usage

```js
const RtverseAgent = require("rtverse-agent");
const agent = new RtverseAgent({
    interval : 2000
});

agent.connect();

agent.on('connected')
agent.on('disconnected')
agent.on('message');

agent.on('agent/connected');
agent.on('agent/disconnected')
agent.on("agent/message", (payload) => {
  console.log(payload);
});


setTimeout(() = agent.disconnect() , 20000)

```
