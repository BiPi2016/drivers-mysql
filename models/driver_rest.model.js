const db = require("./db");
const DrivingRunningStatus = require("./driverRunningStatus.model");

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
        resolve(result);
      }
    );
  });
};

module.exports = DriverRest;
