const db = require("./db");

const Driver = function (driver) {
  this.name = driver.name;
  this.email = driver.email;
  this.mobile = driver.mobile;
};

Driver.create = (newDriver) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO drivers SET ?", newDriver, (err, result) => {
      if (err) {
        reject("Error while saving driver");
      }
      resolve({
        msg: "Driver created",
        driver: {
          id: result.insertId,
          ...newDriver,
        },
      });
    });
  });
};

module.exports = Driver;
