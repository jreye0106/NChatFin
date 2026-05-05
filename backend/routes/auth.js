const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateKeyPair = require('../security/generateKeyPair');

// ---------------------------------------------
// SIGNUP
// ---------------------------------------------
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);

    // Generate RSA keypair for this user
    const { publicKey, privateKey } = generateKeyPair();

    const user = new User({
      username,
      email,
      passwordHash: hash,
      publicKey,
      privateKey
    });

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------------------------------------
// LOGIN  ⭐ Includes privateKey in JWT
// ---------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ msg: 'Wrong password' });

    const token = jwt.sign(
      {
        id: user._id,
        privateKey: user.privateKey
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
