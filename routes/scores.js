const express = require("express");
const router = express.Router();
const Score = require("../models/Score");
const authMiddleware = require("../middleware/auth"); 
router.post("/", authMiddleware, async (req, res) => {
  const { game, score } = req.body;
  if (!game || score === undefined)
    return res.status(400).json({ msg: "Missing game or score" });

  try {
    const newScore = new Score({ userId: req.userId, game, score });
    await newScore.save();
    res.json({ msg: "Score saved", score: newScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/highest/:game", authMiddleware, async (req, res) => {
  try {
    const { game } = req.params;
    const highest = await Score.findOne({ userId: req.userId, game })
      .sort({ score: -1 })
      .limit(1);

    res.json({ success: true, highestScore: highest ? highest.score : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
