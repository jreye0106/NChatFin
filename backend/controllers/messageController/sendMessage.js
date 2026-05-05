const crypto = require("crypto");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const User = require("../../models/User");
const decryptConversationKey = require("../../security/decryptConversationKey");

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ error: "receiverId and message required" });
    }

    const me = await User.findById(senderId);
    const other = await User.findById(receiverId);

    if (!me || !other) {
      return res.status(404).json({ error: "User not found" });
    }

    // 1) Find or create conversation
    let convo = await Conversation.findOne({
      $or: [
        { userA: senderId, userB: receiverId },
        { userA: receiverId, userB: senderId },
      ],
    });

    let aesKey;

    if (!convo) {
      // Create new conversation with fresh AES key
      aesKey = crypto.randomBytes(32); // 256-bit AES key

      const encryptedKeyForUserA = crypto
        .publicEncrypt(
          {
            key: me.publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          aesKey
        )
        .toString("base64");

      const encryptedKeyForUserB = crypto
        .publicEncrypt(
          {
            key: other.publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          aesKey
        )
        .toString("base64");

      convo = await Conversation.create({
        userA: senderId,
        userB: receiverId,
        encryptedKeyForUserA,
        encryptedKeyForUserB,
      });
    } else {
      // Conversation exists → decrypt AES key for sender
      const encryptedKey =
        convo.userA.toString() === senderId
          ? convo.encryptedKeyForUserA
          : convo.encryptedKeyForUserB;

      aesKey = decryptConversationKey(encryptedKey, me.privateKey);
    }

    // 2) Encrypt message with AES key
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);

    let encryptedContent = cipher.update(message, "utf8", "base64");
    encryptedContent += cipher.final("base64");

    // 3) Save message
    const newMsg = await Message.create({
      conversationId: convo._id,
      senderId,
      receiverId,
      encryptedContent,
      iv: iv.toString("base64"),
    });

    // Optional: emit over socket here (plaintext or encrypted)
    // io.to(receiverId).emit("newMessage", { ...newMsg.toObject(), decryptedText: message });

    res.json({
      ...newMsg.toObject(),
      decryptedText: message, // so sender sees plaintext immediately
    });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
