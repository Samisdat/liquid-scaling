'use strict';

var heatmap = require('./heatmap');
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

module.exports = Pixelmap;
