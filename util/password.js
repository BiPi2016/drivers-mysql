const bcrypt = require("bcryptjs");

exports.createHash = async (enteredPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(enteredPassword, salt);
    return hashed;
  } catch (err) {
    throw new Error(err);
  }
};

exports.comparePasswords = async (enteredPassword, registeredPassword) => {
  console.log(enteredPassword, registeredPassword);
  try {
    return bcrypt.compare(enteredPassword, registeredPassword);
  } catch (err) {
    console.error("Error while comparing passwords " + error);
    throw new Error("Server error, could not validate password");
  }
};
