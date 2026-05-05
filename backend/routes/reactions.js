const router = require("express").Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// Toggle reaction on a message
router.post("/:messageId", auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const userId = req.user.id;

    const msg = await Message.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ msg: "Message not found" });

    // Check if reaction already exists (toggle)
    const existing = msg.reactions.find(
      (r) => r.userId.toString() === userId && r.emoji === emoji
    );

    if (existing) {
      // Remove reaction
      msg.reactions = msg.reactions.filter(
        (r) => !(r.userId.toString() === userId && r.emoji === emoji)
      );
    } else {
      // Add reaction
      msg.reactions.push({ userId, emoji });
    }

    await msg.save();
    res.json({
      messageId: msg._id,
      reactions: msg.reactions,
    });
  } catch (err) {
    console.error("Reaction route error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
