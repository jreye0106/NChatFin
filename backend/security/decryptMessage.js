const crypto = require("crypto");

function decryptMessage(encryptedMessage, privateKey) {
  // Convert base64 string back to buffer
  const bufferEncrypted = Buffer.from(encryptedMessage, "base64");

  // Decrypt using private key
  const decrypted = crypto.privateDecrypt(
    privateKey,
    bufferEncrypted
  );

  // Convert back to readable string
  return decrypted.toString("utf-8");
}

module.exports = decryptMessage;
