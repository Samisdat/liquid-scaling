'use strict';

var Pixelmap = require('./pixelmap');
var Pixel = require('./pixel');

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
};

Transform.prototype.flip = function(pixelmap){

    var rotate = function (a){
      // transpose from http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
        a = Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c]; }); });
      // row reverse
        for (var i in a){
            a[i] = a[i].reverse();
        }
        return a;
    };

    var flipped = rotate(pixelmap.pixels);


    for(var row = 0, rows = pixelmap.getWidth(); row < rows; row += 1){

        for(var col = 0, cols = pixelmap.getHeight(); col < cols; col += 1){
            flipped[row][col].setHeat(undefined);
            flipped[row][col].setHeat('');
        }
    }

    return new Pixelmap(flipped);

};


Transform.prototype.addSeams = function(width, pixelmap){

    pixelmap.generateSeams();

    var scaleUpBy = width - pixelmap.getWidth();
    var seams = pixelmap.getSeams();

    if(scaleUpBy > seams.length){
        scaleUpBy = seams.length;
    }

    var row = 0;
    var rows = pixelmap.getHeight();

    var duplicatePixels = [];

    for(row = 0; row < rows; row += 1){

        duplicatePixels[row] = [];
        for(var col = 0, cols = pixelmap.getWidth(); col < cols; col += 1){

            duplicatePixels[row][col] = pixelmap.pixels[row][col].clone();
        }
    }

    var getPixelWithAvgColor = function(colors){

        var r = 0;
        var g = 0;
        var b = 0;

        colors.forEach(function(pixel){
            r += pixel.r;
            g += pixel.g;
            b += pixel.b;
        });

        r = r / colors.length;
        g = g / colors.length;
        b = b / colors.length;

        return new Pixel(r, g, b, 255);

    };

    var width = pixelmap.getWidth();
    var duplicate = function(row, col){

        var colors = [];

        if(0 < col){
            colors.push(duplicatePixels[row][col - 1]);
        }

        if(width > col){
            colors.push(duplicatePixels[row][col + 1]);
        }

        var newPixel = getPixelWithAvgColor(colors);

        duplicatePixels[row].splice(col, 0, newPixel);

    };

    var row = 0;
    var rows = pixelmap.getHeight();

    for(var i = 0; i < scaleUpBy; i += 1){

        for(row = 0; row < rows; row += 1){

            var col = seams[i].getRow(row);
            duplicate(row, col);
        }
    }

    return new Pixelmap(duplicatePixels);

};


Transform.prototype.removeSeams = function(width, pixelmap){

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

            pixelmap = this.removeSeams(targetDimension.width, pixelmap);

        }

        if(pixelmap.getHeight() > targetDimension.height){

            pixelmap = this.flip(pixelmap);

            pixelmap = this.removeSeams(targetDimension.height, pixelmap);

            // @TODO rotete -90 degree instead of 270=3*90 degrees
            pixelmap = this.flip(pixelmap);
            pixelmap = this.flip(pixelmap);
            pixelmap = this.flip(pixelmap);

        }

        if(pixelmap.getWidth() < targetDimension.width){

            pixelmap = this.addSeams(targetDimension.width, pixelmap);

        }

        if(pixelmap.getHeight() < targetDimension.height){

            pixelmap = this.flip(pixelmap);

            pixelmap = this.addSeams(targetDimension.height, pixelmap);

            pixelmap = this.flip(pixelmap);
            pixelmap = this.flip(pixelmap);
            pixelmap = this.flip(pixelmap);

        }

    }

    return pixelmap;

};

module.exports = Transform;
