const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    console.log("checking auth");
    const token = req.header("x-access-token");
    console.log("The token " + token);
    if (!token) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Authorization denied, no token set" }] });
    }
    next();
  } catch (err) {
    res.status(403).json({ errors: [{ msg: "Unauthorized" }] });
  }
};
