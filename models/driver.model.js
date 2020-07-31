const db = require("./db");

const Driver = function (driver) {
  this.name = driver.name;
  this.email = driver.email;
  this.mobile = driver.mobile;
  this.password = driver.password;
  this.license = driver.license;
  this.regno = driver.regno;
  this.address = driver.address;
  this.pincode = driver.pincode;
  this.city = driver.city;
  this.status = driver.status;
  this.created_on = driver.created_on;
};

Driver.create = (newDriver) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO drivers SET ?", newDriver, (err, result) => {
      // Database error
      if (err) {
        reject("Error while saving driver");
      }

      // Handle Wrong field value errors

      //Record created
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
