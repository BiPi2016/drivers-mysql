const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./routes/auth.routes");
const driverRouter = require("./routes/driver.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors
const corsOptions = {
  origin: process.env.FRONT_END,
};
app.use(cors(corsOptions));

//Log requests
app.use(morgan("combined"));

//Routers
app.use("/auth", authRouter);
app.use("/driver", driverRouter);

//Error handlers
app.use((req, res, next) => {
  const error = new Error("Requested resource not found");
  error.status = 400;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ errors: [{ msg: err.message }] });
});

module.exports = app;
