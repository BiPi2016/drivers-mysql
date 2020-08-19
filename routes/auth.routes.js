const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

//@route POST /auth/signin
//@desc Signs the driver in
//@access Public
//@Parameters mobile number and password in req.body
router.post("/signIn", authController.postSignIn);

module.exports = router;
