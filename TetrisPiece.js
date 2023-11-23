class TetrisPiece{
    constructor(areaWidth, areaHeight, pieceBlocks, rotationOrigin, color){
        this.areaWidth= areaWidth;
        this.areaHeight= areaHeight;
        this.pieceBlocks= pieceBlocks;
        this.rotationOrigin= rotationOrigin;
        this.color= color;
    }

    _getRotatedPieceBlocks(rotationDirection){
        const traslatedCoords= this.pieceBlocks.map((coord)=> [coord[0]-this.rotationOrigin[0], coord[1]- this.rotationOrigin[1]]);
        let rotatedCoords;
        switch (rotationDirection) {
            case "counterClockwise":
                // [x, y]=> [y, -x]
                rotatedCoords= traslatedCoords.map((coord)=> [coord[1], -coord[0]]);
                break;
            case "clockwise":
                // [x, y]=> [-y, x]
                rotatedCoords= traslatedCoords.map((coord)=> [-coord[1], coord[0]]);
                break;
        
            default:
                throw new Error("ValueError: rotationDirection argument must have either value 'clockwise' or 'counterClockwise'");
        }

        return rotatedCoords;
    }

    rotate(rotationDirection){
        const rotatedCoords= this._getRotatedPieceBlocks(rotationDirection);

        this.pieceBlocks= rotatedCoords.map((coord) => [coord[0]+this.rotationOrigin[0], coord[1]+this.rotationOrigin[1]]);
    }

    copy(){
        return new TetrisPiece(
            this.areaWidth,
            this.areaHeight,
            this.pieceBlocks,
            this.rotationOrigin,
            this.color
        );
    }
}