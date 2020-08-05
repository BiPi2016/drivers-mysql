const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");
const authJwt = require("../middleware/authJwt");

//@route GET driver/
//@desc Fetchs drivers home
//@access Private
router.get("/", authJwt, driverController.getDriverHome);

//@route GET driver/checkin
//@desc Checks driver In
//@access Private
router.post("/checkin", authJwt, driverController.postCheckIn);

//@route GET driver/startDay
//@desc Checks driver In
//@access Private
router.post("/startDay", authJwt, driverController.postStartDay);

//@route GET driver/endDay
//@desc Checks driver In
//@access Private
router.post("/endDay", authJwt, driverController.postEndDay);

//@route GET driver/create
//@desc Creates a new Driver, For Test Purpose
//@access Public
router.post("/create", driverController.create);

module.exports = router;
