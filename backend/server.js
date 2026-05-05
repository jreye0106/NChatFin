require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Models
const Message = require("./models/Message");

// Routes
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const messagesReadRoutes = require("./routes/messagesRead");
const friendRoutes = require("./routes/friends");
const chatlistRoutes = require("./routes/chatlist");
const profileRoutes = require("./routes/profile");
const avatarRoutes = require("./routes/avatar");
const reactionsRoutes = require("./routes/reactions");
const attachmentsRoutes = require("./routes/attachments");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// ROUTES (clean + correct)
// -----------------------------
app.use("/api/auth", authRoutes);

// NEW MESSAGE SYSTEM (send + conversation)
app.use("/api/messages", messagesRoutes);  // contains /send and /conversation/:userId

// READ RECEIPTS
app.use("/api/messages/read", messagesReadRoutes);  // PUT /:otherUserId

// FRIENDS + CHATLIST
app.use("/api/friends", friendRoutes);
app.use("/api/chatlist", chatlistRoutes);

// PROFILE + AVATAR
app.use("/api/profile", profileRoutes);
app.use("/api/profile", avatarRoutes);

// REACTIONS + ATTACHMENTS
app.use("/api/reactions", reactionsRoutes);
app.use("/api/attachments", attachmentsRoutes);


// -----------------------------
// MONGO CONNECTION
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// -----------------------------
// SOCKET.IO
// -----------------------------
app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    socket.broadcast.emit("userOnline", { userId });
  });

  socket.on("messageDelivered", async ({ messageId }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;
      msg.deliveredAt = new Date();
      await msg.save();
      io.to(msg.senderId.toString()).emit("messageDelivered", {
        messageId,
        deliveredAt: msg.deliveredAt,
      });
    } catch (err) {
      console.error("messageDelivered error:", err);
    }
  });

  socket.on("messagesRead", async ({ readerId, otherUserId }) => {
    try {
      const now = new Date();
      await Message.updateMany(
        { senderId: otherUserId, receiverId: readerId, read: false },
        { read: true, readAt: now }
      );
      io.to(otherUserId).emit("messagesRead", { readerId, readAt: now });
    } catch (err) {
      console.error("messagesRead error:", err);
    }
  });

  socket.on("typing", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("typing", { senderId });
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("stopTyping", { senderId });
  });

  socket.on("reactMessage", async ({ messageId, emoji, userId }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;

      const existing = msg.reactions.find(
        (r) => r.userId.toString() === userId && r.emoji === emoji
      );

      if (existing) {
        msg.reactions = msg.reactions.filter(
          (r) => !(r.userId.toString() === userId && r.emoji === emoji)
        );
      } else {
        msg.reactions.push({ userId, emoji });
      }

      await msg.save();

      io.emit("messageReaction", {
        messageId,
        reactions: msg.reactions,
      });
    } catch (err) {
      console.error("reactMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      socket.broadcast.emit("userOffline", {
        userId: socket.userId,
        lastSeen: new Date(),
      });
    }
  });
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
