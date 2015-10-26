var heatmap = require('./heatmap');
var Seams = require('./seams');
var Seam = require('./seam');

var Matrix = function(colors) {

    this.seams = undefined;

    this.width = colors[0].length;
    this.height = colors.length;

    this.matrix = colors;

    var heatMap = heatmap(colors);
    this.maxHeat = heatMap.getMaxHeat();

};

Matrix.prototype.getWidth = function(){
    return this.width;
};

Matrix.prototype.getHeight = function(){
    return this.height;
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.getColor = function(row, col){
    return this.matrix[row][col].get();
    /*
    try{
        return this.matrix[row][col].get();
    }
    catch(e){
        console.log(row, col, this.getWidth(), this.getHeight())
    }
    */
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.setColor = function(row, col, r, g, b, a){
    this.matrix[row][col].set(r, g, b, a);
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.getHeat = function(row, col){
    return this.matrix[row][col].getHeat();
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.setHeat = function(row, col, heat){
    this.matrix[row][col].setHeat(heat);
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.isDeleted = function(row, col){
    return this.matrix[row][col].isDeleted();
};

/**
 * Proxy Matrix Items method
 */
Matrix.prototype.markAsDeleted = function(row, col){
    return this.matrix[row][col].markAsDeleted();
};

Matrix.prototype.getMaxHeat = function(){
    return this.maxHeat;
};

Matrix.prototype.generateSeams = function(){

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

            var left = (last > 0) ? this.getHeat(row, last - 1) : Number.MAX_VALUE;
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

Matrix.prototype.numberOfSeams = function(){
    return this.seams.length;
};

Matrix.prototype.flip = function(){

    var rotate = function (a){
      // transpose from http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
      a = Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c]; }); });
      // row reverse
      for (var i in a){
        a[i] = a[i].reverse();
      }
      return a;
    };

    var flipped = rotate(this.matrix);


    for(var row = 0, rows = this.getWidth(); row < rows; row +=1){

        for(var col = 0, cols = this.getHeight(); col < cols; col +=1){
            flipped[row][col].setHeat(undefined);
            flipped[row][col].setHeat('');
        }
    }

    return new Matrix(flipped, true);

};



Matrix.prototype.getReduceWidth = function(width){

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

    for(row = 0; row < rows; row +=1){

        seamLessColors[row] = [];
        var seamCol = 0;

        for(var col = 0, cols = this.getWidth(); col < cols; col +=1){
            if(true === this.isDeleted(row, col)){
                continue;
            }

            seamLessColors[row][seamCol] = this.matrix[row][col];
            seamCol += 1;
        }
    }

    return new Matrix(seamLessColors);


};

Matrix.prototype.getSeams = function(){
    return this.seams;
};

Matrix.prototype.getReduceHeight = function(height){


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

    for(row = 0; row < rows; row +=1){

        seamLessColors[row] = [];
        var seamCol = 0;

        for(var col = 0, cols = flipped.getWidth(); col < cols; col +=1){
            if(true === flipped.isDeleted(row, col)){
                continue;
            }

            seamLessColors[row][seamCol] = flipped.matrix[row][col];
            seamCol += 1;
        }
    }

    return new Matrix(seamLessColors).flip().flip().flip();

};

Matrix.prototype.getReduced = function(targetDimension){

    if(undefined === targetDimension.width){
        targetDimension.width = this.matrix.getWidth();
    }

    if(undefined === targetDimension.height){
        targetDimension.height = this.matrix.getHeight();
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

module.exports = Matrix;
