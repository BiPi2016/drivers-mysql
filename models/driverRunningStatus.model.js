const db = require("./db");

const DriverRunningStatus = function (newStatus) {
  this.vehicleno = newStatus.vehicleno;
  this.driver_id = newStatus.driver_id;
  this.start_km = newStatus.start_km;
  this.end_km = newStatus.end_km;
  this.checkin_date = new Date();
  this.start_at = new Date();
  this.end_at = new Date();
};

//Create a new checkin
DriverRunningStatus.create = (driverRunningStatus) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO driver_running_status SET ?",
      driverRunningStatus,
      (err, result) => {
        if (err) {
          console.error("Error create new driving status");
          reject(err);
        }
        resolve({
          id: result.insertId,
          ...driverRunningStatus,
        });
      }
    );
  });
};

//@CHECKIN, searches and returns fieldset where given driver is checked in
DriverRunningStatus.findCheckedIn = (driverId) => {
  return new Promise((resolve, reject) => {
    db.query(
      /* "SELECT * FROM driver_running_status WHERE start_km > ? AND driver_id = ? ",
      [10000, 33] */
      "SELECT * FROM driver_running_status WHERE driver_id = ? AND NOT start_at = ?",
      [34, "NULL"],
      (err, results, fields) => {
        if (err) {
          return reject("Could not query" + err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = DriverRunningStatus;
