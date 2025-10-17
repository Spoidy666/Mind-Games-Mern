// CardMatching.js — corrected & safer version

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  if (!cards || cards.length === 0) {
    console.warn('No .card elements found.');
    return;
  }

  const values = ["😊","😂","😍","😎","🤩","😜","🥳","😇"];
  let gameValues = [...values, ...values];
  gameValues.sort(() => Math.random() - 0.5);

  // attach values to cards
  cards.forEach((card, index) => {
      card.dataset.value = gameValues[index];
      const back = card.querySelector('.card-back');
      if (back) back.textContent = gameValues[index];
  });

  // elements & state
  let timeElapsed = 0;
  let timerInterval = null;
  let score = 0;
  const scoreDisplay = document.getElementById('score');
  if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let gameStarted = false;

  // event listeners
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
      if (!firstCard || !secondCard) return;

      const isMatch = firstCard.dataset.value === secondCard.dataset.value;

      if (isMatch) {
          firstCard.classList.add('matched');
          secondCard.classList.add('matched');
          score += 10;
          if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
          resetSelection();
          checkWin();
      } else {
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
              showCongrats(finalScore, timeElapsed);
              saveScore(finalScore);
          }, 500);
      }
  }

  // timer
  function startTimer() {
    timeElapsed = 0;
    const timerEl = document.getElementById('timer');
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeElapsed++;
      if (timerEl) timerEl.textContent = `Time: ${timeElapsed}s`;
    }, 1000);
  }
  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  // modal handlers
  function showCongrats(score, timeElapsed) {
    const scoreEl = document.getElementById("scoreDisplay");
    const timeEl = document.getElementById("finalTime");
    const modal = document.getElementById("congratsModal");
    if (scoreEl) scoreEl.textContent = "Your Score: " + score;
    if (timeEl) timeEl.textContent = `⏱️ Time: ${timeElapsed}s`;
    if (modal) modal.style.display = "flex";
  }
  const playAgainBtn = document.getElementById("playAgainBtn");
  if (playAgainBtn) playAgainBtn.onclick = () => location.reload();
  const goHomeBtn = document.getElementById("goHomeBtn");
  if (goHomeBtn) goHomeBtn.onclick = () => window.location.href = "../../../index.html";

  // Score saving / fetching (fixed)
  async function saveScore(scoreVal) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({ game: "CardMatching", score: scoreVal }),
      });
      const data = await response.json();
      console.log('saveScore response', data);
    } catch (err) {
      console.error('saveScore error', err);
    }
  }

  async function getHighestScore() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const highestScoreEl = document.getElementById('highscore');
      const response = await fetch("/api/scores/highest/CardMatching", {
        headers: { "Authorization": token }
      });
      const data = await response.json();
      console.log("Highest score:", data.highestScore);
      if (highestScoreEl) highestScoreEl.textContent = `HighScore: ${data.highestScore ?? 0}`;
    } catch (err) {
      console.error('getHighestScore error', err);
    }
  }

  // run once at load if token exists
  const token = localStorage.getItem("token");
  if (token) getHighestScore();

}); // end DOMContentLoaded
