"use strict";

const express = require("express");
const axios = require("axios");
const {endpoint ,  apiToken} = require('./config')

const api = express.Router();
api.get("/agents", (req, res) => {
    const options = {
        method : 'GET',
        url : `${endpoint}/api/agents`,
        headers : {
            'Authorization' : `Bearer ${apiToken}`
        }
    }
    let result;
    try {
        result = await axios(options);
        res.send(result);
    } catch (error) {
        
    }
});

api.get("/agents/:uuid", (req, res) => {});

api.get("/agents/metrics/:uuid", (req, res) => {});

api.get("/agents/:uuid/:type", (req, res) => {});

module.exports = api;
