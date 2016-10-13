console.log('its working');

// Create empty board with the specified number of grids
function createBoard(gridNumber) {
  var board = [];
  for (var row = 0; row < gridNumber; row++) {
    board.push('');
  }
  return board;
}

// Create 1D array board with 9 elements
var gameBoard = createBoard(9);

//  -----
// |0|1|2|
// |3|4|5|  Indexing for game
// |6|7|8|
//  -----

// Variables for players' key
var playerOne = 'X';
var playerTwo = 'O';

// Variables for storing players' win tally
var playerOneWin = 0;
var playerTwoWin = 0;

// Variables for storing starting player and current player
// Initialised to player one
var startingPlayer = playerOne;
var currentPlayer = playerOne;

// Variable for storing game state
var gameEnds = false;

// Function to change board element of given index
function populate(board, player, index) {
  board[index] = player;
}

// Function to check if player occupies the given index location
function match(board, player, index) {
  return player === board[index];
}

// Function to check winning condition
// true is returned if any winning combination exists
function checkWin(board, player) {
  var rowWin = (match(board,player,0) && match(board,player,1) && match(board,player,2)) ||
  (match(board,player,3) && match(board,player,4) && match(board,player,5)) ||
  (match(board,player,6) && match(board,player,7) && match(board,player,8));

  var columnWIn = (match(board,player,0) && match(board,player,3) && match(board,player,6)) ||
  (match(board,player,1) && match(board,player,4) && match(board,player,7)) ||
  (match(board,player,2) && match(board,player,5) && match(board,player,8));

  var diagWin = (match(board,player,0) && match(board,player,4) && match(board,player,8)) ||
  (match(board,player,6) && match(board,player,4) && match(board,player,2));

  return rowWin || columnWIn || diagWin;
}

// Function to check draw condition
// true is returned if board is completely filled with character
function checkDraw(board) {
  for (var i = 0; i < board.length; i++) {
    if (board[i] === '') {
      return false;
    }
  }
  return true;
}

// Function to switch player's turn
function switchPlayer(current) {
  if (current === playerOne) {
    currentPlayer = playerTwo;
  } else if (current === playerTwo) {
    currentPlayer = playerOne;
  }
  return currentPlayer;
}

// Function to increment win tally for player
function tallyWin(player) {
  if (player === playerOne) {
    playerOneWin += 1;
  }
  else if (player === playerTwo) {
    playerTwoWin += 1;
  }
}

// Function to reset game's data
function resetGameData(board) {
  for (var i = 0; i < board.length; i++) {
    board[i] = '';
  }
  gameEnds = false;
  startingPlayer = switchPlayer(startingPlayer);
  currentPlayer = startingPlayer;
}

//----------------------------------------
//DOM update functions

function updateTallyDisplay(player) {
  if (player === playerOne) {
    $('#x-tally').text(playerOneWin);
  } else if (player === playerTwo) {
    $('#o-tally').text(playerTwoWin);
  }
}

function updateGridDisplay(selectedGrid, player) {
  $(selectedGrid).text(player);
  $(selectedGrid).css({fontSize: "0em"});
  $(selectedGrid).animate({fontSize: "4em"});
}

function resetGameDisplay() {
  $('.grid').text('');
  $('#result').text('');
  $('#result').css({"display":"none"});
  $('#turn').text(currentPlayer + ' turn');
}

//---------------------------------------------

// Main game function
$('.grid').on('click',function(event) {
  if (!gameEnds) {
    // Variable to store the index of the grid that was clicked on
    var index = $(event.target).index();

    // Update board data and display if it is an empty grid
    if (gameBoard[index] === '') {
      populate(gameBoard,currentPlayer,index);
      updateGridDisplay(event.target,currentPlayer);

      // Update tally data and display if player wins
      if (checkWin(gameBoard,currentPlayer)) {
        gameEnds = true;
        $('#result').text(currentPlayer + ' wins!').slideDown();
        tallyWin(currentPlayer);
        updateTallyDisplay(currentPlayer);

      // Update result display if draw
      } else if (checkDraw(gameBoard)) {
        gameEnds = true;
        $('#result').text('Draw!').slideDown();

      // Switch player if game is still continuing
      } else {
        switchPlayer(currentPlayer);
        $('#turn').text(currentPlayer + ' turn');
      }
    }

    // Remove player's turn display if game has ended
    if (gameEnds) {
      $('#turn').text('');
    }

  }
});

// Reset game when reset button is clicked
$('#reset-btn').on('click',function(){
  resetGameData(gameBoard);
  resetGameDisplay();
});
