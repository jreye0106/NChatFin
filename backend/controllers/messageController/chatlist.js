const Message = require("../../models/Message");
const User = require("../../models/User");

exports.getChatList = async (req, res) => {
  try {
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }],
    }).sort({ createdAt: -1 });

    const chatMap = {};

    messages.forEach((msg) => {
      const otherUserId =
        msg.senderId.toString() === myId.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!chatMap[otherUserId]) {
        chatMap[otherUserId] = {
          userId: otherUserId,
          lastMessage: msg,
          unreadCount: 0,
        };
      }

      if (
        msg.receiverId.toString() === myId.toString() &&
        !msg.read
      ) {
        chatMap[otherUserId].unreadCount++;
      }
    });

    const chatList = await Promise.all(
      Object.values(chatMap).map(async (chat) => {
        const user = await User.findById(chat.userId).select(
          "_id username avatar"
        );

        return {
          user,
          lastMessage: chat.lastMessage,
          unreadCount: chat.unreadCount,
        };
      })
    );

    res.json(chatList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
