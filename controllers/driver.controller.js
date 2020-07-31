const mysql = require("../models/db");
const Driver = require("../models/driver.model");
const { check, validationResult } = require("express-validator");

exports.getOne = (req, res, next) => {
  res.json("Sending one");
};

exports.create = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Name must be minimum 3 characters long")
    .trim()
    .escape(),
  check("email_id")
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters long")
    .trim()
    .escape(),
  check("license")
    .exists()
    .withMessage("Please provide the license number")
    .trim()
    .escape(),
  check("address")
    .isLength({ min: 6 })
    .withMessage("Address must be minimum 6 characters long")
    .trim()
    .escape(),
  check("pincode")
    .isLength({ min: 5 })
    .withMessage("Pincode must be minimum 5 characters long")
    .isNumeric()
    .withMessage("Enter a valid pincode")
    .trim()
    .escape(),
  check("city")
    .isLength({ min: 3 })
    .withMessage("City must be minimum 3 characters long")
    .trim()
    .escape(),
  check("created_on")
    .isISO8601()
    .toDate()
    .withMessage("created_on must be a valid date"),
  /*  check("status").custom((value) => {
    const DRIVER_STATUS = ["active", "inactive", "deleted"];
    if (DRIVER_STATUS.indexOf(value.toLowerCase()) === -1) {
      return Promise.reject(
        "Drivers status must be one of Active, Inactive or Deleted"
      );
      Promise.resolve();
    }
  }), */
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    const {
      name,
      email_id,
      mobile,
      password,
      license,
      regno,
      address,
      pincode,
      city,
      created_on,
      status,
    } = req.body;
    const driver = {
      name,
      email_id,
      mobile,
      password,
      license,
      status,
      created_on,
    };

    //Optional parameters
    if (regno) driver.regno = regno;
    if (address) driver.address = address;
    if (pincode) driver.pincode = pincode;
    if (city) driver.city = city;

    console.log("Created object " + driver);
    Driver.create(driver)
      .then((result) => {
        console.log(result);
        return res.json(result);
      })
      .catch((err) => {
        console.log("Error " + err);
        res.status(400).status(err.msg);
      });
  },
];
