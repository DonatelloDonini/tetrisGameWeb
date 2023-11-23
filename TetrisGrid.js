console.log("TetrisGrid.js");

class TetrisGrid {

  constructor(height, width, backgroundColor, rootNode) {
    this.height = height;
    this.width = width;
    this.backgroundColor = backgroundColor;
    this.rootNode = rootNode;
    this.initializeColorMatrix();
  }

  initializeColorMatrix() {
    this._colorMatrix = [];
    for (let y = 0; y < this.height; y++) {
      const colorMatrixRow = [];
      for (let x = 0; x < this.width; x++) {
        colorMatrixRow.push(this.backgroundColor);
      }
      this._colorMatrix.push(colorMatrixRow);
    }
  }

  _getDisplayedPieceColorMatrix(tetrisPiece, tetrisPieceX, tetrisPieceY){
    const colorMatrixCopy = this.deepCopyMatrix(this._colorMatrix);
    for (let y = tetrisPieceY; y < (tetrisPieceY + tetrisPiece.areaHeight); y++) {
      for (let x = tetrisPieceX; x < (tetrisPieceX + tetrisPiece.areaWidth); x++) {
        if (this.containsCoord(tetrisPiece.pieceBlocks, [x - tetrisPieceX, y - tetrisPieceY])) {
          colorMatrixCopy[y][x] = tetrisPiece.color;
        }
      }
    }

    return colorMatrixCopy;
  }

  displayPiece(tetrisPiece, tetrisPieceX, tetrisPieceY) {
    const colorMatrixCopy= this._getDisplayedPieceColorMatrix(tetrisPiece, tetrisPieceX, tetrisPieceY);
    this._updateGUI(colorMatrixCopy);
  }

  _updateGUI(colorMatrix) {
    const grid = document.createElement("table");
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.style.backgroundColor = colorMatrix[y][x];
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }

    this.rootNode.replaceChildren(grid);
  }

  _updateColorMatrix(tetrisPiece, tetrisPieceX, tetrisPieceY){
    this._colorMatrix= this._getDisplayedPieceColorMatrix(tetrisPiece, tetrisPieceX, tetrisPieceY);
  }

  deepCopyMatrix(matrix) {
    // Create a new matrix to hold the copied values
    const copiedMatrix = [];

    // Loop through each row in the original matrix
    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];
      const copiedRow = [];

      // Loop through each element in the current row and copy it
      for (let j = 0; j < row.length; j++) {
        // Check if the current element is an array (nested array)
        if (Array.isArray(row[j])) {
          // If it's an array, recursively copy it
          copiedRow.push(deepCopyMatrix(row[j]));
        } else {
          // If it's not an array, copy the element as is
          copiedRow.push(row[j]);
        }
      }

      // Push the copied row to the new matrix
      copiedMatrix.push(copiedRow);
    }

    return copiedMatrix;
  }

  containsCoord(coordList, targetCoord) {
    for (const coord of coordList) {
      if (coord[0] === targetCoord[0] && coord[1] === targetCoord[1]) {
        return true;
      }
    }
    return false;
  }

  canFall(tetrisPiece, tetrisPieceX, tetrisPieceY){
    const directlyUnderCells= [];

    for (let x=0; x<tetrisPiece.areaWidth; x++){
      for (let y=tetrisPiece.areaHeight-1; y>=0; y--){
        if (this.containsCoord(tetrisPiece.pieceBlocks, [x, y])){
          directlyUnderCells.push([x, y+1]);
          break;
        }
      }
    }

    for (const cell of directlyUnderCells){
      if (cell[1]+tetrisPieceY>= this.height || this._colorMatrix[cell[1]+tetrisPieceY][cell[0]+tetrisPieceX]!== this.backgroundColor){
        this._updateColorMatrix(tetrisPiece, tetrisPieceX, tetrisPieceY);
        return false;
      }
    }

    return true;
  }

  canGoLeft(tetrisPiece, tetrisPieceX, tetrisPieceY){
    const directlyLeftCells= [];

    for (let y=0; y<tetrisPiece.areaHeight; y++){
      for (let x=0; x<tetrisPiece.areaWidth; x++){
        if (this.containsCoord(tetrisPiece.pieceBlocks, [x, y])){
          directlyLeftCells.push([x-1, y]);
          break;
        }
      }
    }

    for (const cell of directlyLeftCells){
      if ((cell[0]+tetrisPieceX)<0 || this._colorMatrix[cell[1]+tetrisPieceY][cell[0]+tetrisPieceX]!== this.backgroundColor){
        return false;
      }
    }

    return true;
  }
  
  canGoRight(tetrisPiece, tetrisPieceX, tetrisPieceY){
    const directlyRightCells= [];

    for (let y=0; y<tetrisPiece.areaHeight; y++){
      for (let x=tetrisPiece.areaWidth-1; x>=0; x--){
        if (this.containsCoord(tetrisPiece.pieceBlocks, [x, y])){
          directlyRightCells.push([x+1, y]);
          break;
        }
      }
    }

    for (const cell of directlyRightCells){
      if (cell[0]+tetrisPieceX>= this.width || this._colorMatrix[cell[1]+tetrisPieceY][cell[0]+tetrisPieceX]!== this.backgroundColor){
        return false;
      }
    }

    return true;
  }

  canRotate(tetrisPiece, tetrisPieceX, tetrisPieceY, rotationDirection){
    const rotatedPieceBlocks= tetrisPiece._getRotatedPieceBlocks(rotationDirection).map((coord) => [coord[0]+tetrisPiece.rotationOrigin[0], coord[1]+tetrisPiece.rotationOrigin[1]]);
    
    for (const pieceBlock of rotatedPieceBlocks) {
      const coordInRange= (pieceBlock[0]+tetrisPieceX>= 0 && pieceBlock[0]+tetrisPieceX<this.width) && (pieceBlock[1]+tetrisPieceY>0 && pieceBlock[1]+tetrisPieceY<this.height);
      const coordAlreadyOccupied= this._colorMatrix[pieceBlock[1]+tetrisPieceY][pieceBlock[0]+tetrisPieceX]!== this.backgroundColor;
      
      if ((! coordInRange) || coordAlreadyOccupied) return false;
    }

    return true;
  }

  handleFullRow(){
    const fullRowsIndexes= [];
    for (let y=0; y<this.height; y++){
      let x=0;
      while (x< this.width && this._colorMatrix[y][x]!== this.backgroundColor){
        x++;
      }
      if (x=== this.width) fullRowsIndexes.push(y);
    }

    // rows indexes are already sorted
    if (fullRowsIndexes.length===0) return

    let rowFallingAmount= 0;
    for (let y=this.height-1; y>= 0; y--){
      if (y=== fullRowsIndexes[fullRowsIndexes.length-1-rowFallingAmount]){
        rowFallingAmount++;
      }
      else{
        this._colorMatrix[y+rowFallingAmount]= [...this._colorMatrix[y]];
      }
    }

    this._updateGUI(this._colorMatrix);
  }
}