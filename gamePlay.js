console.log("gamePlay.js");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function popRandomElementFromArray(array) {
    // Check if the array is empty, and return undefined if it is.
    if (array.length === 0) {
      return undefined;
    }
  
    // Generate a random index between 0 (inclusive) and the length of the array (exclusive).
    const randomIndex = Math.floor(Math.random() * array.length);
  
    // Remove the random element from the array and store it in a variable.
    const randomElement = array.splice(randomIndex, 1)[0];
  
    // Return the random element.
    return randomElement;
}

const gameOver= (rootNode)=> {
    const gameOverPanel= document.createElement("div");
    gameOverPanel.setAttribute("id", "gameOverPanel");
    gameOverPanel.innerText= "Game Over";
    rootNode.innerHTML= '';
    rootNode.appendChild(gameOverPanel);
    console.log("gameOver");
}

const gamePlay= async ()=> {
    //////                  //////
    ////// pieces templates //////
    //////                  //////
    const tetrisGridHeight= 20;
    const tetrisGridWidth= 10;
    
    const I_piece=          new TetrisPiece(4, 4, [[0, 1], [1, 1], [2, 1], [3, 1]], [1.5, 1.5], "#42E2B8");
    const L_piece=          new TetrisPiece(3, 3, [[0, 0], [0, 1], [1, 1], [2, 1]], [1, 1]    , "#07004D");
    const REVERSED_L_piece= new TetrisPiece(3, 3, [[0, 1], [1, 1], [2, 1], [2, 0]], [1, 1]    , "#F79824");
    const SQUARE_piece=     new TetrisPiece(2, 2, [[0, 0], [0, 1], [1, 0], [1, 1]], [.5, 0.5] , "#F3DFBF");
    const S_piece=          new TetrisPiece(3, 3, [[0, 1], [1, 1], [1, 0], [2, 0]], [1, 1]    , "#16C172");
    const REVERSED_S_piece= new TetrisPiece(3, 3, [[0, 0], [1, 0], [1, 1], [2, 1]], [1, 1]    , "#FF5E5B");
    const T_piece=          new TetrisPiece(3, 3, [[0, 1], [1, 1], [1, 0], [2, 1]], [1, 1]    , "#735290");
    const possiblePieces= [I_piece, L_piece, REVERSED_L_piece, SQUARE_piece, S_piece, REVERSED_S_piece, T_piece];
    
    const rootNode= document.getElementById("gamePlay");
    const tetrisGrid= new TetrisGrid(tetrisGridHeight, tetrisGridWidth, "#F7CB15", rootNode);
    
    const gameTickMS= 300;
    
    const possiblePiecesCopy= [];
    let currentX= 0;
    let currentY= 0;
    let selectedPiece;

    document.addEventListener("keydown", ()=> {
        const a_keycode= 65;
        const s_keycode= 83;
        const d_keycode= 68;
        const e_keycode= 69;
        const q_keycode= 81;
        const space_keycode= 32;

        switch (event.keyCode){
            case a_keycode:
                if (tetrisGrid.canGoLeft(selectedPiece, currentX, currentY)) currentX--;
                break;
            case s_keycode:
                if (tetrisGrid.canFall(selectedPiece, currentX, currentY)) currentY++;
                break;
            case d_keycode:
                if (tetrisGrid.canGoRight(selectedPiece, currentX, currentY)) currentX++;
                break;
            case e_keycode:
                if (tetrisGrid.canRotate(selectedPiece, currentX, currentY, "clockwise")) selectedPiece.rotate("clockwise");
                break;
            case q_keycode:
                if (tetrisGrid.canRotate(selectedPiece, currentX, currentY, "counterClockwise")) selectedPiece.rotate("counterClockwise");
                break;
            case space_keycode:
                console.log("you pressed 'space'");
                break;
        }
    });

    let pieceFalling= false;
    while (true){
        if (possiblePiecesCopy.length=== 0){
            possiblePieces.forEach((tetrisPiece) => possiblePiecesCopy.push(tetrisPiece.copy()));
        }
        if (! pieceFalling){
            selectedPiece= popRandomElementFromArray(possiblePiecesCopy);
        }
    
        tetrisGrid.displayPiece(selectedPiece, currentX, currentY);
        await sleep(gameTickMS);

        if (tetrisGrid.canFall(selectedPiece, currentX, currentY)){
            pieceFalling= true;
            currentY++;
        }
        else{
            if (currentY=== 0){
                break;
            }
            pieceFalling= false;
            currentX= 0;
            currentY= 0;
            
            tetrisGrid.handleFullRow();
        }
    }
    
    gameOver(rootNode);
}

gamePlay();