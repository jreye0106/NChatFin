const router = require("express").Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// PUT /api/messages/read/:otherUserId
router.put("/:otherUserId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;

    const now = new Date();

    await Message.updateMany(
      { senderId: otherUserId, receiverId: userId, read: false },
      { read: true, readAt: now }
    );

    res.json({ msg: "Messages marked as read", readAt: now });
  } catch (err) {
    console.error("READ ERROR:", err);
    res.status(500).json({ msg: "Server error marking as read" });
  }
});

module.exports = router;
