const router = require("express").Router();
const Friend = require("../models/Friend");
const User = require("../models/User");
const auth = require("../middleware/auth");

//
// -------------------------------------------------------------
// ⭐ SEARCH USERS
// -------------------------------------------------------------
// GET /api/friends/search?q=<text>
//
router.get("/search", auth, async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const users = await User.find({
      username: { $regex: q, $options: "i" }
    }).select("username email avatar");

    res.json(users);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ msg: "Search failed" });
  }
});


//
// -------------------------------------------------------------
// ⭐ SEND FRIEND REQUEST
// -------------------------------------------------------------
// POST /api/friends/send/:recipientId
//
router.post("/send/:recipientId", auth, async (req, res) => {
  try {
    const requester = req.user.id;
    const recipient = req.params.recipientId;

    if (requester === recipient) {
      return res.status(400).json({ msg: "You cannot add yourself" });
    }

    const existing = await Friend.findOne({
      requester,
      recipient,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    const alreadyFriends = await Friend.findOne({
      $or: [
        { requester, recipient, status: "accepted" },
        { requester: recipient, recipient: requester, status: "accepted" }
      ]
    });

    if (alreadyFriends) {
      return res.status(400).json({ msg: "Already friends" });
    }

    const newRequest = new Friend({
      requester,
      recipient,
      status: "pending"
    });

    await newRequest.save();

    res.json({ msg: "Friend request sent", request: newRequest });

  } catch (err) {
    console.error("Send request error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//
// -------------------------------------------------------------
// ⭐ ACCEPT FRIEND REQUEST
// -------------------------------------------------------------
// POST /api/friends/accept/:requestId
//
router.post("/accept/:requestId", auth, async (req, res) => {
  try {
    const request = await Friend.findById(req.params.requestId);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    if (request.recipient.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    request.status = "accepted";
    await request.save();

    res.json({ msg: "Friend request accepted", request });

  } catch (err) {
    console.error("Accept error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//
// -------------------------------------------------------------
// ⭐ DECLINE FRIEND REQUEST
// -------------------------------------------------------------
// POST /api/friends/decline/:requestId
//
router.post("/decline/:requestId", auth, async (req, res) => {
  try {
    const request = await Friend.findById(req.params.requestId);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    if (request.recipient.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await request.deleteOne();

    res.json({ msg: "Friend request declined" });

  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//
// -------------------------------------------------------------
// ⭐ CANCEL SENT REQUEST
// -------------------------------------------------------------
// POST /api/friends/cancel/:requestId
//
router.post("/cancel/:requestId", auth, async (req, res) => {
  try {
    const request = await Friend.findById(req.params.requestId);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    if (request.requester.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await request.deleteOne();

    res.json({ msg: "Friend request canceled" });

  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//
// -------------------------------------------------------------
// ⭐ REMOVE FRIEND
// -------------------------------------------------------------
// POST /api/friends/remove/:friendId
//
router.post("/remove/:friendId", auth, async (req, res) => {
  try {
    const friendship = await Friend.findById(req.params.friendId);

    if (!friendship) return res.status(404).json({ msg: "Friendship not found" });

    if (
      friendship.requester.toString() !== req.user.id &&
      friendship.recipient.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await friendship.deleteOne();

    res.json({ msg: "Friend removed" });

  } catch (err) {
    console.error("Remove error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//
// -------------------------------------------------------------
// ⭐ BLOCK USER
// -------------------------------------------------------------
// POST /api/friends/block/:userId
//
router.post("/block/:userId", auth, async (req, res) => {
  try {
    const requester = req.user.id;
    const recipient = req.params.userId;

    let block = await Friend.findOne({ requester, recipient });

    if (!block) {
      block = new Friend({
        requester,
        recipient,
        status: "blocked"
      });
    } else {
      block.status = "blocked";
    }

    await block.save();

    res.json({ msg: "User blocked", block });

  } catch (err) {
    console.error("Block error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//
// -------------------------------------------------------------
// ⭐ LIST FRIENDS (returns actual user objects)
// -------------------------------------------------------------
// GET /api/friends/list
//
router.get("/list", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const relations = await Friend.find({
      $or: [
        { requester: userId, status: "accepted" },
        { recipient: userId, status: "accepted" }
      ]
    }).populate("requester recipient", "username email avatar");

    // ⭐ Extract the OTHER user safely
    const friends = relations
      .map((rel) => {
        let other = null;

        if (rel.requester && rel.requester._id.toString() !== userId) {
          other = rel.requester;
        }

        if (rel.recipient && rel.recipient._id.toString() !== userId) {
          other = rel.recipient;
        }

        return other;
      })
      .filter((u) => u && u._id); // remove nulls

    console.log("FRIENDS RETURNED:", friends); // ⭐ DEBUG

    res.json(friends);

  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});




//
// -------------------------------------------------------------
// ⭐ LIST INCOMING REQUESTS
// -------------------------------------------------------------
// GET /api/friends/incoming
//
router.get("/incoming", auth, async (req, res) => {
  try {
    const incoming = await Friend.find({
      recipient: req.user.id,
      status: "pending"
    }).populate("requester", "username email avatar");

    res.json(incoming);

  } catch (err) {
    console.error("Incoming error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//
// -------------------------------------------------------------
// ⭐ LIST OUTGOING REQUESTS
// -------------------------------------------------------------
// GET /api/friends/outgoing
//
router.get("/outgoing", auth, async (req, res) => {
  try {
    const outgoing = await Friend.find({
      requester: req.user.id,
      status: "pending"
    }).populate("recipient", "username email avatar");

    res.json(outgoing);

  } catch (err) {
    console.error("Outgoing error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//
// -------------------------------------------------------------
// ⭐ SUGGESTED FRIENDS
// -------------------------------------------------------------
// GET /api/friends/suggested
//
router.get("/suggested", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const relations = await Friend.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    });

    const exclude = new Set();
    exclude.add(userId.toString());

    relations.forEach(rel => {
      exclude.add(rel.requester.toString());
      exclude.add(rel.recipient.toString());
    });

    const suggested = await User.find({
      _id: { $nin: Array.from(exclude) }
    })
      .select("username email avatar bio status createdAt")
      .sort({ createdAt: -1 });

    res.json(suggested);

  } catch (err) {
    console.error("Suggested friends error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
