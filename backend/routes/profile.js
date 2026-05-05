const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const {
  getMyProfile,
  updateProfile,
  updateTheme,
  updateStatusVisibility,
  uploadAvatar,
} = require("../controllers/profileController");

// -----------------------------
// Multer setup for avatar upload
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // If auth hasn't populated req.user yet, fallback to timestamp to avoid crash
    const uid = req.user && req.user.id ? req.user.id : Date.now();
    cb(null, `avatar_${uid}${ext}`);
  },
});

const upload = multer({ storage });

// -----------------------------
// Routes
// -----------------------------

// Get logged-in user's profile
router.get("/me", auth, getMyProfile);

// Get public profile by id (used by frontend: GET /api/profile/user/:id)
router.get("/user/:id", auth, async (req, res) => {
  try {
    console.log("[PROFILE ROUTE HIT] params:", req.params, "auth user:", req.user && req.user.id);
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "username email avatar online lastSeen bio"
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("PROFILE GET ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update profile fields (username, bio, status, themeColor, etc.)
router.put("/update", auth, updateProfile);

// Upload avatar
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);

// Update theme color
router.put("/theme", auth, updateTheme);

// Toggle online visibility
router.put("/status", auth, updateStatusVisibility);

module.exports = router;
