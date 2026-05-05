const crypto = require("crypto");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const User = require("../../models/User");
const decryptConversationKey = require("../../security/decryptConversationKey");

exports.getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const me = await User.findById(userId);
    if (!me) return res.status(404).json({ error: "User not found" });

    const convo = await Conversation.findOne({
      $or: [
        { userA: userId, userB: otherUserId },
        { userA: otherUserId, userB: userId },
      ],
    });

    if (!convo) return res.json([]);

    const encryptedKey =
      convo.userA.toString() === userId
        ? convo.encryptedKeyForUserA
        : convo.encryptedKeyForUserB;

    let aesKey;
    try {
      aesKey = decryptConversationKey(encryptedKey, me.privateKey);
    } catch (e) {
      console.error("❌ Failed to decrypt conversation key:", e);
      return res
        .status(500)
        .json({ error: "Failed to decrypt conversation key" });
    }

    const messages = await Message.find({ conversationId: convo._id }).sort({
      createdAt: 1,
    });

    const decryptedMessages = messages.map((msg) => {
      try {
        const decipher = crypto.createDecipheriv(
          "aes-256-cbc",
          aesKey,
          Buffer.from(msg.iv, "base64")
        );

        let decryptedText = decipher.update(
          msg.encryptedContent,
          "base64",
          "utf8"
        );
        decryptedText += decipher.final("utf8");

        return { ...msg.toObject(), decryptedText };
      } catch (e) {
        console.error(
          "❌ Decryption failed for message:",
          msg._id.toString(),
          e.message
        );
        return { ...msg.toObject(), decryptedText: null };
      }
    });

    res.json(decryptedMessages);
  } catch (err) {
    console.error("getConversation error:", err);
    res.status(500).json({ error: "Failed to load conversation" });
  }
};
