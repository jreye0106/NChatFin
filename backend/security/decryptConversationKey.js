const crypto = require("crypto");

function decryptConversationKey(encryptedKeyBase64, privateKeyPem) {
  const encryptedKey = Buffer.from(encryptedKeyBase64, "base64");

  const aesKey = crypto.privateDecrypt(
    {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    encryptedKey
  );

  return aesKey; // Buffer (32 bytes)
}

module.exports = decryptConversationKey;
