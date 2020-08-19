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
  this.created_on = new Date();
};

Driver.create = (newDriver) => {
  /* const created_on = new Date();
  newDriver = { ...newDriver, created_on }; */
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

//Used while loggingin in auth routes
Driver.findByMobile = (mobile) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM drivers WHERE mobile = ?",
      [mobile],
      (err, result) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

//Used for driver routes
Driver.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM drivers WHERE id = ?",
      [id],
      (err, result, fields) => {
        if (err) {
          console.error("Error finding driver by id in databse" + err.stack);
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

module.exports = Driver;
