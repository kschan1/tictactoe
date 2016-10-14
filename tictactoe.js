
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

// Variables for player lives
var startingLives = 3
var playerOneLives = startingLives;
var playerTwoLives = startingLives;

// Variables for storing starting player and current player
// Initialised to player one
var startingPlayer = playerOne;
var currentPlayer = playerOne;

// Variable for storing game state
var gameEnds = false;
var roundEnds = false;

// Initiate lives display
$('.p1-lives').text(playerOneLives);
$('.p2-lives').text(playerTwoLives);

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

// Function to check if player lives reaches 0
// true is returned if live reaches 0
function checkGameEnds() {
  if (playerOneLives === 0 || playerTwoLives === 0) {
    return true;
  } else {
    return false;
  }
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

// Function to reduce player live for player
function reduceLive(player) {
  if (player === playerOne) {
    playerOneLives -= 1;
  }
  else if (player === playerTwo) {
    playerTwoLives -= 1;
  }
}

// Function to reset board's data and switch starting player
function resetRoundData(board) {
  for (var i = 0; i < board.length; i++) {
    board[i] = '';
  }
  roundEnds = false;
  startingPlayer = switchPlayer(startingPlayer);
  currentPlayer = startingPlayer;
}

// Function to reset game data
function resetGameData() {
  playerOneLives = startingLives;
  playerTwoLives = startingLives;
  gameEnds = false;
}

// Function to return opponent of current player
function opponent(currentPlayer) {
  if (currentPlayer === playerOne) {
    return playerTwo;
  } else if (currentPlayer === playerTwo) {
    return playerOne;
  }
}

//----------------------------------------
//DOM manipulation

// Function to updateLivesDisplay
function updateLivesDisplay(player,animation) {
  if (player === playerOne) {
    $('.p1-lives').text(playerOneLives);
    $('.p1-lives').animateCss(animation);
  } else if (player === playerTwo) {
    $('.p2-lives').text(playerTwoLives);
    $('.p2-lives').animateCss(animation);
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
  $('#turn').text(currentPlayer + ' turn');
}

//---------------------------------------------

// Main game function
$('.grid').on('click',function(event) {
  if (roundEnds) {

    // If game has ended, reset player's lives and display
    if (gameEnds) {
      resetGameData();
      updateLivesDisplay(playerOne,'flash');
      updateLivesDisplay(playerTwo,'flash');
      resetRoundData(gameBoard);
      resetGameDisplay();

    // If round has ended but game has not, reset board data and display only
    } else if (!gameEnds) {
      resetRoundData(gameBoard);
      resetGameDisplay();
    }

  } else if (!roundEnds) {
    // Variable to store the index of the grid that was clicked on
    var index = $(event.target).index();

    // Update board data and display if it is an empty grid
    if (gameBoard[index] === '') {
      populate(gameBoard,currentPlayer,index);
      updateGridDisplay(event.target,currentPlayer);

      // Update tally data and display if player wins
      if (checkWin(gameBoard,currentPlayer)) {
        roundEnds = true;
        var opponentPlayer = opponent(currentPlayer);
        reduceLive(opponentPlayer);
        updateLivesDisplay(opponentPlayer,'fadeOut');

        if (checkGameEnds()) {
          gameEnds = true;
          console.log('entered gameEnds');
          $('#result').text(currentPlayer + ' wins the game!');
        } else {
          console.log('entered roundEnd');
          $('#result').text(currentPlayer + ' wins!');
        }
        $('#result').animateCss('bounceIn');

      // Update result display if draw
      } else if (checkDraw(gameBoard)) {
        roundEnds = true;
        $('#result').text('Draw!')
        $('#result').animateCss('bounce');

      // Switch player if game is still continuing
      } else {
        switchPlayer(currentPlayer);
        $('#turn').text(currentPlayer + ' turn');
      }
    }

    // Change player's turn display if game has ended
    if (roundEnds) {
      if (gameEnds) {
        $('#turn').text('Click board to start over');
      }
      else {
        $('#turn').text('Click board for next round');
      }
    }

  }
});

// Create animateCss method for jQuery that adds and then removes animation class
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

//---------------------------------------------------
// Konami code
var konami = [38,38,40,40,37,39,37,39,66,65];
var enteredKeys = [];
var konamiIndex = 0;

// Function to check if konami code has been entered
$(document).keydown(function(e) {
  if (e.keyCode === konami[konamiIndex]) {
    enteredKeys.push(e.keyCode);
    konamiIndex += 1;
  } else {
    konamiIndex = 0;
    enteredKeys = [];
  }
  if (enteredKeys.length === konami.length) {
    cheatCode(currentPlayer);
    konamiIndex = 0;
    enteredKeys = [];
  }
});

// Function to increase player's live by 30
function cheatCode(player) {
  if (!roundEnds) {
    if (player === playerOne) {
      playerOneLives += 30;
    } else if (player === playerTwo) {
      playerTwoLives += 30;
    }
    updateLivesDisplay(player,'flash');
  }
}
