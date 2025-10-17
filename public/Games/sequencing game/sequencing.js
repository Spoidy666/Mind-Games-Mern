class SequencingGame {
  constructor() {
    this.score = 0;
    this.level = 1;
    this.timeLeft = 30;
    this.gameActive = false;
    this.expectedIndex = 0;
    this.correctSequence = [];
    this.displayItems = [];
    this.timerId = null;
    this.highestScore = 0;

    // DOM references
    this.dom = {
      score: document.getElementById("score"),
      level: document.getElementById("level"),
      timer: document.getElementById("timer"),
      highscore: document.getElementById("highscore"), // 👈 make sure you have <h3 id="highscore">
      startBtn: document.getElementById("startBtn"),
      gameGrid: document.getElementById("gameGrid"),
      instruction: document.getElementById("instruction"),
      preGameControls: document.getElementById("preGameControls"),
      modeInputs: document.querySelectorAll('input[name="gameMode"]'),
      gameOverModal: document.getElementById("gameOverModal"),
      finalScoreDisplay: document.getElementById("finalScoreDisplay"),
      finalLevelDisplay: document.getElementById("finalLevelDisplay"),
      playAgainBtn: document.getElementById("playAgainBtn"),
      goHomeBtn: document.getElementById("goHomeBtn"),
    };

    this._bind();
    this._updateDisplay();
    this._getHighestScore(); // 👈 fetch and show high score at load
  }

  // ========= Fetch user’s highest score =========
  async _getHighestScore() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/scores/highest/Sequencing Game", {
        headers: { "Authorization": token }
      });
      const data = await response.json();
      this.highestScore = data.highestScore || 0;
      if (this.dom.highscore)
        this.dom.highscore.textContent = `HighScore: ${this.highestScore}`;
    } catch (err) {
      console.error("Failed to fetch highest score:", err);
    }
  }

  // ========= Bind event listeners =========
  _bind() {
    this.dom.startBtn.addEventListener("click", () => this.startGame());
    this.dom.playAgainBtn.addEventListener("click", () => this._onPlayAgain());
    this.dom.goHomeBtn.addEventListener("click", () => (window.location.href = "../../index.html"));
  }

  startGame() {
    if (this.gameActive) return;
    this.gameActive = true;
    this.dom.preGameControls.style.display = "none";

    this.score = 0;
    this.level = 1;
    this.timeLeft = 30;
    this.expectedIndex = 0;

    this._setMode();
    this._prepareRound();
    this._startTimer();
    this._updateDisplay();
  }

  _setMode() {
    const checked = [...this.dom.modeInputs].find(i => i.checked);
    this.mode = checked ? checked.value : "numbers";
  }

  _prepareRound() {
    const size = Math.min(10, 3 + (this.level - 1));
    const gridCount = size * size;

    this.correctSequence = this._makeSequence(gridCount, this.mode);
    this.displayItems = this._shuffle([...this.correctSequence]);
    this.expectedIndex = 0;
    this._renderGrid(size);
  }

  _renderGrid(size) {
    this.dom.gameGrid.innerHTML = "";
    this.dom.gameGrid.style.gridTemplateColumns = `repeat(${size}, 100px)`;

    this.displayItems.forEach(val => {
      const el = document.createElement("div");
      el.className = "grid-item";
      el.textContent = val;
      el.dataset.value = val;
      el.addEventListener("click", () => this._onItemClick(el));
      this.dom.gameGrid.appendChild(el);
    });
  }

  _makeSequence(count, mode) {
    if (mode === "numbers") {
      return Array.from({ length: count }, (_, i) => String(i + 1));
    } else {
      const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const out = [];
      for (let i = 0; out.length < count; i++) {
        if (i < 26) out.push(alpha[i]);
        else {
          const a = Math.floor((i - 26) / 26);
          const b = (i - 26) % 26;
          out.push(alpha[a] + alpha[b]);
        }
      }
      return out.slice(0, count);
    }
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  _onItemClick(el) {
    if (!this.gameActive) return;
    const expected = this.correctSequence[this.expectedIndex];
    if (el.dataset.value === expected) {
      el.classList.add("correct");
      this.expectedIndex++;
      this.score += 10 * this.level;
      if (this.expectedIndex >= this.correctSequence.length) {
        setTimeout(() => this._onLevelComplete(), 300);
      }
    } else {
      el.classList.add("wrong");
      setTimeout(() => el.classList.remove("wrong"), 500);
      this.score = Math.max(0, this.score - 5);
    }
    this._updateDisplay();
  }

  _onLevelComplete() {
    this.level++;
    this.timeLeft += 10;
    this._prepareRound();
    this._updateDisplay();
  }

  _startTimer() {
    this._clearTimer();
    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.dom.timer.textContent = `Time: ${this.timeLeft}s`;
      if (this.timeLeft <= 0) this._endGame();
    }, 1000);
  }

  _clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  _endGame() {
    this.gameActive = false;
    this._clearTimer();
    saveScore(this.score);
    this._showGameOver();
  }

  _showGameOver() {
    this.dom.finalScoreDisplay.textContent = `Your Score: ${this.score}`;
    this.dom.finalLevelDisplay.textContent = `Level Reached: ${this.level}`;
    this.dom.gameOverModal.setAttribute("aria-hidden", "false");
    this.dom.gameOverModal.style.display = "flex";
  }

  _onPlayAgain() {
    this.dom.gameOverModal.style.display = "none";
    this.startGame();
  }

  _updateDisplay() {
    this.dom.score.textContent = `Score: ${this.score}`;
    this.dom.level.textContent = `Level: ${this.level}`;
    this.dom.timer.textContent = `Time: ${this.timeLeft}s`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SequencingGame();
});

// Existing save function
async function saveScore(score) {
  const token = localStorage.getItem("token");
  if (!token) return;

  const response = await fetch("/api/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify({ game: "Sequencing Game", score }),
  });

  const data = await response.json();
  console.log(data);
}
