const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    console.log("checking auth");
    const token = req.header("x-access-token");
    if (!token) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Authorization denied, no token set" }] });
    }

    //Verifying token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("decoded is " + JSON.stringify(decoded));
    req.driver = decoded;
    next();
  } catch (err) {
    res.status(403).json({ errors: [{ msg: "Unauthorized" }] });
  }
};
