const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");
const authJwt = require("../middleware/authJwt");

//@route GET driver/
//@desc Fetchs drivers home
//@access Private
router.get("/", authJwt, driverController.getDriverHome);

//@route POST driver/checkin
//@desc Checks driver In
//@access Private
router.post("/checkin", authJwt, driverController.postCheckIn);

//@route PUT driver/startDay
//@desc Starts the day for current driver
//@access Private
router.put("/startDay", authJwt, driverController.putStartDay);

//@route PUT driver/endDay
//@desc Ends the day loggedin driver
//@access Private
router.put("/endDay", authJwt, driverController.putEndDay);

//@route GET driver/hoursPerDay
//@desc Gets hours per day for current driver,
//@access Private
router.get("/hoursPerDay", authJwt, driverController.getHoursPerDay);

//@route POST driver/takePause
//@desc Create an entry for in rest table for current driver
//@access Private
router.post("/takeBreak", authJwt, driverController.postTakeBreak);

//@route PUT driver/resumeDriving
//@desc Update driver_rests table, marks end for the break for current driver
//@access Private
router.put("/resumeDriving", authJwt, driverController.putResumeDriving);

//@route POST driver/create
//@desc Creates a new Driver, For Test Purpose
//@access Public
router.post("/create", driverController.create);

module.exports = router;
