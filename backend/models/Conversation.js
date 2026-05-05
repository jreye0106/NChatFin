const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // AES key encrypted for each participant (base64)
    encryptedKeyForUserA: {
      type: String,
      required: true,
    },
    encryptedKeyForUserB: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
