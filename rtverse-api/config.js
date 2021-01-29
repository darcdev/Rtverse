module.exports = {
  auth: {
    secret: process.env.SECRET || "rtverse",
    algorithms: ["HS256"],
  },
};
