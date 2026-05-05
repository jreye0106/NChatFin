import { io } from "socket.io-client";

// ---------------------------------------------
// ⭐ Create socket instance
// ---------------------------------------------
export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: false, // connect manually after login
});

// ---------------------------------------------
// ⭐ Connect user to socket after login
// ---------------------------------------------
export function connectSocket(userId) {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit("join", userId);
}

// ---------------------------------------------
// ⭐ Disconnect socket on logout
// ---------------------------------------------
export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

// ---------------------------------------------
// ⭐ Presence Handlers (online/offline)
// ---------------------------------------------
export function registerPresenceHandlers(updatePresence) {
  socket.off("userOnline");
  socket.off("userOffline");

  socket.on("userOnline", ({ userId }) => {
    updatePresence(userId, true);
  });

  socket.on("userOffline", ({ userId, lastSeen }) => {
    updatePresence(userId, false, lastSeen);
  });
}

// ---------------------------------------------
// ⭐ Typing Handlers
// ---------------------------------------------
export function registerTypingHandlers(setTyping) {
  socket.off("typing");
  socket.off("stopTyping");

  socket.on("typing", ({ senderId }) => {
    setTyping(senderId, true);
  });

  socket.on("stopTyping", ({ senderId }) => {
    setTyping(senderId, false);
  });
}

export function sendTyping(senderId, receiverId) {
  socket.emit("typing", { senderId, receiverId });
}

export function stopTyping(senderId, receiverId) {
  socket.emit("stopTyping", { senderId, receiverId });
}

// ---------------------------------------------
// ⭐ Message Handlers (REAL‑TIME MESSAGES)
// ---------------------------------------------
export function registerMessageHandlers(addMessage) {
  socket.off("newMessage");

  // 🔥 Backend emits "newMessage"
  socket.on("newMessage", (msg) => {
    addMessage(msg);
  });
}

// ---------------------------------------------
// ⭐ Delivery + Read Receipts
// ---------------------------------------------
export function registerDeliveryHandlers(updateDelivery) {
  socket.off("messageDelivered");

  socket.on("messageDelivered", ({ messageId, deliveredAt }) => {
    updateDelivery(messageId, deliveredAt);
  });
}

export function registerReadHandlers(updateRead) {
  socket.off("messagesRead");

  socket.on("messagesRead", ({ readerId, readAt }) => {
    updateRead(readerId, readAt);
  });
}

export function emitDelivered(messageId) {
  socket.emit("messageDelivered", { messageId });
}

export function emitRead(readerId, otherUserId) {
  socket.emit("messagesRead", { readerId, otherUserId });
}

// ---------------------------------------------
// ⭐ Reaction Handlers
// ---------------------------------------------
export function registerReactionHandlers(updateReactions) {
  socket.off("messageReaction");

  socket.on("messageReaction", (data) => {
    updateReactions(data);
  });
}

export function sendReaction(messageId, emoji, userId) {
  socket.emit("reactMessage", { messageId, emoji, userId });
}

// ---------------------------------------------
// ⭐ Attachments (future use)
// ---------------------------------------------
export function sendAttachment(data) {
  socket.emit("sendAttachment", data);
}
