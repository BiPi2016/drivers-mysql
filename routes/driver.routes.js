const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");
const authJwt = require("../middleware/authJwt");

router.get("/", authJwt, driverController.getDriverHome);

router.get("/:id", driverController.getOne);

router.post("/create", driverController.create);

module.exports = router;
