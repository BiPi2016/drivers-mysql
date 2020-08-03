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
  /* check("status").custom((value) => {
    const DRIVER_STATUS = ["active", "inactive", "deleted"];
    console.log(DRIVER_STATUS.indexOf(value));
    if (DRIVER_STATUS.indexOf(value.toLowerCase()) === -1) {
      throw new Error(
        "Drivers status must be one of Active, Inactive or Deleted"
      );
    }
    return true;
  }), */
  (req, res, next) => {
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
    // Using Callback
    /* Driver.create(driver, (err, driver) => {
      if (err) {
        console.log("Error recieved from SQL");
        return res.status(400).json({ errors: [{ msg: err }] });
      }
      console.log("Results received from SQL");
      return res.json(driver);
    }); */

    //Using Promise
    Driver.create(driver)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(400).json({ errors: [{ msg: err }] });
      });
  },
];
