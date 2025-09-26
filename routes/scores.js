const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

router.post("/", authMiddleware, async (req, res) => {
  const { game, score } = req.body;
  if (!game || score === undefined)
    return res.status(400).json({ msg: "Missing game or score" });

  try {
    const user = await User.findById(req.userId);
    user.scores.push({ game, score });
    await user.save();
    res.json({ msg: "Score saved", scores: user.scores });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
