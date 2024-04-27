let gameStarted = false;

function generateRandomNumber() {
    return Math.floor(Math.random() * 25) + 1;
}

function initializeBoard(boardId) {
    const board = document.getElementById(boardId);
    board.innerHTML = '';

    const numbers = [];
    while (numbers.length < 25) {
        const randomNumber = generateRandomNumber();
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = numbers[i];
        board.appendChild(cell);
    }
}

function markNumber(boardId, number) {
    const board = document.getElementById(boardId);
    const cells = board.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (cell.textContent === number && !cell.classList.contains('bingo')) {
            cell.classList.add('marked');
            cell.removeEventListener('click', cellClickHandler);
            playClickSound(); // Play click sound when cell is marked
        }
    });
    markNumberOnOtherBoard(boardId, number);
    if (checkForLine(boardId)) {
        endGame();
    } else {
        switchPlayer(boardId);
    }
}

function markNumberOnOtherBoard(currentBoardId, number) {
    const otherBoardId = currentBoardId === 'player1Board' ? 'player2Board' : 'player1Board';
    const otherBoard = document.getElementById(otherBoardId);
    const cells = otherBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (cell.textContent === number && !cell.classList.contains('bingo')) {
            cell.classList.add('marked');
            cell.removeEventListener('click', cellClickHandler);
        }
    });
}

let playerNames = ['Player 1', 'Player 2'];
let currentPlayer = 0;

function checkForLine(boardId) {
    const playerName = playerNames[currentPlayer];
    const board = document.getElementById(boardId);
    const cells = board.querySelectorAll('.bingo-board .cell');
    const numRows = 5;
    const numCols = 5;
    let totalLines = 0;

    // Check rows
    for (let i = 0; i < numRows; i++) {
        const start = i * numCols;
        const row = Array.from(cells).slice(start, start + numCols);
        if (row.every(cell => cell.classList.contains('marked'))) {
            totalLines++;
        }
    }

    // Check columns
    for (let i = 0; i < numCols; i++) {
        const col = [];
        for (let j = 0; j < numRows; j++) {
            col.push(cells[i + j * numCols]);
        }
        if (col.every(cell => cell.classList.contains('marked'))) {
            totalLines++;
        }
    }

    // Check diagonals
    const diagonal1 = [cells[0], cells[6], cells[12], cells[18], cells[24]];
    const diagonal2 = [cells[4], cells[8], cells[12], cells[14], cells[18]];
    if (diagonal1.every(cell => cell.classList.contains('marked'))) {
        totalLines++;
    }
    if (diagonal2.every(cell => cell.classList.contains('marked'))) {
        totalLines++;
    }

    // Check total lines for winning condition
    if (totalLines >= 5) {
        showWinningMessage(playerName);
        return true;
    }

    currentPlayer = (currentPlayer + 1) % playerNames.length;
    return false;
}

function showWinningMessage(playerName) {
    playWinningSound(); // Play winning sound before showing the message
    const winnerNameElement = document.getElementById('winnerName');
    winnerNameElement.textContent = `${playerName}, you are the winner!`;
    document.getElementById('winnerPopup').style.display = 'block';

    // Attach event listeners to "Close" and "Play Again" buttons
    document.getElementById('closePopupButton').addEventListener('click', () => {
        document.getElementById('winnerPopup').style.display = 'none';
    });

    document.getElementById('playAgainButton').addEventListener('click', () => {
        document.getElementById('winnerPopup').style.display = 'none';
        initializeBoard('player1Board');
        initializeBoard('player2Board');
        gameStarted = true;
        switchPlayer('player2Board');
    });
}

function switchPlayer(currentBoardId) {
    const currentPlayerBoard = document.getElementById(currentBoardId);
    const otherBoardId = currentBoardId === 'player1Board' ? 'player2Board' : 'player1Board';
    const otherPlayerBoard = document.getElementById(otherBoardId);

    document.querySelectorAll('.bingo-board').forEach(board => {
        board.classList.remove('current-player');
    });

    otherPlayerBoard.classList.add('current-player');

    document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', cellClickHandler));

    otherPlayerBoard.querySelectorAll('.cell').forEach(cell => {
        if (!cell.classList.contains('marked')) {
            cell.addEventListener('click', cellClickHandler);
        }
    });
}

function cellClickHandler(event) {
    if (!gameStarted) {
        return;
    }

    const number = event.target.textContent;
    const boardId = event.currentTarget.parentElement.id;

    // Check if it's the current player's turn
    const currentPlayerBoard = document.querySelector('.current-player');
    if (currentPlayerBoard.id !== boardId) {
        return; // Exit the function if it's not the current player's turn
    }

    // Check if the cell is clickable (not already marked)
    if (!event.target.classList.contains('marked')) {
        markNumber(boardId, number);
    }
}

function playClickSound() {
    document.getElementById("clickSound").play();
}

function playWinningSound() {
    document.getElementById("winningSound").play();
}

function disableCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.removeEventListener('click', cellClickHandler));
}

function endGame() {
    gameStarted = false; // Reset game state
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('marked');
        cell.addEventListener('click', cellClickHandler); // Re-enable cells for clicking
    });
    document.getElementById('startButton').style.display = 'inline'; // Show start button
    document.getElementById('restartButton').style.display = 'none'; // Hide restart button
    document.getElementById('winnerPopup').style.display = 'none'; // Hide winner popup
    document.getElementById('winnerMessage').textContent = ''; // Clear winner message
}

document.getElementById('startButton').addEventListener('click', () => {
    initializeBoard('player1Board');
    initializeBoard('player2Board');
    gameStarted = true;
    document.getElementById('startButton').remove(); // Remove the start button
    document.getElementById('restartButton').remove(); // Remove the restart button
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', cellClickHandler);
    });
    switchPlayer('player2Board');
});

document.getElementById('restartButton').addEventListener('click', () => {
    endGame(); // Restart the game
});

// Close the// Close the winning pop-up when the "Close" button is clicked
document.getElementById('closePopupButton').addEventListener('click', () => {
    document.getElementById('winnerPopup').style.display = 'none';
});

// Restart the game when the "Play Again" button is clicked
document.getElementById('playAgainButton').addEventListener('click', () => {
    document.getElementById('winnerPopup').style.display = 'none';
    initializeBoard('player1Board');
    initializeBoard('player2Board');
    gameStarted = true;
    switchPlayer('player2Board');
});