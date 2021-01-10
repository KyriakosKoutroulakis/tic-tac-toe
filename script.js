const cells =document.querySelectorAll('.cell');

const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

let origBoard;

function startGame() {
  document.querySelector('.endgame').style.display = 'none';
  origBoard = Array.from(Array(9).keys());

  for(cell of cells) {
    cell.innerText = '';
    cell.style.removeProperty('background-color');
    cell.addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, humanPlayer);
    if (!checkWin(origBoard, humanPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  console.log({ player, squareId });
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;

  let gameWon = checkWin(origBoard, player);

  if (gameWon) gameOver(gameWon); 
}

function checkWin(board, player) {
  let gameWon = null;
  let plays = board.reduce((a, e, i) => 
    (e === player) ? a.concat(i) : a, []);
  
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i=0; i<cells.length; i++) {
      cells[i].style.backgroundColor = 'lightgrey';
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner('Tie Game!');
    return true;
  }
  return false;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
      gameWon.player == humanPlayer ? 'lightgreen' : 'red';
  }

  for (let i=0; i<cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == humanPlayer ? 'You win!' : 'You lose.');
}

function declareWinner(winner) {
  document.querySelector('.endgame').style.display = 'block';
  document.querySelector('.endgame p').innerText = winner;
}

function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
  return minmax(origBoard, aiPlayer).index;
}

function minmax(newBoard, player) {
  let availableSpots = emptySquares();

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 }; 
  }

  let moves = [];
  for(let i=0; i<availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player == aiPlayer) {
      let result = minmax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      let result = minmax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for(let i=0; i<moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for(let i=0; i<moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

startGame();
