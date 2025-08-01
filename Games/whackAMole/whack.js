const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
let score = 0;
let activeHole = null;

function randomHole() {
  return holes[Math.floor(Math.random() * holes.length)];
}

function showMole() {
  if (activeHole) activeHole.classList.remove('active');

  const hole = randomHole();
  hole.classList.add('active');
  activeHole = hole;

  setTimeout(() => {
    hole.classList.remove('active');
    showMole();
  }, 800);
}

holes.forEach(hole => {
  hole.addEventListener('click', () => {
    if (hole === activeHole && hole.classList.contains('active')) {
      score++;
      scoreBoard.textContent = score;

      // Show hit mole
      hole.style.backgroundImage = "url('../../assets/mole_hit.png')";

      // Reset after delay
      setTimeout(() => {
        hole.classList.remove('active');
        hole.style.backgroundImage = "url('../../assets/mole.png')";
        activeHole = null;
      }, 300);
    }
  });
});

showMole();
1