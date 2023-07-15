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
        _gameBoard[row][tile] = currentPlayer.retrieveMarker();
    }

    //initialize gameboard retrieval
    //note: this is created such that the user won't directly mod the board
    const retrieveBoard = () => _gameBoard.map(row => [...row]);

    //return methods
    return{retrieveBoard,
    mark: function(row, tile){
        _mark(row, tile, GameController.retrievePlayer());
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

    const startRound = ()=>{
        console.log(`${currentPlayer.retrieveName()}, it's your turn!`);
        console.log(`Use GameController.playRound(row, tile) to place your marker!`);
        console.log(Gameboard.retrieveBoard());
    }

    const playRound = (row, tile) =>{
        Gameboard.mark(row, tile);
        switchPlayer();
        startRound();
    }
    startRound();

    return({retrievePlayer, playRound});

})();