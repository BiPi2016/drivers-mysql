const db = require("./db");
const { query } = require("express");
const Driver = require("./driver.model");

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
DriverRunningStatus.createCheckIn = (driverRunningStatus) => {
  return new Promise((resolve, reject) => {
    console.log(driverRunningStatus);
    db.query(
      "INSERT INTO driver_running_status SET ?",
      driverRunningStatus,
      (err, result) => {
        if (err) {
          console.error("DB error while creating new checkIn");
          return reject(err);
        }
        resolve({
          checkedIn: true,
          status: {
            id: result.insertId,
            ...driverRunningStatus,
          },
        });
      }
    );
  });
};

DriverRunningStatus.hasCheckedIn = (driverId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM driver_running_status WHERE start_at IS NULL AND driver_id = ?",
      [driverId],
      (err, results, fields) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

DriverRunningStatus.startDay = (statusId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE driver_running_status SET start_at = NOW() WHERE ID = ?",
      [statusId],
      (err, result, fields) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
};

DriverRunningStatus.hasStartedDay = (driverId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM driver_running_status WHERE driver_id = ? AND start_at IS NOT NULL AND end_at IS NULL",
      [driverId],
      (err, result, fields) => {
        if (err) {
          console.error("Error while querying for started session" + err);
          return reject(err);
        }
        console.log(result);
        resolve(result);
      }
    );
  });
};

module.exports = DriverRunningStatus;
