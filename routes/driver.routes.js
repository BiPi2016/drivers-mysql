const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");

router.get("/", (req, res, next) => {
  res.send("All drivers");
});

router.get("/:id", driverController.getOne);

router.post("/create", driverController.create);

module.exports = router;
