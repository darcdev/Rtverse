"use strict";

const express = require("express");
const axios = require("axios");
const { endpoint, apiToken } = require("./config");

const api = express.Router();

api.get("/agents", async (req, res) => {
  const options = {
    method: "get",
    url: `${endpoint}/api/agents/`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  };
  let result;
  try {
    result = await axios(options);
    res.send(result.data);
  } catch (error) {
    console.log(error);
  }
});

api.get("/agent/:uuid", async (req, res) => {
  const options = {
    method: "GET",
    url: `${endpoint}/api/agent/${req.params.uuid}`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  };
  let result;
  try {
    result = await axios(options);
    res.send(result.data);
  } catch (error) {
    console.log(error);
  }
});

api.get("/metrics/:uuid", async (req, res) => {
  const options = {
    method: "GET",
    url: `${endpoint}/api/metrics/${req.params.uuid}`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  };
  let result;
  try {
    result = await axios(options);
    res.send(result.data);
  } catch (error) {
    console.log(error);
  }
});

api.get("/metrics/:uuid/:type", async (req, res) => {
  console.log("llegue");
  const options = {
    method: "get",
    url: `${endpoint}/api/metrics/${req.params.uuid}/${req.params.type}`,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  };
  let result;
  try {
    result = await axios(options);
    res.send(result.data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = api;
