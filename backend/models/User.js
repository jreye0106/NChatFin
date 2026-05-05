const mongoose = require('mongoose');

// 1. Schema definition
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    // Encryption keys
    publicKey: { type: String },
    privateKey: { type: String },

    // Profile system
    avatar: { type: String, default: null }, // URL to profile picture
    bio: { type: String, default: "" }, // Short bio
    status: { type: String, default: "Available" }, // Custom status text
    about: { type: String, default: "Hey there! I'm using NChat." },

    // NEW — Profile customization
    themeColor: { type: String, default: "#4f7cff" }, // User’s profile accent color
    backgroundImage: { type: String, default: "" }, // Optional profile background
    statusVisible: { type: Boolean, default: true }, // Controls online visibility

    // Presence system
    lastSeen: { type: Date, default: null }
  },
  { timestamps: true }
);

// 2. Export model
module.exports = mongoose.model('User', userSchema);
