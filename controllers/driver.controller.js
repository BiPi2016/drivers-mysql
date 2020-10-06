const mysql = require("../models/db");
const Driver = require("../models/driver.model");
const DriverRunningStatus = require("../models/driverRunningStatus.model");
const { check, validationResult } = require("express-validator");
const { createHash } = require("../util/password");
const moment = require("moment");
const DriverRest = require("../models/driver_rest.model");

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

    console.log("Created object " + JSON.stringify(newDriver));

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
    const { vehicleno, start_km } = req.body;
    try {
      //Check if already checked in
      const hasCheckedIn = await DriverRunningStatus.hasCheckedIn(driverId);
      const hasStartedDay = await DriverRunningStatus.hasStartedDay(driverId);
      //Has already started the day
      if (hasStartedDay.length > 0) {
        console.log("Driver has already started the day");
        return res.status(400).json({
          errors: [
            { msg: "Driver has already checked in and started the day" },
          ],
        });
      }

      //Has already checked in
      if (hasCheckedIn.length > 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Driver has already checked in" }] });
      }

      //Post checkin the driver
      const checkIn = await DriverRunningStatus.createCheckIn({
        driver_id: driverId,
        vehicleno,
        start_km,
      });
      return res.json(checkIn);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

//Starts the day for the driver
exports.putStartDay = async (req, res, next) => {
  const driverId = req.driver.id;
  console.log(driverId);
  try {
    //check if checked in
    const hasCheckedIn = await DriverRunningStatus.hasCheckedIn(driverId);
    const hasStartedDay = await DriverRunningStatus.hasStartedDay(driverId);
    if (hasCheckedIn.length === 0) {
      if (hasStartedDay.length > 0) {
        console.log("Driver has already started the day");
        return res.status(400).json({
          errors: [{ msg: "The driver has already started the day" }],
        });
      }
      console.log("Driver is not checked in");
      console.log(hasCheckedIn);
      return res
        .status(400)
        .json({ errors: [{ msg: "The driver has not checked in" }] });
    }

    //Update record, enter start_at
    console.log(hasCheckedIn[0]);
    const dayStarted = await DriverRunningStatus.startDay(hasCheckedIn[0].id);
    res.json({ dayStarted: true, updationInfo: dayStarted });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//End the day for the driver
exports.putEndDay = async (req, res, next) => {
  //Check if driver has checked-in and has started working¨
  const driverId = req.driver.id;
  const { end_km } = req.body;
  console.log("Driver is " + driverId);
  const startedSessions = await DriverRunningStatus.hasStartedDay(driverId);
  console.log("Started session " + JSON.stringify(startedSessions));
  const startedSession = startedSessions[0];
  if (!startedSession) {
    return res
      .status(400)
      .json({ errors: [{ msg: "The driver has no active session" }] });
  }
  if (end_km < startedSession.start_km) {
    return res.status(400).json({
      errors: [
        {
          msg:
            "Meter reading error. Meter reading at the end of the day can not be less than meter reading at the start of the day",
        },
      ],
    });
  }

  //Check if there is a break ongoing
  const sessionId = startedSession.id;
  const ongoingRestRecordset = await DriverRest.getOngoingRest(sessionId);
  if (ongoingRestRecordset.length > 0) {
    console.log("Driver has taken a break");
    return res.status(400).json({
      errors: [
        {
          msg: "Driver is on break. End the break before trying to end the day",
        },
      ],
    });
  }

  //Update record
  const sessionEnded = await DriverRunningStatus.endDay(
    startedSession.id,
    end_km
  );
  res.json({
    msg: "Day concluded",
    workDay: sessionEnded,
  });
};

//Hours Per Day
exports.getHoursPerDay = [
  check("dayToCheckHoursFor")
    .isISO8601()
    .toDate()
    .withMessage("created_on must be a valid date")
    .custom((dayToCheckHoursFor) => {
      const today = new Date();
      if (dayToCheckHoursFor > today) {
        throw new Error(
          "Wrong date provided, you can only check the hours worked for today or an earlier date"
        );
      }
      return true;
    }),
  async (req, res, next) => {
    const driverId = req.driver.id;
    const { dayToCheckHoursFor } = req.body;
    let theDay = `${dayToCheckHoursFor.getFullYear()}-${
      dayToCheckHoursFor.getMonth() + 1
    }-${dayToCheckHoursFor.getDate()}`;
    theDay = theDay
      .split("-")
      .map((entity, index) => {
        if (index === 1) {
          if (entity.length === 1) {
            entity = 0 + entity;
          }
          return entity;
        }
        return entity;
      })
      .join("-");
    console.log(theDay + " is formatted day");

    // Using string
    // const theDay = dayToCheckHoursFor.toISOString();
    console.log("the day is " + theDay);
    try {
      const recordSet = await DriverRunningStatus.hoursPerDay(driverId, theDay);
      console.log(recordSet);
      if (recordSet.length <= 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "No record of hours available on this date for the drivers",
            },
          ],
        });
      }
      res.json(recordSet);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

exports.postTakeBreak = async (req, res, next) => {
  const driverId = req.driver.id;
  try {
    const isWorking = await DriverRunningStatus.hasStartedDay(driverId);
    //Has the driver started the day and not ended it
    if (isWorking.length === 0) {
      return res.status(400).json({
        errors: [{ msg: "the driver has no active session for the day" }],
      });
    }
    //get the session id from driver running status
    const sessionId = isWorking[0].id;

    //Check if driver is already on pause
    const ongoingRestRecordset = await DriverRest.getOngoingRest(sessionId);
    if (ongoingRestRecordset.length > 0) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Driver is already on break" }] });
    }

    //Create an entry in rest table
    const breakRecordSet = await DriverRest.createBreak(sessionId);
    //Return time when rest began
    if (breakRecordSet.length === 0) {
      return res.status(400).json({
        errors: [{ msg: "Some error occured, cannot process the request" }],
      });
    }
    res.status(201).json({
      onBreak: true,
      msg: "Driver on a break",
      breakInfo: breakRecordSet[0],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.putResumeDriving = async (req, res, next) => {
  const driverId = req.driver.id;
  try {
    //Check if there is on going rest
    const isWorking = await DriverRunningStatus.hasStartedDay(driverId);
    //Has the driver started the day and not ended it
    if (isWorking.length === 0) {
      return res.status(400).json({
        errors: [{ msg: "the driver has no active session for the day" }],
      });
    }
    //get the session id from driver running status
    const sessionId = isWorking[0].id;
    const ongoingRestRecordset = await DriverRest.getOngoingRest(sessionId);
    if (ongoingRestRecordset.length === 0) {
      console.error("Driver has no ongoing break");
      return res.status(400).json({
        errors: [
          {
            resumedDriving: false,
            msg: "Ther driver does not have any ongoing break",
          },
        ],
      });
    }
    //Resume driving
    const resumeDrivingRecord = await DriverRest.resumeDriving(sessionId);
    console.log("Received from model " + JSON.stringify(resumeDrivingRecord));
    if (resumeDrivingRecord) {
      return res
        .status(200)
        .json({ resumedDriving: true, result: resumeDrivingRecord });
    }
    return res.status(500).json({
      errors: [
        {
          resumedDriving: false,
          msg: "Some error occured while ending break",
        },
      ],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
