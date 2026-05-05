const crypto = require("crypto");

function encryptMessage(message, publicKey) {
  // Convert message to buffer
  const bufferMessage = Buffer.from(message, "utf-8");

  // Encrypt using recipient's public key
  const encrypted = crypto.publicEncrypt(
    publicKey,
    bufferMessage
  );

  // Return encrypted message as string
  return encrypted.toString("base64");
}

module.exports = encryptMessage;
