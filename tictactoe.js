(function(){

  // Variables for players' token
  var playerOne = 'X';
  var playerTwo = 'O';

  // Variables for player lives
  var startingLives = 3;
  var playerOneLives = startingLives;
  var playerTwoLives = startingLives;

  // Variables for storing starting player and current player
  // Initialised to player one
  var startingPlayer = playerOne;
  var currentPlayer = playerOne;

  // Variable for storing game state
  var roundEnds = false;
  var gameEnds = false;


  // Factory to create a tictactoe board
  function makeBoard() {
    var board = ['','','','','','','','',''];
    //  -----
    // |0|1|2|
    // |3|4|5|  Representation of the indexing for board elements
    // |6|7|8|
    //  -----

    function match(player, index) {
      return player === board[index];
    }

    return {
      // Method to change board element of given index
      // true is returned if board is populated successfully
      populate: function(player, index) {
        if (board[index] === '') {
          board[index] = player;
          return true;
        } else {
          return false;
        }
      },

      // Method to check winning condition exists for player
      // true is returned if any winning combination exists
      checkWin: function(player) {
        var rowWin = (match(player, 0) && match(player, 1) && match(player, 2)) ||
        (match(player, 3) && match(player, 4) && match(player, 5)) ||
        (match(player, 6) && match(player, 7) && match(player, 8));

        var columnWin = (match(player,0) && match(player,3) && match(player,6)) ||
        (match(player, 1) && match(player, 4) && match(player, 7)) ||
        (match(player, 2) && match(player, 5) && match(player, 8));

        var diagWin = (match(player, 0) && match(player, 4) && match(player, 8)) ||
        (match(player, 6) && match(player, 4) && match(player, 2));

        return rowWin || columnWin || diagWin;
      },

      // Method to check board has been completely filled
      isFull: function(){
        for (var i = 0; i < board.length; i++) {
          if (board[i] === '') {
            return false;
          }
        }
        return true;
      },

      // Function to return a copy of the board
      getBoard: function(){
        return board.slice();
      },

      // Function to reset all board element to ''
      reset: function(){
        for (var i = 0; i < board.length; i++) {
          board[i] = '';
        }
      }
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

  // Function to check if player lives reaches 0
  // true is returned if live reaches 0
  function checkGameEnds() {
    if (playerOneLives === 0 || playerTwoLives === 0) {
      return true;
    } else {
      return false;
    }
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
  function resetRoundData() {
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

  var $instructionDiv = $('#instruction');
  var $resultDiv = $('#result');
  var $p1Token = $('#p1-token');
  var $p2Token = $('#p2-token');
  var $p1Lives = $('.p1-lives');
  var $p2Lives = $('.p2-lives');
  var $square = $('.square');

  function updateLivesDisplay(player, animation) {
    if (player === playerOne) {
      $p1Lives.text(playerOneLives);
      $p1Lives.animateCss(animation);
    } else if (player === playerTwo) {
      $p2Lives.text(playerTwoLives);
      $p2Lives.animateCss(animation);
    }
  }

  function updateResultDisplay(string, animation) {
    $resultDiv.text(string);
    $resultDiv.animateCss(animation);
  }

  function updateSquareDisplay(square, player) {
    square.text(player);
    square.css({fontSize: "0em"});
    square.animate({fontSize: "4em"});
  }

  function resetGameDisplay() {
    $square.text('');
    $resultDiv.text('');
    $instructionDiv.text(currentPlayer + ' turn');
  }

  //---------------------------------------------

  // Main game function
  function runGame(event) {
    if (roundEnds) {
      // This if statement is to enable user to reset game/round by clicking on
      // the board after the game/round has ended

      // If game has ended, reset player's lives and display
      if (gameEnds) {
        resetGameData();
        resetRoundData();
        gameBoard.reset();
        updateLivesDisplay(playerOne, 'flash');
        updateLivesDisplay(playerTwo, 'flash');
        resetGameDisplay();

        // If round has ended but game has not, reset board data and display only
      } else if (!gameEnds) {
        resetRoundData();
        gameBoard.reset();
        resetGameDisplay();
      }

    } else if (!roundEnds) {
      // Play game

      // Variables to store the clicked square and it's index
      var $selectedSquare = $(event.target);
      var selectedSquareIndex = $selectedSquare.index();

      var resultMessage = '';

      // Update board data and display if it is an empty square
      if (gameBoard.populate(currentPlayer, selectedSquareIndex)) {
        updateSquareDisplay($selectedSquare, currentPlayer);

        // Update tally data and display if player wins
        if (gameBoard.checkWin(currentPlayer)) {
          roundEnds = true;
          var opponentPlayer = opponent(currentPlayer);
          reduceLive(opponentPlayer);
          updateLivesDisplay(opponentPlayer, 'fadeOut');

          if (checkGameEnds()) {
            gameEnds = true;
            resultMessage = currentPlayer + ' wins the game!';
          } else {
            resultMessage = currentPlayer + ' wins!';
          }
          updateResultDisplay(resultMessage, 'bounceIn');

          // Update result data and display if draw
        } else if (gameBoard.isFull()) {
          roundEnds = true;
          resultMessage = 'Draw!';
          updateResultDisplay(resultMessage, 'bounce');

          // Switch player if game is still continuing
        } else {
          switchPlayer(currentPlayer);
          $instructionDiv.text(currentPlayer + ' turn');
        }
      }

      // Change player's turn display if game has ended
      if (roundEnds) {
        if (gameEnds) {
          $instructionDiv.text('Click board to start over');
        }
        else {
          $instructionDiv.text('Click board for next round');
        }
      }

    }

  }

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
  // Easter egg - Konami code
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
      increase30Lives(currentPlayer);
      updateLivesDisplay(currentPlayer,'flash');
      konamiIndex = 0;
      enteredKeys = [];
    }
  });

  // Function to increase player's live by 30
  function increase30Lives(player) {
    if (!roundEnds) {
      if (player === playerOne) {
        playerOneLives += 30;
      } else if (player === playerTwo) {
        playerTwoLives += 30;
      }
    }
  }

  //---------------------------------------------------
  // Initiate display
  $p1Token.text(playerOne);
  $p2Token.text(playerTwo);
  $p1Lives.text(playerOneLives);
  $p2Lives.text(playerTwoLives);
  $instructionDiv.text(currentPlayer + ' turn');

  // Create board and store to variable gameBoard
  var gameBoard = makeBoard();

  // Event listener on squares that will run the game
  $square.on('click',runGame);

})();
