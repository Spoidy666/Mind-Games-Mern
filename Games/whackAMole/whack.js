// 1. Select all the holes and the score display
const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');

// 2. Variables to keep track of score and which hole is currently active
let score = 0;
let activeHole = null;

// 3. Function to get a random hole from the available 9
function randomHole() {
  const index = Math.floor(Math.random() * holes.length);
  return holes[index];
}

// 4. Function to show the mole
function showMole() {
  // Remove previous mole (if any)
  if (activeHole) {
    activeHole.classList.remove('active');
  }

  // Select a new random hole
  const hole = randomHole();
  hole.classList.add('active');
  activeHole = hole;

  // Hide the mole after some time (e.g., 800ms)
  setTimeout(() => {
    hole.classList.remove('active');
    activeHole = null;
  }, 800);
}

// 5. Start showing a mole every second (1000ms)
setInterval(showMole, 1000);

// 6. Handle user clicks
holes.forEach(hole => {
  hole.addEventListener('click', () => {
    // Check if the clicked hole is currently active
    if (hole === activeHole && hole.classList.contains('active')) {
      score++; // Increase the score
      scoreBoard.textContent = score; // Update the score on the screen

      // Optional: add "hit" effect
      hole.style.backgroundImage = "url('../../assets/mole_hit.png')";
      setTimeout(() => {
        hole.style.backgroundImage = "";
      }, 300);

      // Remove the mole immediately
      hole.classList.remove('active');
      activeHole = null;
    }
  });
});
