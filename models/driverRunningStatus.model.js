const db = require("./db");

const DriverRunningStatus = function (newStatus) {
  this.vehicleno = newStatus.vehicleno;
  this.driver_id = newStatus.driver_id;
  this.start_km = newStatus.start_km;
  this.end_km = newStatus.end_km;
  this.checkin_date = newStatus.checkin_date;
  this.start_at = newStatus.start_at;
  this.end_at = newStatus.end_km;
};

DriverRunningStatus.create = (driverRunningStatus) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO driverrunningstatus SET ?",
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
