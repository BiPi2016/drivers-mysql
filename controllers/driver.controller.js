const mysql = require("../models/db");
const Driver = require("../models/driver.model");
const { check, validationResult } = require("express-validator");
const { createHash } = require("../util/password");

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
  check("mobile")
    .isLength({ min: 10, max: 15 })
    .withMessage("Check mobile number")
    .trim()
    .escape(),
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
  check("status").custom((value) => {
    const DRIVER_STATUS = ["active", "inactive", "deleted"];
    console.log(DRIVER_STATUS.indexOf(value));
    if (DRIVER_STATUS.indexOf(value.toLowerCase()) === -1) {
      throw new Error(
        "Drivers status must be one of Active, Inactive or Deleted"
      );
    }
    return true;
  }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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

    //Creating new driver object
    const newDriver = {
      name,
      email_id,
      mobile,
      password,
      license,
      status,
      created_on,
    };

    //Optional parameters
    if (regno) newDriver.regno = regno;
    if (address) newDriver.address = address;
    if (pincode) newDriver.pincode = pincode;
    if (city) newDriver.city = city;

    console.log("Created object " + newDriver);

    //Using async await
    try {
      newDriver.password = await createHash(newDriver.password);
      const driver = await Driver.create(newDriver);
      res.status(201).json(driver);
    } catch (err) {
      res.status(400).json({ errors: [{ msg: err }] });
    }
  },
];

exports.getDriverHome = async (req, res, next) => {
  return res.json("driver home");
};
