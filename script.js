//intialize player object
const Player = (name, marker) =>{
    /*
    initialize retrieveName and retrieveMarker
    Note: These methods were created to avoid direct modification of the name and marker
    */ 
    const retrieveName = () => name;
    const retrieveMarker = () => marker;
    return({retrieveName, retrieveMarker});
}

//initialize gameboard module
const Gameboard = (function(){
    //initialize 2d array
    const _gameBoard = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];

    /*
    initialize mark function
    note: this will be a private method later 
    (for now will be returned for testing purposes)
    */
    const _mark = (row, tile, currentPlayer) => {
        // if it's taken, stop execution
        if(_gameBoard[row][tile] !== "") return ;

        // fail-safe just in case a user attempts 
        //to add out-of bounds
        else if(row > 2 && tile > 2) return ;

        // place marker
        _gameBoard[row][tile] = currentPlayer.retrieveMarker();
        return true;
    }

    //initialize gameboard retrieval
    //note: this is created such that the user won't directly mod the board
    const retrieveBoard = () => _gameBoard.map(row => [...row]);

    //return methods
    return{retrieveBoard,
    mark: function(row, tile){
        return _mark(row, tile, GameController.retrievePlayer());
    }};
})();

const GameController = (function(){
    // initialize players
    const playerOne = Player("PlayerOne","X");
    const playerTwo = Player("PlayerTwo", "O");

    //initialize array for current players
    const players = [playerOne, playerTwo];
    let currentPlayer = players[0];

    //initialize variables for player handling
    const switchPlayer = () => currentPlayer = currentPlayer == players[0] ? players[1] : players[0];
    const retrievePlayer = () => currentPlayer;

    //starts round
    const startRound = ()=>{
        //display current player and tiles
        console.log(`${currentPlayer.retrieveName()}, it's your turn!`);
        console.log(`Use GameController.playRound(row, tile) to place your marker!`);
        console.log(Gameboard.retrieveBoard());
    }

    //play round by marking the tile
    const playRound = (row, tile) =>{
        const marked = Gameboard.mark(row, tile);

        // check for wins
        let win = GameLogic.checkWin(Gameboard.retrieveBoard(), currentPlayer.retrieveMarker());
        let draw = GameLogic.checkDraw(Gameboard.retrieveBoard());
        if(win){
            //announce wins and break away from the function
            console.log(`${retrievePlayer().retrieveMarker()} wins!`);
            console.log(Gameboard.retrieveBoard());
            return ;
        }
        if(draw){
            console.log("Draw");
            return ;
        }

        if(marked){
          //switch player and restart round
          switchPlayer();
          startRound();
        }
    }
    // initalize round start
    startRound();

    return({retrievePlayer, playRound});

})();

// Create module for game logic that handles wins
const GameLogic = (() => {
    const checkNonDiagonalWins = (gameBoard, currentMarker) => {
      // initialize counts
      let vertCount = 0;
      let horizCount = 0;
  
      // check for both vertical and horizontal wins
      for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard.length; j++) {
          if (gameBoard[i][j] === currentMarker) horizCount++;
          if (gameBoard[j][i] === currentMarker) vertCount++;
        }
        if (horizCount >= 3 || vertCount >= 3) return true;

        //reset counts
        horizCount = 0;
        vertCount = 0;
      }
      // return false if there are no non-diagonal wins
      return false;
    };

    const checkDiagonalWins = (gameBoard, currentMarker) => {
      let diagonalCount = 0;
      let reverseDiagonalCount = 0;

      //check for diagonal wins in both directions
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i][i] === currentMarker) diagonalCount++;
        if (gameBoard[i][gameBoard.length - 1 - i] === currentMarker) reverseDiagonalCount++;
      }
      return diagonalCount === 3 || reverseDiagonalCount === 3;
    };

    // check for wins in both directions
    const checkWin = (gameBoard, currentMarker) => {
      return checkDiagonalWins(gameBoard, currentMarker) || checkNonDiagonalWins(gameBoard, currentMarker);
    };

    //check for tie
    const checkDraw = (gameBoard) => {
        // Check if all rows have no available spaces
        return gameBoard.every(row => row.every(tile => tile !== ""));
      };
    return {checkWin, checkDraw};
  })();
  
  //create dom functionality
  const DomBoard = (function(){
    //create function for linking each dom element to the board
    const domBoard = document.querySelector('.gameboard');
    const generateBoard = () =>{
      //retrieve gameboard
      const gameBoard = Gameboard.retrieveBoard();

        // Initialize row and tile variables
        let row = 0;
        let tile = 0;

        // Create a for loop to iterate over the board tiles in the DOM
        for(let i =0; i < domBoard.children.length; i++){

            // Reset tile and increase row once i is divisble by 3
            if(i !== 0 && i %3 == 0){
                tile = 0;
                row++;
            }
                // Create data attributes
                domBoard.children[i].dataset.tile = tile;
                domBoard.children[i].dataset.row = row;

                // Get textcontent for boards if need be
                domBoard.children[i].textContent = gameBoard[row][tile];


                // Increment tile
                tile++;
            
        }
    }

    // initialize generation
    generateBoard();

    // read board and updates accordingly
    function domMark(e){
      // check for win or draw
      const currentPlayer = GameController.retrievePlayer();
      let win = GameLogic.checkWin(Gameboard.retrieveBoard(), currentPlayer.retrieveMarker());
      let draw = GameLogic.checkDraw(Gameboard.retrieveBoard());

      //stop the game if a win or draw is detected
      if(win || draw){return ;}

      // retrieve respective tile and row
      const tile = e.target.dataset.tile;
      const row = e.target.dataset.row;

      // play round
      GameController.playRound(row, tile);

      // regenerate board
      generateBoard();
      
    }

    //add event listener
    domBoard.addEventListener(`click`, domMark)



    
   
  })();