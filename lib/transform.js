'use strict';

var Pixelmap = require('./pixelmap');

var Transform = function(pixelmap) {

    this.pixelmap = pixelmap;

};

Transform.prototype.getTargetDimension = function(targetDimension){

    if(undefined === targetDimension.width){
        targetDimension.width = this.pixelmap.getWidth();
    }

    if(undefined === targetDimension.height){
        targetDimension.height = this.pixelmap.getHeight();
    }

    return targetDimension;
}

Transform.prototype.removeSeams = function(width, pixelmap){

    console.log(width)

    pixelmap.generateSeams();

    var reduceBy = pixelmap.getWidth() - width;
    var verticalSeams = pixelmap.getSeams();

    if( reduceBy > verticalSeams.length){
        reduceBy = verticalSeams.length;
    }

    var row = 0;
    var rows = pixelmap.getHeight();

    for(var i = 0; i < reduceBy; i += 1){

        for(row = 0; row < rows; row += 1){

            var deleteCol = pixelmap.seams[i].getRow(row);
            pixelmap.markAsDeleted(row, deleteCol);
        }
    }

    var seamLessColors = [];

    for(row = 0; row < rows; row += 1){

        seamLessColors[row] = [];
        var seamCol = 0;

        for(var col = 0, cols = pixelmap.getWidth(); col < cols; col += 1){
            if(true === pixelmap.isDeleted(row, col)){
                continue;
            }

            seamLessColors[row][seamCol] = pixelmap.pixels[row][col];
            seamCol += 1;
        }
    }

    return new Pixelmap(seamLessColors);

};

Transform.prototype.resize = function(targetDimension){

    targetDimension = this.getTargetDimension(targetDimension);

    if(this.pixelmap.getWidth() === targetDimension.width && this.pixelmap.getHeight() === targetDimension.height){
        return this.pixelmap;
    }

    var pixelmap = this.pixelmap;

    //@TODO skip for loops that don't change nothing
    while(pixelmap.getWidth() !== targetDimension.width || pixelmap.getHeight() !== targetDimension.height){

        if(pixelmap.getWidth() > targetDimension.width){

            pixelmap = this.removeSeams(targetDimension.width,pixelmap);

        }

        if(pixelmap.getHeight() > targetDimension.height){

            pixelmap = pixelmap.flip();

            pixelmap = this.removeSeams(targetDimension.height,pixelmap);

            pixelmap = pixelmap.flip().flip().flip();

        }
    }

    return pixelmap;

};

module.exports = Transform;
