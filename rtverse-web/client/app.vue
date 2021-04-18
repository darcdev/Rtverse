<template>
  <div>
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid"
      :socket="socket"
    ></agent>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<style>
body {
  font-family: Arial;
  background: #f8f8f8;
  margin: 0;
}
</style>

<script>
const io = require("socket.io-client");
const axios = require("axios");
const { serverHost } = require("../config");

const socket = io();
module.exports = {
  data() {
    return {
      agents: [],
      error: null,
      socket,
    };
  },

  mounted() {
    this.initialize();
  },

  methods: {
    async initialize() {
      const options = {
        method: "GET",
        url: `${serverHost}/agents`,
      };

      let result;
      try {
        result = (await axios(options)).data;
        console.log(result);
      } catch (e) {
        this.error = e.error.error;
      }

      this.agents = result;

      socket.on("agent/connected", (payload) => {
        const { uuid } = payload.agent;
        const existing = this.agents.find((a) => a.uuid === uuid);
        if (!existing) {
          this.agents.unshift(payload.agent);
        }
      });
    },
  },
};
</script>
