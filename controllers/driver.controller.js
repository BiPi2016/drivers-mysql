const mysql = require("../models/db");
const Driver = require("../models/driver.model");

exports.getOne = (req, res, next) => {
  res.json("Sending one");
};

exports.create = (req, res, next) => {
  const { name, email, mobile } = req.body;
  const driver = { name, email, mobile };
  Driver.create(driver, (err, data) => {
    if (err) {
      return res.status(400).json("Error occured");
    }
    return res.json("Driver created" + driver);
  });
};
