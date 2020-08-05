const mysql = require("../models/db");
const Driver = require("../models/driver.model");
const DriverRunningStatus = require("../models/driverRunningStatus.model");
const { check, validationResult } = require("express-validator");
const { createHash } = require("../util/password");

//Creates a new Driver, Only for admin, Will be removed from this section after testing
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
  /* check("created_on")
    .isISO8601()
    .toDate()
    .withMessage("created_on must be a valid date"), */
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
      //created_on,
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

//Driver Home
exports.getDriverHome = async (req, res, next) => {
  try {
    const drivers = await Driver.findById(req.driver.id);
    // console.log(drivers);
    const driver = drivers[0];
    if (!driver) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Could not find the driver" }] });
    }

    //Sending data for driver home
    res.json(driver);
  } catch (err) {
    //Dont know how to handle this perticular error, as requirements for this perticular screen may vary, need to consult Prasad
    next(err);
  }
};

//Checkin the driver
exports.postCheckIn = [
  check("vehicleno")
    .exists()
    .withMessage("Check vehicles registeration number")
    .trim()
    .escape(),
  check("start_km")
    .isNumeric()
    .withMessage("Start kilometers must be a whole number")
    .trim()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const driverId = req.driver.id;

    try {
      //Check if already checkedin, if has checked-in, has started the day but has not ended
      const results = await DriverRunningStatus.findCheckedIn(driverId);
      console.log(
        "The results of the query received in controller " +
          JSON.stringify(results)
      );
      const alreadyStarted = results[0];
      //Throw error if already checked-in
      if (alreadyStarted) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Already checked in" }] });
      }
      //Create a new checkin time stamp
      res.json("Checking in");
    } catch (err) {
      console.error("Some error while checkin in " + err);
      next(err);
    }
  },
];

//Starts the day for the driver
exports.postStartDay = (req, res, next) => {
  res.json("I start the day here");
};

//End the day for the driver
exports.postEndDay = (req, res, next) => {
  res.json("I end the day here");
};
