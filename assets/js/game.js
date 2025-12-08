const cardData = ["🍎","🐶","🚗","🌙","⭐","🎵"];

const gameBoard = document.getElementById("game-board");
const difficultySelect = document.getElementById("difficulty");
const movesDisplay = document.getElementById("moves");
const matchesDisplay = document.getElementById("matches");
const winMessage = document.getElementById("win-message");
const bestEasyDisplay = document.getElementById("best-easy");
const bestHardDisplay = document.getElementById("best-hard");
const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("start-game");
const resetBtn = document.getElementById("reset-game");

let gridRows = 0;
let gridCols = 0;
let cardArray = [];
let firstCard = null;
let secondCard = null;
let moves = 0;
let matches = 0;
let lockBoard = false;

let timer = 0;
let timerInterval = null;

let bestEasy = localStorage.getItem("best_easy") || "-";
let bestHard = localStorage.getItem("best_hard") || "-";

bestEasyDisplay.textContent = bestEasy;
bestHardDisplay.textContent = bestHard;
timerDisplay.textContent = "0";

function startTimer() {
    clearInterval(timerInterval);
    timer = 0;
    timerDisplay.textContent = "0";
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function setDifficulty() {
    const level = difficultySelect.value;
    if (level === "easy") { gridRows = 3; gridCols = 4; }
    else { gridRows = 4; gridCols = 6; }
}

function generateCards() {
    const totalCards = gridRows * gridCols;
    const pick = totalCards / 2;
    const selected = cardData.slice(0, pick);
    cardArray = [...selected, ...selected];
    cardArray.sort(() => Math.random() - 0.5);
}

function buildBoard() {
    gameBoard.innerHTML = "";
    gameBoard.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    cardArray.forEach((item, i) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = item;
        card.dataset.index = i;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
            </div>`;
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}

function updateStats() {
    movesDisplay.textContent = moves;
    matchesDisplay.textContent = matches;
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains("matched")) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    const match = firstCard.dataset.value === secondCard.dataset.value;
    if (match) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matches++;
        updateStats();
        resetFlipped();
        if (matches === cardArray.length / 2) winGame();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetFlipped();
        }, 1000);
    }
}

function resetFlipped() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function winGame() {
    stopTimer();
    winMessage.textContent = "🎉 Laimėjote!";
    const level = difficultySelect.value;
    if (level === "easy") {
        if (bestEasy === "-" || moves < bestEasy) {
            bestEasy = moves;
            localStorage.setItem("best_easy", moves);
            bestEasyDisplay.textContent = moves;
        }
    } else {
        if (bestHard === "-" || moves < bestHard) {
            bestHard = moves;
            localStorage.setItem("best_hard", moves);
            bestHardDisplay.textContent = moves;
        }
    }
}

function startGame() {
    stopTimer();
    winMessage.textContent = "";
    moves = 0;
    matches = 0;
    updateStats();
    setDifficulty();
    generateCards();
    buildBoard();
    startTimer();
}

function resetGame() {
    startGame();
}

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", startGame);
