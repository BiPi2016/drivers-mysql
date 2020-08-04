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
  //Using Promise
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO drivers SET ?", newDriver, (err, result) => {
      if (err) {
        console.error(err);
        return reject(err.sqlMessage);
      }
      resolve({
        id: result.insertId,
        ...newDriver,
      });
    });
  });
};

Driver.findByMobile = (mobile) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM drivers WHERE mobile = ?",
      [mobile],
      (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

module.exports = Driver;
