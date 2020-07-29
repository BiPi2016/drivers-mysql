require("dotenv").config();

db = {
  dev: {
    user: process.env.NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
  },
  test: {},
  production: {},
};

module.exports = db[process.env.NODE_ENV];
