const crypto = require("crypto");

function encryptHybridMessage(message, publicKey) {
  // 1) Generate AES key + IV
  const aesKey = crypto.randomBytes(32); // 256-bit AES key
  const iv = crypto.randomBytes(16);     // 128-bit IV

  // 2) Encrypt message with AES
  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);

  let encryptedContent = cipher.update(message, "utf8", "base64");
  encryptedContent += cipher.final("base64");

  // 3) Encrypt AES key with RSA public key (PKCS1 padding)
  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    },
    aesKey
  ).toString("base64");

  return {
    encryptedContent,
    encryptedKey,
    iv: iv.toString("base64"),
  };
}

module.exports = encryptHybridMessage;
