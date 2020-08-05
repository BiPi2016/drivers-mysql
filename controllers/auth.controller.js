const db = require("../models/db");
const { check, validationResult } = require("express-validator");
const { comparePasswords } = require("../util/password");
const jwt = require("jsonwebtoken");

const Driver = require("../models/driver.model");

exports.postSignIn = exports.signIn = [
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
  async (req, res, next) => {
    //Validation and sanitation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mobile, password: enteredPassword } = req.body;

    // Using async await
    try {
      const drivers = await Driver.findByMobile(mobile);
      const driver = drivers[0];

      //No driver found, array length is zero
      if (!driver) {
        console.log("No driver found");
        return res
          .status(401)
          .json({ errors: [{ msg: "Username or password does not match" }] });
      }

      //Driver found, veryfy password
      const passwordsMatch = await comparePasswords(
        enteredPassword,
        driver.password
      );
      //Passwords mismatch
      if (!passwordsMatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Username or password does not match" }] });
      }
      //Passwords match, create token
      const payload = {
        id: driver.id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 3600 * 10, //10 hours
      });
      res.setHeader("x-access-token", token);
      return res.json({
        msg: "Sign in successful",
        token: token,
      });
    } catch (err) {
      console.log("Error found" + err);
      res.status(400).json({ errors: [{ msg: err }] });
    }
  },
];
