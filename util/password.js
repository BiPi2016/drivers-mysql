//const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");

//Using bcryptjs
/* exports.createHash = async (enteredPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(enteredPassword, salt);
    return hashed;
  } catch (err) {
    throw new Error(err);
  }
}; */

/* exports.comparePasswords = async (enteredPassword, registeredPassword) => {
  console.log(enteredPassword, registeredPassword);
  try {
    return bcrypt.compare(enteredPassword, registeredPassword);
  } catch (err) {
    console.error("Error while comparing passwords " + error);
    throw new Error("Server error, could not validate password");
  }
}; */

//Using crypto-js AES
/* exports.createHash = (enteredPassword) => {
  // Encrypt
  let ciphertext = CryptoJS.AES.encrypt(
    enteredPassword,
    process.env.CRYPTO_SECRET_KEY
  ).toString();
  console.log("hashed password" + ciphertext);
  return ciphertext;
}; */

/* exports.comparePasswords = async (enteredPassword, registeredPassword) => {
  console.log(enteredPassword, registeredPassword);
  const bytes = CryptoJS.AES.decrypt(
    registeredPassword,
    process.env.CRYPTO_SECRET_KEY
  );
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  console.log(originalText);
  return enteredPassword === originalText;
};
 */
//Using crypto sha1
exports.createHash = async (enteredPassword) => {
  console.log("entered password " + enteredPassword);
  try {
    let hash = CryptoJS.HmacSHA1(
      enteredPassword,
      process.env.CRYPTO_SECRET_KEY
    );
    hash = hash.toString(CryptoJS.enc.Hex);
    return hash;
  } catch (err) {
    console.log("Error hashing password" + err);
  }
};

exports.comparePasswords = async (enteredPassword, registeredPassword) => {
  try {
    let hash = CryptoJS.HmacSHA1(
      enteredPassword,
      process.env.CRYPTO_SECRET_KEY
    );
    hash = hash.toString(CryptoJS.enc.Hex);
    return hash === registeredPassword;
  } catch (err) {}
};
