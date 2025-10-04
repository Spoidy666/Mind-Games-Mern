const express = require("express");
const router = express.Router();
const Score = require("../models/Score");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  const { game, score } = req.body;
  if (!game || score === undefined) {
    return res.status(400).json({ msg: "Missing game or score" });
  }

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

router.get("/leaderboard", async (req, res) => {
  try {
    const { game } = req.query;
    if (!game) {
      return res.status(400).json({ error: "Game parameter is required" });
    }

    const leaderboard = await Score.find({ game })
      .sort({ score: -1 })
      .limit(10)
      .populate("userId", "name");

    const formatted = leaderboard.map((entry) => ({
      name: entry.userId ? entry.userId.name : "Unknown",
      score: entry.score,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error loading leaderboard:", err);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

module.exports = router;
