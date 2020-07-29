const db = require("./db");

const Driver = function (driver) {
  this.name = driver.name;
  this.email = driver.email;
  this.mobile = driver.mobile;
};

Driver.create = (newDriver, result) => {
  db.query("INSERT INTO drivers SET ?", newDriver, (err, driver) => {
    if (err) {
      console.log("error " + err);
      result(err, null);
    }
    console.log("Driver created ");
    result(null, driver);
  });
};

module.exports = Driver;
