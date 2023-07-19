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
        if(_gameBoard[row][tile] !== ""){
          throw new Error ("Tile is taken!");
          return ;
        }

        // fail-safe just in case a user attempts 
        //to add out-of bounds
        else if(row > 2 || tile > 2){ 
          throw new Error ("Tile or row is out of bounds!");
          return ;
        }

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
      return checkHorizontalWin(gameBoard, currentMarker) || checkVerticalWin(gameBoard, currentMarker);
    };

    const checkHorizontalWin = (gameBoard, currentMarker) => {
      // initialize counts
      let horizCount = 0;
  
      // check for both vertical and horizontal wins
      for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard.length; j++) {
          if (gameBoard[i][j] === currentMarker) horizCount++;
        }
        if (horizCount >= 3) return true;

        //reset counts
        horizCount = 0;
      }
      // return false if there are no non-diagonal wins
      return false;
    };

    const checkVerticalWin = (gameBoard, currentMarker) => {
      // initialize counts
      let vertCount = 0;
  
      // check for vertical wins
      for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard.length; j++) {
          if (gameBoard[j][i] === currentMarker) vertCount++;
        }
        if (vertCount >= 3) return true;

        //reset counts
        vertCount = 0;
      }
      // return false if there are no non-diagonal wins
      return false;
    };
    
    /*
    Methods for deconstructed diagonal wins
    Note: These were deconstructed for dom manipulation purposes
    */
    const checkDiagonalWin = (gameBoard, currentMarker) => {
      let diagonalCount = 0;

      //check for diagonal wins in both directions
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i][i] === currentMarker) diagonalCount++;
      }
      return diagonalCount === 3;
    };

    const checkReverseDiagonalWin = (gameBoard, currentMarker) =>{
      let reverseDiagonalCount = 0;

      //check for diagonal wins in both directions
      for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i][gameBoard.length - 1 - i] === currentMarker) reverseDiagonalCount++;
      }
      return reverseDiagonalCount === 3;
    }
    //

    const checkDiagonalWins = (gameBoard, currentMarker) =>{
      return checkDiagonalWin(gameBoard, currentMarker) || checkReverseDiagonalWin(gameBoard, currentMarker);
    }

    // check for wins in both directions
    const checkWin = (gameBoard, currentMarker) => {
      return checkDiagonalWins(gameBoard, currentMarker) || checkNonDiagonalWins(gameBoard, currentMarker);
    };

    //check for tie
    const checkDraw = (gameBoard) => {
        // Check if all rows have no available spaces
        return gameBoard.every(row => row.every(tile => tile !== ""));
      };
    return {
      // generic methods
      checkWin, checkDraw, 

      // deconstructed methods for dom manipulation
      checkVerticalWin, 
      checkHorizontalWin, checkDiagonalWin, checkReverseDiagonalWin};
  })();
  
  //create dom functionality
  const DomBoard = (function(){
    //create function for linking each dom element to the board
    const domBoard = document.querySelector('.gameboard');
    const generateBoard = () =>{

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


                // Increment tile
                tile++;
            
        }
    }

    // initialize generation
    generateBoard();

    /*
      Updates row based on player icon
      @params
      row - the grid row
      tile - the grid tile
      icon - the board icon
      @updates HTML tile
    */
    const updateBoard = (row, tile, icon) =>{
      // use spread operator to get html tiles based on the row
      const rowArr = [...document.querySelectorAll(`[data-row="${row}"]`)];

      // get the tile based on the row array
      const domTile = rowArr[tile];

      // create new image element
      const img = document.createElement("img");

      // add image
      // Note: The ${icon} is used since the files were named based on that
      // This allows for easy selection
      img.setAttribute("src",`media/${icon}.svg`);

      // Append child
      domTile.appendChild(img);

      

      const currentPlayer = GameController.retrievePlayer();
      
      //final check for win/draw
       win = GameLogic.checkWin(Gameboard.retrieveBoard(), currentPlayer.retrieveMarker());
       draw = GameLogic.checkDraw(Gameboard.retrieveBoard());
       if(win){
        const horizontalWin = GameLogic.checkHorizontalWin(Gameboard.retrieveBoard(), currentPlayer.retrieveMarker());
        const vertWin = GameLogic.checkVerticalWin(Gameboard.retrieveBoard(), currentPlayer.retrieveMarker());
        const diagWin = GameLogic.checkDiagonalWin(Gameboard.retrieveBoard(), currentPlayer.retrieveMarker());
        const revDiagWin = GameLogic.checkReverseDiagonalWin(Gameboard.retrieveBoard(), currentPlayer.retrieveMarker());
        crossBoard(row, tile, vertWin, horizontalWin, diagWin, revDiagWin);
       }
       updateAnnouncer(win, draw);
    }

       /*
     Crosses board based on win
     @params
      winningRow - the winning/final row
      winningTile - the winning/final tile

     @updates the HTML board
    */
   const crossBoard = (winningRow, winningTile, verticalWin, horizontalWin, diagonalWin, reverseDiagonalWin) =>{
    // grab rows and columns/tiles
    // Note: This will help us for the diagonal win handling
     const domColumns = [...document.querySelectorAll(`[data-tile="${winningTile}"]`)];
     const domRows = [...document.querySelectorAll(`[data-row="${winningRow}"]`)];

     for(let i =0; i< domColumns.length; i++){
      // initialize markdown / override variable
      const override = document.createElement("div");

      // add override class. This will be necessary to mark over the elements.
      override.classList.add("override");
      //check if vertical or horizontal win
        if(verticalWin){
          // add the vertical modification to rotate mark
          override.classList.add("vertical");
          
          // Append override the winning column
          domColumns[i].appendChild(override);
        }else if(horizontalWin){
          domRows[i].appendChild(override);
        }

        // check if diagonal win or reverse Diagonal win
        if(diagonalWin || reverseDiagonalWin){
          // create temporary row
          //Note: The goal is to grab rows that also have a similar tile
          //E.g row 0, column0, row1, column1, etc..
          //i is used here since we have the same number of rows and columns 
          const tempRow = [...document.querySelectorAll(`[data-tile="${i}"]`)];
          //if its a diagonal win, add diagonal class
          if(diagonalWin){
            override.classList.add("diagonal");
            tempRow[i].appendChild(override);
          }else if(reverseDiagonalWin){
            override.classList.add("reverse-diagonal");
            tempRow[tempRow.length - i - 1].appendChild(override);
            
          }

        }
     }
    
   }

    /*
     Updates announcer based on who's playing
     @updates the board
    */
   const updateAnnouncer = (win, draw) => {
    // retrieve the current player
    const player = GameController.retrievePlayer();

    // get the announcer element
    const announcer = document.querySelector(".announcer");

    //grab span (will be useful for changing text content without affecting what's around)
    const winner = document.querySelector("#winner");

    // select image attribute
    const img = announcer.querySelector("img");

    // set image attribute to current player
    img.setAttribute("src",`media/${player.retrieveMarker()}.svg`);

    //if win
    if(win){
      //keep the image, set the text content to indicate win
      winner.textContent = "wins!";
    }else if(draw){
      //use announcer instead of winner selector
      //this will reset the entire content and remove the icon
      announcer.textContent = "Draw";
    }

   }

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
      updateBoard(row, tile, currentPlayer.retrieveMarker());

      

      
      
    }

    //add event listener
    domBoard.addEventListener(`click`, domMark)



    
   
  })();