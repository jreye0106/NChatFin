const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Upload attachment + create message
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const { receiverId, encryptedContent, encryptedKey, iv } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const file = req.file;

    const msg = await Message.create({
      senderId: req.user.id,
      receiverId,
      encryptedContent,
      encryptedKey,
      iv,
      attachmentUrl: `/uploads/${file.filename}`,
      attachmentType: file.mimetype.startsWith("image")
        ? "image"
        : file.mimetype.startsWith("audio")
        ? "audio"
        : "file"
    });

    res.json(msg);
  } catch (err) {
    console.error("Attachment upload error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
