"use strict";
module.exports = {
  endpoint: process.env.API_ENDPOINT || "http://localhost:3000",
  serverHost: process.env.SERVER_HOST || "http://localhost:8080",
  apiToken:
    process.env.API_TOKEN ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBsYXR6aSIsImFkbWluIjoidHJ1ZSIsInBlcm1pc3Npb25zIjpbIm1ldHJpY3M6cmVhZCJdLCJpYXQiOjE2MTIyMDE1MDN9.DtaSDp4ywgVkj7YnvI3OQLy8yCgK6tQkH7ost5ch_zc",
};
