const mysql = require("mysql");
const dbConfig = require("../config/config.db");
const { host, database, user, password } = dbConfig;

const connection = mysql.createConnection({
  host: host, //"localhost",
  database: database, //"dirvers-mysql",
  user: user, //"root",
  password: password, //"BiPi2020",
});

/* connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
}); */

module.exports = connection;
