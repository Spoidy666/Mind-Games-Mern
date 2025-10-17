const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  game: { 
    type: String, 
    required: true, 
    enum: [
      "WhackTheMole",
      "memory-tile",
      "tower-of-hanoi",
      "card-matching",
      "sequencing"
    ] 
  },
  name: { 
    type: String, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
