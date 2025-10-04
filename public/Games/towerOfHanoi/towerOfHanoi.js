const numDisks = 3;
let selectedDisk = null;
let fromRod = null;
let moveCount = 0;
const highestScore = document.getElementById("highscore");  
const rods = {
  rod1: document.getElementById("rod1"),
  rod2: document.getElementById("rod2"),
  rod3: document.getElementById("rod3"),
};

function createDisks() {
  for (let i = numDisks; i >= 1; i--) {
    const disk = document.createElement("div");
    disk.classList.add("disk");
    disk.dataset.size = i;
    disk.style.width = `${40 + i * 20}px`;
    disk.style.bottom = `${(numDisks - i) * 22}px`;
    rods.rod1.appendChild(disk);
  }
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
    body: JSON.stringify({ game: "towerOfHanoi", score }),
  });

  const data = await response.json();
  console.log(data);

  await getHighestScore();
  return data;
}
async function getHighestScore() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const response = await fetch(`/api/scores/highest/towerOfHanoi`, {
    headers: { "Authorization": token }
  });
  const data = await response.json();
  console.log("Highest score:", data.highestScore);
  highestScore.textContent = "Highscore: "+data.highestScore;
}
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) getHighestScore();
});

function updateDiskPositions(rod) {
  const disks = Array.from(rod.children);
  disks.forEach((disk, index) => {
    disk.style.bottom = `${index * 22}px`;
  });
}

Object.values(rods).forEach((rod) => {
  rod.addEventListener("click", () => {
    const rodDisks = Array.from(rod.children);
    const topDisk = rodDisks[rodDisks.length - 1];

    if (!selectedDisk && topDisk) {
      selectedDisk = topDisk;
      fromRod = rod;
      topDisk.style.border = "2px solid red";
    } else if (selectedDisk) {
      const targetTop = rodDisks[rodDisks.length - 1];
      const selectedSize = parseInt(selectedDisk.dataset.size);
      const targetSize = targetTop ? parseInt(targetTop.dataset.size) : Infinity;

      if (selectedSize < targetSize) {
        rod.appendChild(selectedDisk);
        updateDiskPositions(fromRod);
        updateDiskPositions(rod);
        moveCount++;
        document.getElementById("moves").textContent = "Moves: " + moveCount;

        checkWin();

      } else {
        alert("Invalid move: can't place larger disk on smaller one!");
      }

      selectedDisk.style.border = "none";
      selectedDisk = null;
      fromRod = null;
    }
  });
});

function checkWin() {
  if (rods.rod3.children.length === numDisks) {
    setTimeout(() => {
      alert("Congratulations! You solved it in " + moveCount + " moves.");
      saveScore(moveCount)
    }, 100);
  }
}

createDisks();
