const http = require("http");
const app = require("./app");
const db = require("./models/db");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to DB");
  server.listen(port, () => console.log("Server listening on port " + port));
});
