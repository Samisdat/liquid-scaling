'use strict';

var heatmap = require('./heatmap');
var Seams = require('./seams');
var Seam = require('./seam');

var Pixelmap = function(pixels) {

    this.seams = undefined;

    this.width = pixels[0].length;
    this.height = pixels.length;

    this.Pixelmap = pixels;
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
    return this.Pixelmap[row][col].getColor();
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
    return this.Pixelmap[row][col].getHeat();
};

/**
 * Proxy Pixelmap Items method
 */
Pixelmap.prototype.isDeleted = function(row, col){
    return this.Pixelmap[row][col].isDeleted();
};

/**
 * Proxy Pixelmap Items method
 */
Pixelmap.prototype.markAsDeleted = function(row, col){
    return this.Pixelmap[row][col].markAsDeleted();
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

    var flipped = rotate(this.Pixelmap);


    for(var row = 0, rows = this.getWidth(); row < rows; row += 1){

        for(var col = 0, cols = this.getHeight(); col < cols; col += 1){
            flipped[row][col].setHeat(undefined);
            flipped[row][col].setHeat('');
        }
    }

    return new Pixelmap(flipped);

};



Pixelmap.prototype.getReduceWidth = function(width){

    this.generateSeams();

    var reduceByWidth = this.getWidth() - width;

    if( reduceByWidth > this.seams.length){
        reduceByWidth = this.seams.length;
    }

    var row = 0;
    var rows = this.getHeight();

    for(var i = 0; i < reduceByWidth; i += 1){

        for(row = 0; row < rows; row += 1){

            var deleteCol = this.seams[i].getRow(row);
            this.markAsDeleted(row, deleteCol);

        }
    }

    var seamLessColors = [];

    for(row = 0; row < rows; row += 1){

        seamLessColors[row] = [];
        var seamCol = 0;

        for(var col = 0, cols = this.getWidth(); col < cols; col += 1){
            if(true === this.isDeleted(row, col)){
                continue;
            }

            seamLessColors[row][seamCol] = this.Pixelmap[row][col];
            seamCol += 1;
        }
    }

    return new Pixelmap(seamLessColors);


};

Pixelmap.prototype.getSeams = function(){
    return this.seams;
};

Pixelmap.prototype.getReduceHeight = function(height){


    var flipped = this.flip();

    flipped.generateSeams();

    var reduceByWidth = flipped.getWidth() - height;
    var verticalSeams = flipped.getSeams();

    if( reduceByWidth > verticalSeams.length){
        reduceByWidth = verticalSeams.length;
    }

    var row = 0;
    var rows = flipped.getHeight();

    for(var i = 0; i < reduceByWidth; i += 1){

        for(row = 0; row < rows; row += 1){

            var deleteCol = flipped.seams[i].getRow(row);
            flipped.markAsDeleted(row, deleteCol);

        }
    }

    var seamLessColors = [];

    for(row = 0; row < rows; row += 1){

        seamLessColors[row] = [];
        var seamCol = 0;

        for(var col = 0, cols = flipped.getWidth(); col < cols; col += 1){
            if(true === flipped.isDeleted(row, col)){
                continue;
            }

            seamLessColors[row][seamCol] = flipped.Pixelmap[row][col];
            seamCol += 1;
        }
    }

    return new Pixelmap(seamLessColors).flip().flip().flip();

};

Pixelmap.prototype.getReduced = function(targetDimension){

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

    if(targetDimension.width !== this.getWidth()){
        seamLess = this.getReduceWidth(targetDimension.width);
    }
    else{
        seamLess = this;
    }

    if(targetDimension.height !== this.getHeight()){
        seamLess = seamLess.getReduceHeight(targetDimension.height);
    }

    return seamLess;
};

module.exports = Pixelmap;
