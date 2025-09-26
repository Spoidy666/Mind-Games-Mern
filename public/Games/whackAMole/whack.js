const holes = document.querySelectorAll(".hole");
const scoreBoard = document.getElementById("score");
let score = 0;
let activeHole = null;
let moleTimeout = null;
let progressiveTimeout = 1000;
async function saveScore(score) {
  const token = localStorage.getItem("token");
  if (!token) return;

  const response = await fetch("/api/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify({ game: "WhackTheMole", score }),
  });

  const data = await response.json();
  console.log(data);
}
function randomHole() {
  const index = Math.floor(Math.random() * holes.length);
  return holes[index];
}

function showMole() {
  if (activeHole) {
    activeHole.classList.remove("active", "hit");
    activeHole = null;
  }

  const hole = randomHole();
  hole.classList.add("active");
  activeHole = hole;

  moleTimeout = setTimeout(() => {
    hole.classList.remove("active");
    activeHole = null;
  }, 800);
}
function showPlant() {
  const hole = randomHole();
  if (!hole.classList.contains("active") && !hole.classList.contains("plant")) {
    hole.classList.add("plant");
    setTimeout(() => {
      hole.classList.remove("plant");
    }, 800);
  }
}
setInterval(showMole, progressiveTimeout);
setInterval(showPlant, 2500);

holes.forEach((hole) => {
  hole.addEventListener("click", () => {
    if (hole === activeHole && hole.classList.contains("active")) {
      score++;
      scoreBoard.textContent = score;
      if (progressiveTimeout >= 500) {
        progressiveTimeout -= 50;
  
      }
      hole.classList.remove("active");
      hole.classList.add("hit");
      activeHole = null;
      setTimeout(() => {
        hole.classList.remove("hit");
      }, 400);
      clearTimeout(moleTimeout);
    } else if (hole.classList.contains("plant")) {
      hole.classList.add("planthit");
      setTimeout(() => {
        hole.classList.remove("planthit");
      }, 400);
      setTimeout(() => {
        alert("You hit the plant. Final score is " + score);
        saveScore(score);
      }, 400);
      
      hole.classList.remove("plant");
    } else if (!hole.classList.contains("active")) {
      score--;
      scoreBoard.textContent = score;
      hole.classList.add("misclick");
      setTimeout(() => hole.classList.remove("misclick"), 300);
    }
  });
});
