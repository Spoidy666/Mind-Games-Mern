const cards = document.querySelectorAll('.card');
const values = ["😊","😂","😍","😎","🤩","😜","🥳","😇"];
let gameValues = [...values, ...values];
gameValues.sort(() => Math.random() - 0.5);

cards.forEach((card, index) => {
    card.dataset.value = gameValues[index];
    card.querySelector('.card-back').textContent = gameValues[index]; 
});

let timeElapsed = 0;
let timerInterval;
let score=0;

const scoreDisplay = document.getElementById('score'); 
scoreDisplay.textContent = `Score: ${score}`;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let gameStarted = false;
cards.forEach(card => {
    card.addEventListener('click', () => {
        if (lockBoard || card.classList.contains('flipped') || card === firstCard) return;

        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }

        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            checkForMatch();
        }
    });
});

function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    score += 10;  // reward
    scoreDisplay.textContent = `Score: ${score}`;
    resetSelection();
    checkWin();
}
 else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetSelection();
        }, 1000);
    }
}

function resetSelection() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function checkWin() {
    const totalCards = cards.length;
    const matchedCards = document.querySelectorAll('.card.matched').length;

    if (matchedCards === totalCards) {
        stopTimer();

    const timeBonus = Math.max(50 - timeElapsed, 0);
    const finalScore = score + timeBonus;

        setTimeout(() => {
            showCongrats(finalScore,timeElapsed);
            saveScore(finalScore);
        }, 500);
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
    body: JSON.stringify({ game: "CardMatching", score }),
  });

  const data = await response.json();
  console.log(data);
}

// Function to show the modal
function showCongrats(score,timeElapsed) {
  document.getElementById("scoreDisplay").textContent = "Your Score: " + score;
  document.getElementById("finalTime").textContent = `⏱️ Time: ${timeElapsed}s`;
  document.getElementById("congratsModal").style.display = "flex";
}

// Handle buttons
document.getElementById("playAgainBtn").onclick = function() {
  location.reload();  // reload game
};

document.getElementById("goHomeBtn").onclick = function() {
  window.location.href = "../../../index.html"; // update path if needed
};

// Start timer
function startTimer() {
  timeElapsed = 0;
  timerInterval = setInterval(() => {
    timeElapsed++;
    document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
  }, 1000);
}

// Stop timer
function stopTimer() {
  clearInterval(timerInterval);
}

