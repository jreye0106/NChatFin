const router = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");
const Friend = require("../models/Friend");
const auth = require("../middleware/auth");

// GET /api/chatlist
router.get("/", auth, async (req, res) => {
  try {
    const myId = req.user.id;

    const acceptedFriends = await Friend.find({
      $or: [
        { requester: myId, status: "accepted" },
        { recipient: myId, status: "accepted" },
      ],
    });

    const friendIds = acceptedFriends.map((f) =>
      f.requester.toString() === myId
        ? f.recipient.toString()
        : f.requester.toString()
    );

    if (friendIds.length === 0) {
      return res.json([]);
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: { $in: friendIds } },
        { receiverId: myId, senderId: { $in: friendIds } },
      ],
    }).sort({ createdAt: -1 });

    const chatMap = new Map();

    for (const msg of messages) {
      const otherUserId =
        msg.senderId.toString() === myId
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      if (msg.receiverId.toString() === myId && !msg.read) {
        chatMap.get(otherUserId).unreadCount += 1;
      }
    }

    const chatList = [];
    for (const [otherUserId, chatData] of chatMap.entries()) {
      const user = await User.findById(otherUserId).select(
        "username email avatar online lastSeen"
      );
      if (!user) continue;

      chatList.push({
        user,
        lastMessage: {
          message: chatData.lastMessage.message || "Attachment",
          createdAt: chatData.lastMessage.createdAt,
        },
        unreadCount: chatData.unreadCount,
      });
    }

    chatList.sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    res.json(chatList);
  } catch (err) {
    console.error("CHATLIST ERROR:", err);
    res.status(500).json({ msg: "Server error loading chat list" });
  }
});

module.exports = router;
