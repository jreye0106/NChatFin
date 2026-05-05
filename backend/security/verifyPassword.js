const crypto = require("crypto");

function verifyPassword(password, storedHash, salt) {
  const hashToCompare = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return hashToCompare === storedHash;
}

module.exports = verifyPassword;
