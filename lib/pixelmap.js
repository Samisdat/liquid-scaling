'use strict';

var heatmap = require('./heatmap');
var Pixel = require('./pixel');
var Seams = require('./seams');
var Seam = require('./seam');

var Pixelmap = function(pixels) {

    this.seams = undefined;

    this.width = pixels[0].length;
    this.height = pixels.length;

    this.pixels = pixels;
    var heatMap = heatmap(pixels);
    this.maxHeat = heatMap.getMaxHeat();

};

Pixelmap.prototype.getWidth = function(){
    return this.width;
};

Pixelmap.prototype.getHeight = function(){
    return this.height;
};

/**
 * Proxy Pixelmap Items method
 */
Pixelmap.prototype.getColor = function(row, col){
    return this.pixels[row][col].getColor();
    /*
    try{
        return this.Pixelmap[row][col].get();
    }
    catch(e){
        console.log(row, col, this.getWidth(), this.getHeight())
    }
    */
};

/**
 * Proxy Pixelmap Items method
 */
Pixelmap.prototype.getHeat = function(row, col){
    return this.pixels[row][col].getHeat();
};

/**
 * Proxy Pixelmap Items method
 */
Pixelmap.prototype.isDeleted = function(row, col){
    return this.pixels[row][col].isDeleted();
};

/**
 * Proxy Pixelmap Items method
 */
Pixelmap.prototype.markAsDeleted = function(row, col){
    return this.pixels[row][col].markAsDeleted();
};

Pixelmap.prototype.getMaxHeat = function(){
    return this.maxHeat;
};

Pixelmap.prototype.generateSeams = function(){

    if(undefined !== this.seams){
        return;
    }

    var seams = new Seams();

    for(var col = 1, cols = this.getWidth(); col < cols; col += 1){
        seams.add(
            new Seam( col, this.getHeat(0, col))
        );
    }

    for(var row = 1, rows = this.getHeight(); row < rows; row += 1){
        for(var i = 0, x = seams.getLength(); i < x; i += 1){
            var seam = seams.get(i);
            var last = seam.getLast();

            var left = (0 < last) ? this.getHeat(row, last - 1) : Number.MAX_VALUE;
            var center = this.getHeat(row, last );
            var right = (last < (this.getWidth() - 1)) ? this.getHeat(row, last + 1) : Number.MAX_VALUE;

            if(center <= left && center <= right){
                seam.addRow(last, this.getHeat(row, last));
            }
            else if(left < center && left <= right){
                seam.addRow( (last - 1), this.getHeat(row, (last - 1)));
            }
            else if(right < center && right < left){
                seam.addRow( (last + 1), this.getHeat(row, (last + 1)));
            }
        }
    }

    seams.filter();

    this.seams = seams.getUnique();

};

Pixelmap.prototype.numberOfSeams = function(){
    return this.seams.length;
};

Pixelmap.prototype.flip = function(){

    var rotate = function (a){
      // transpose from http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
        a = Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c]; }); });
      // row reverse
        for (var i in a){
            a[i] = a[i].reverse();
        }
        return a;
    };

    var flipped = rotate(this.pixels);


    for(var row = 0, rows = this.getWidth(); row < rows; row += 1){

        for(var col = 0, cols = this.getHeight(); col < cols; col += 1){
            flipped[row][col].setHeat(undefined);
            flipped[row][col].setHeat('');
        }
    }

    return new Pixelmap(flipped);

};

Pixelmap.prototype.getSeams = function(){
    return this.seams;
};

Pixelmap.prototype.getScaleUpWidth = function(width){

    this.generateSeams();

    var scaleUpByWidth = width - this.getWidth();

    if( scaleUpByWidth > this.seams.length){
        scaleUpByWidth = this.seams.length;
    }

    var row = 0;
    var rows = this.getHeight();

    var duplicatePixels = [];

    for(row = 0; row < rows; row += 1){

        duplicatePixels[row] = [];
        for(var col = 0, cols = this.getWidth(); col < cols; col += 1){

            duplicatePixels[row][col] = this.pixels[row][col].clone();
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

    var width = this.getWidth();
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
    var rows = this.getHeight();

    for(var i = 0; i < scaleUpByWidth; i += 1){

        for(row = 0; row < rows; row += 1){

            var col = this.seams[i].getRow(row);
            duplicate(row, col);
        }
    }

    return new Pixelmap(duplicatePixels);

};

Pixelmap.prototype.getScaleUpHeight = function(width){

    var flipped = this.flip();

    flipped.generateSeams();

    var scaleUpByWidth = width - flipped.getWidth();

    var verticalSeams = flipped.getSeams();

    if( scaleUpByWidth > verticalSeams.length){
        scaleUpByWidth = verticalSeams.length;
    }

    var row = 0;
    var rows = flipped.getHeight();

    var duplicatePixels = [];

    for(row = 0; row < rows; row += 1){

        duplicatePixels[row] = [];
        for(var col = 0, cols = flipped.getWidth(); col < cols; col += 1){

            duplicatePixels[row][col] = flipped.pixels[row][col].clone();
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

    var width = flipped.getWidth();
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
    var rows = flipped.getHeight();

    for(var i = 0; i < scaleUpByWidth; i += 1){

        for(row = 0; row < rows; row += 1){

            var col = flipped.seams[i].getRow(row);
            duplicate(row, col);
        }
    }

    return new Pixelmap(duplicatePixels).flip().flip().flip();;

};

Pixelmap.prototype.scaleUp = function(targetDimension){

    if(undefined === targetDimension.width){
        targetDimension.width = this.getWidth();
    }

    if(undefined === targetDimension.height){
        targetDimension.height = this.getHeight();
    }

    if(targetDimension.width === this.getWidth() && targetDimension.height === this.getHeight()){
        return this;
    }

    var duplicateSeam;

    if(targetDimension.width > this.getWidth()){
        duplicateSeam = this.getScaleUpWidth(targetDimension.width);
    }
    else{
        duplicateSeam = this;
    }

    if(targetDimension.height > this.getHeight()){
        duplicateSeam = duplicateSeam.getScaleUpHeight(targetDimension.height);
    }

    return duplicateSeam;
};


Pixelmap.prototype.downScale = function(targetDimension){

    if(undefined === targetDimension.width){
        targetDimension.width = this.getWidth();
    }

    if(undefined === targetDimension.height){
        targetDimension.height = this.getHeight();
    }

    if(targetDimension.width === this.getWidth() && targetDimension.height === this.getHeight()){
        return this;
    }

    var seamLess;

    if(targetDimension.width < this.getWidth()){
        seamLess = this.getReduceWidth(targetDimension.width);
    }
    else{
        seamLess = this;
    }

    if(targetDimension.height < this.getHeight()){
        seamLess = seamLess.getReduceHeight(targetDimension.height);
    }

    return seamLess;
};

Pixelmap.prototype.resize = function(targetDimension){

    if(undefined === targetDimension.width){
        targetDimension.width = this.getWidth();
    }

    if(undefined === targetDimension.height){
        targetDimension.height = this.getHeight();
    }

    if(targetDimension.width === this.getWidth() && targetDimension.height === this.getHeight()){
        return this;
    }

    var scaled = this;

    if(targetDimension.width < this.getWidth() || targetDimension.height < this.getHeight()){
        scaled = this.downScale(targetDimension);
    }

    if(targetDimension.width > this.getWidth() || targetDimension.height > this.getHeight()){
        scaled = this.scaleUp(targetDimension);
    }

    return scaled;

};

module.exports = Pixelmap;
