const totalTiles = 30;
const tiles = document.querySelectorAll(".tile");
const scores=document.getElementById("score");
const highestScore=document.getElementById("highscore");
let correctTiles = [];
let clickcount = 0;
let totalCorrectClicks = 0;
let totalIncorrectClicks = 0;
let score = 0;
let maxRounds = 10;
let currentRound = 1;
function startRound(round) {
  clickcount = 0;
  currentRound = round;
  const numberOfTiles = 1 + round;
  correctTiles = getRandomTiles(numberOfTiles);
  tiles.forEach((tile) => {
    tile.classList.remove("correct", "incorrect", "clicked", "active");
    const value = parseInt(tile.dataset.value);
    if (correctTiles.includes(value)) {
      tile.classList.add("correct");
    } else {
      tile.classList.add("incorrect");
    }
    tile.classList.add("active");
  });
  setTimeout(() => {
    tiles.forEach((tile) => {
      tile.classList.remove("correct");
      tile.classList.remove("incorrect");
    });
  }, 2000);
}

function getRandomTiles(count) {
  const numbers = Array.from({ length: totalTiles }, (_, i) => i + 1);
  const selected = [];

  while (selected.length < count) {
    const index = Math.floor(Math.random() * numbers.length);
    selected.push(numbers.splice(index, 1)[0]);
  }

  return selected;
}
async function saveScore(score) {
  const token = localStorage.getItem("token");
  if (!token) return;

  const response = await fetch("/api/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify({ game: "tileFlip", score }),
  });

  const data = await response.json();
  console.log(data);

  await getHighestScore();
  return data;
}
async function getHighestScore() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const response = await fetch(`/api/scores/highest/tileFlip`, {
    headers: { "Authorization": token }
  });
  const data = await response.json();
  console.log("Highest score:", data.highestScore);
  highestScore.textContent = data.highestScore;
}
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) getHighestScore();
});




tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    if (!tile.classList.contains("active")) return;
    const value = parseInt(tile.dataset.value);
    if (tile.classList.contains("clicked")) return;
    if (correctTiles.includes(value)) {
      tile.classList.add("correct");
      totalCorrectClicks++;
      scores.textContent= (totalCorrectClicks - totalIncorrectClicks);
      clickcount++;
      tile.classList.add("active");
      tile.classList.add("clicked");
      if (clickcount === correctTiles.length) {
        setTimeout(() => {
          alert("Congratulations! You found all the correct tiles!");
          if (currentRound < maxRounds) {
            startRound(currentRound + 1);
          } else {
            score = totalCorrectClicks - totalIncorrectClicks;
            alert("You have completed the game! Score is " + score);
            saveScore(score);
          }
        }, 50);
      }
    } else {
      tile.classList.add("incorrect");
      tile.classList.add("active");
      tile.classList.add("clicked");
      totalIncorrectClicks++;
  scores.textContent= (totalCorrectClicks - totalIncorrectClicks);
    }
  });
});
startRound(2);
1