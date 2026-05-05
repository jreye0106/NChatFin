const crypto = require("crypto");

function decryptHybridMessage(encryptedContent, encryptedKey, iv, privateKey) {
  // 1) Decrypt AES key using RSA private key
  const aesKey = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedKey, "base64")
  );

  // 2) Decrypt message using AES key + IV
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    aesKey,
    Buffer.from(iv, "base64")
  );

  let decrypted = decipher.update(encryptedContent, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = decryptHybridMessage;
