const router = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");
const auth = require("../middleware/auth");
const decryptHybridMessage = require("../security/decryptHybridMessage");

// GET /api/messages/conversation/:otherUserId
router.get("/:otherUserId", auth, async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;

    // Load full user to get private key
    const me = await User.findById(userId);
    if (!me || !me.privateKey) {
      console.log("❌ Missing private key for user:", userId);
      return res.status(500).json({ msg: "Missing private key" });
    }

    console.log("🔑 PRIVATE KEY LOADED:", me.privateKey.slice(0, 40) + "...");

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    const decryptedMessages = messages.map((msg) => {
      try {
        const decryptedText = decryptHybridMessage(
          msg.encryptedContent,
          msg.encryptedKey,
          msg.iv,
          me.privateKey
        );

        return {
          ...msg.toObject(),
          decryptedText,
        };
      } catch (err) {
        console.error("❌ Decryption failed for message:", msg._id, err);
        return {
          ...msg.toObject(),
          decryptedText: null,
        };
      }
    });

    res.json(decryptedMessages);
  } catch (err) {
    console.error("CONVERSATION ERROR:", err);
    res.status(500).json({ msg: "Server error loading conversation" });
  }
});

module.exports = router;
