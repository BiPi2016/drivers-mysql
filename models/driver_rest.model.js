const db = require("./db");
const DrivingRunningStatus = require("./driverRunningStatus.model");
const Driver = require("./driver.model");

const DriverRest = function (newRestInfo) {
  this.session_id = newRestInfo.session_id;
  this.pauseAt = newRestInfo.pauseAt;
  this.resumeAt = newRestInfo.resumeAt;
};

DriverRest.createPause = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO driver_rests (session_id) VALUES (?)",
      [sessionId],
      (err, result) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log("Took rest at " + JSON.stringify(result));
        resolve(result);
      }
    );
  });
};

DriverRest.resumeDriving = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE driver_rests SET resume_at = NOW() WHERE session_id = ? AND pause_at IS NOT NULL AND resume_at IS NULL",
      [sessionId],
      (err, result, fields) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log("These are the results while resuming driving");
        console.log(result);
        resolve(result);
      }
    );
  });
};

DriverRest.getOngoingRest = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM driver_rests WHERE session_id = ? AND resume_at IS NULL",
      [sessionId],
      (err, result, fields) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(result);
      }
    );
  });
};

module.exports = DriverRest;
