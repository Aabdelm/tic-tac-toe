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
    const gameBoard = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];

    /*
    initialize mark function
    note: this will be a private method later 
    (for now will be returned for testing purposes)
    */
    const mark = (row, tile) => {
        gameBoard[row][tile] = "test";
    }

    //initialize gameboard retrieval
    //note: this is created such that the user won't directly mod the board
    const retrieveBoard = () => console.log(gameBoard);
    return{mark, retrieveBoard};
})();