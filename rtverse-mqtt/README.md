# rtverse mqtt

## `agent/connected`

```js
{
  agent: {
    uuid, // autogenerated
    username // define by config,
    name //define by config,
    hostname // get by s.o,
    pid //get by process
    };
  }
}
```

## `agent/disconnected`

```js
{
  agent: {
    uuid,
    };
  }
}
```

## `agent/message`

```js
{
    agent,
    metric : [{
        type,
        value
    }],
    timestamp // generate when message is created
}
```
