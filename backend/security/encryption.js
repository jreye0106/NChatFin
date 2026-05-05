const crypto = require("crypto");

// Simple hybrid-like encryption stub for development.
// Not production-grade E2EE; replace with proper key management for production.
function encryptHybridMessage(plainText) {
  if (typeof plainText !== "string") {
    throw new Error("encryptHybridMessage expects a string");
  }

  // Generate a random 32-byte key for AES-256
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12); // recommended for GCM

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Pack encrypted payload as base64 so it can be stored in Mongo easily
  const encryptedContent = Buffer.concat([encrypted, authTag]).toString("base64");
  const encryptedKey = key.toString("base64"); // in real hybrid, this would be encrypted with recipient's public key

  return {
    encryptedContent,
    encryptedKey,
    iv: iv.toString("base64"),
  };
}

module.exports = { encryptHybridMessage };
