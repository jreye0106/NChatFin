const User = require("../models/User");

// -----------------------------
// GET /api/profile/me
// -----------------------------
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ msg: "Failed to load profile" });
  }
};

// -----------------------------
// PUT /api/profile/update
// -----------------------------
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};

// -----------------------------
// POST /api/profile/avatar
// -----------------------------
exports.uploadAvatar = async (req, res) => {
  try {
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-passwordHash");

    res.json({ url: avatarUrl, user });
  } catch (err) {
    console.error("AVATAR UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Failed to upload avatar" });
  }
};

// -----------------------------
// PUT /api/profile/theme
// -----------------------------
exports.updateTheme = async (req, res) => {
  try {
    const { themeColor } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { themeColor },
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error("THEME UPDATE ERROR:", err);
    res.status(500).json({ msg: "Failed to update theme" });
  }
};

// -----------------------------
// PUT /api/profile/status
// -----------------------------
exports.updateStatusVisibility = async (req, res) => {
  try {
    const { statusVisible } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { statusVisible },
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(500).json({ msg: "Failed to update status visibility" });
  }
};
