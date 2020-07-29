const mysql = require("../models/db");
const Driver = require("../models/driver.model");

exports.getOne = (req, res, next) => {
  res.json("Sending one");
};

exports.create = (req, res, next) => {
  const { name, email, mobile } = req.body;
  const driver = { name, email, mobile };
  Driver.create(driver)
    .then((result) => {
      console.log(result);
      return res.json(result);
    })
    .catch((err) => {
      console.log("Error " + err);
      res.status(400).status(err.msg);
    });
};
