//logic error while adding checkWin()




const cards = document.querySelectorAll('.card');
const values = ["😊","😂","😍","😎","🤩","😜","🥳","😇"];
let gameValues = [...values, ...values];
gameValues.sort(() => Math.random() - 0.5);

cards.forEach((card, index) => {
    card.dataset.value = gameValues[index];
    card.querySelector('.card-back').textContent = gameValues[index]; 
});


let firstCard = null;
let secondCard = null;
let lockBoard = false;

cards.forEach(card => {
    card.addEventListener('click', () => {
        if (lockBoard || card.classList.contains('flipped') || card === firstCard) return;

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
        resetSelection();
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
