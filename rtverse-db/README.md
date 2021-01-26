# RTVERSE DB

## Usage

```js
const setupDatabase = require("rtverse-db");

setupDatabase(config)
  .then((db) => {
    const { Agent, Metric } = db;
  })
  .catch((err) => console.error(err));
```
