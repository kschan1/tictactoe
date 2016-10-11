console.log('its working');

// Create empty board with the specified number of grids
function createBoard(gridNumber) {
  var board = [];
  for (var row = 0; row < gridNumber; row++) {
    board.push('');
  }
  return board;
}

var board = createBoard(9);

// Function to console log 1D board as 2D
function printBoard(board) {
  var boardDisplay = '';
  for (var i = 0; i < board.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      boardDisplay += '\n';
      boardDisplay += board[i];
    }
    else {
      boardDisplay += board[i];
    }
  }
  console.log(boardDisplay);
}

// Function to change board element of given index
function populate(key, index) {
  board[index] = key;
}

// Sample board to test out initial code
var sampleBoard = [
  'o','x','x',
  'x','o','x',
  'x','o','o'
];

function match(key, index) {
  return key === board[index];
}

// Winning condition
function checkWin(key) {
  var rowWin = (match(key,0) && match(key,1) && match(key,2)) ||
  (match(key,3) && match(key,4) && match(key,5)) ||
  (match(key,6) && match(key,7) && match(key,8));

  var columnWIn = (match(key,0) && match(key,3) && match(key,6)) ||
  (match(key,1) && match(key,4) && match(key,7)) ||
  (match(key,2) && match(key,5) && match(key,8));

  var diagWin = (match(key,0) && match(key,4) && match(key,8)) ||
  (match(key,6) && match(key,4) && match(key,2));

  return rowWin || columnWIn || diagWin;
}

// Draw condition
function checkDraw() {
  for (var i = 0; i < board.length; i++) {
    if (board[i] === '') {
      return false;
    }
  }
  return true;
}

// Function to play the game in the console
function play(key, index) {
  populate(key, index);
  if (checkWin(key)) {
    console.log(key + ' Wins!');
  }
}

// Player switch function
function switchPlayer(current) {
  if (current === 'O') {
    currentPlayer = 'X';
  } else if (current === 'X') {
    currentPlayer = 'O';
  }
}

//----------------------------------------
//JQuery

var currentPlayer = 'X';
var gameEnds = false;

$('.grid').on('click',function(event){
  if (!gameEnds) {
    var index = $(event.target).index();
    if (board[index] === ''){
      $(event.target).text(currentPlayer);
      populate(currentPlayer,index);
      if (checkWin(currentPlayer)) {
        gameEnds = true;
        console.log(currentPlayer + ' wins!');
        $('#result').text(currentPlayer + ' wins!');
      } else if (checkDraw()) {
        gameEnds = true;
        console.log('Draw');
        $('#result').text('Draw!');
      }
      switchPlayer(currentPlayer);
      $('#turn').text(currentPlayer + ' turn');
    }
  }
  if (gameEnds) {
    $('#turn').text('');
  }
})
