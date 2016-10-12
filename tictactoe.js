console.log('its working');

// Create empty board with the specified number of grids
function createBoard(gridNumber) {
  var board = [];
  for (var row = 0; row < gridNumber; row++) {
    board.push('');
  }
  return board;
}

var gameBoard = createBoard(9);

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
function populate(board, key, index) {
  board[index] = key;
}

// Sample board to test out initial code
var sampleBoard = [
  'o','x','x',
  'x','o','x',
  'x','o','o'
];

function match(board, key, index) {
  return key === board[index];
}

// Winning condition
function checkWin(board, key) {
  var rowWin = (match(board,key,0) && match(board,key,1) && match(board,key,2)) ||
  (match(board,key,3) && match(board,key,4) && match(board,key,5)) ||
  (match(board,key,6) && match(board,key,7) && match(board,key,8));

  var columnWIn = (match(board,key,0) && match(board,key,3) && match(board,key,6)) ||
  (match(board,key,1) && match(board,key,4) && match(board,key,7)) ||
  (match(board,key,2) && match(board,key,5) && match(board,key,8));

  var diagWin = (match(board,key,0) && match(board,key,4) && match(board,key,8)) ||
  (match(board,key,6) && match(board,key,4) && match(board,key,2));

  return rowWin || columnWIn || diagWin;
}

// Draw condition
function checkDraw(board) {
  for (var i = 0; i < board.length; i++) {
    if (board[i] === '') {
      return false;
    }
  }
  return true;
}

// Function to play the game in the console
function play(board, key, index) {
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

function resetGame(board) {
  for (var i = 0; i < board.length; i++) {
    board[i] = '';
  }
  gameEnds = false;
  currentPlayer = 'X';
  $('.grid').text('');
  $('#result').text('');
  $('#result').css({"display":"none"});
  $('#turn').text(currentPlayer + ' turn');
}

//----------------------------------------
//JQuery

var currentPlayer = 'X';
var gameEnds = false;

$('.grid').on('click',function(event) {
  if (!gameEnds) {
    var index = $(event.target).index();
    if (gameBoard[index] === ''){
      $(event.target).text(currentPlayer);
      $(event.target).css({fontSize: "0vw"});
      $(event.target).animate({fontSize: "6vw"});
      populate(gameBoard,currentPlayer,index);
      if (checkWin(gameBoard,currentPlayer)) {
        gameEnds = true;
        console.log(currentPlayer + ' wins!');
        $('#result').text(currentPlayer + ' wins!').slideDown();;
      } else if (checkDraw(gameBoard)) {
        gameEnds = true;
        console.log('Draw');
        $('#result').text('Draw!').slideDown();;
      }
      switchPlayer(currentPlayer);
      $('#turn').text(currentPlayer + ' turn');
    }
  }
  if (gameEnds) {
    $('#turn').text('');
  }
})

$('#reset-btn').on('click',function(){
  resetGame(gameBoard);
});
