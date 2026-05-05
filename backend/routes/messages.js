const router = require("express").Router();
const auth = require("../middleware/auth");

const { sendMessage } = require("../controllers/messageController/sendMessage");
const { getConversation } = require("../controllers/messageController/getConversation");

// ---------------------------------------------
// SEND MESSAGE (NEW SCALABLE AES SYSTEM)
// ---------------------------------------------
router.post("/send", auth, sendMessage);

// ---------------------------------------------
// GET CONVERSATION (DECRYPTED MESSAGES)
// ---------------------------------------------
router.get("/conversation/:userId", auth, getConversation);

module.exports = router;
