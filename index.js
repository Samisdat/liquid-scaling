var lwip = require('lwip');
var fs = require('fs');

var Canvas = require('canvas');

var Matrix = require('./matrix');
var LiquidColor = require('./liquid-color');

var getColorsFromCanvasCtx = function(ctx){

    var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;

    var colors = [];

    var getPixel = function(col, row){
        var base = (row * ctx.canvas.width + col) * 4;

        return new LiquidColor(
            imageData[base + 0],
            imageData[base + 1],
            imageData[base + 2],
            imageData[base + 3]
        );
    };

    for (var row = 0, rows = ctx.canvas.height; row < rows;  row += 1) {

        colors[row] = [];

        for (var col = 0, cols = ctx.canvas.width; col < cols;  col += 1) {

            colors[row].push(getPixel(col, row));

        }
    }

    return colors;
};


var LiquidScaling = function(canvasContext) {

    this.ctx = canvasContext;

    this.matrix = new Matrix(getColorsFromCanvasCtx(this.ctx));

};


LiquidScaling.prototype.getHeatMap = function(){

    var heatMapCanvas = new Canvas(this.matrix.getWidth(), this.matrix.getHeight());
    var heatMapCtx = heatMapCanvas.getContext('2d');

    var maxHeat = this.matrix.getMaxHeat();

    var newImageData = [];

    var width = this.matrix.getWidth();

    var setPixel = function(x, y, color){
        var base = (y * width + x) * 4;
        newImageData[base + 0] = color.r;
        newImageData[base + 1] = color.g;
        newImageData[base + 2] = color.b;
        newImageData[base + 3] = 255;
    };

    for (var x = 0; x < this.matrix.getWidth(); x++) {

        for (var y = 0; y < this.matrix.getHeight(); y++) {

            var color = parseInt(this.matrix.getHeat(y, x) / maxHeat * 255, 10);
            setPixel(x, y, {r:color, g:color, b:color});
        }

    }

    var newImage = heatMapCtx.createImageData(this.matrix.getWidth(), this.matrix.getHeight());
    for (var i = 0; i < newImageData.length; i++) {
        newImage.data[i] = newImageData[i];
    }

    heatMapCtx.putImageData(newImage, 0, 0);

    return heatMapCtx;

};

LiquidScaling.prototype.createResizedCanvas = function(){

    var resizedCanvas = new Canvas(this.matrix.getWidth(), this.matrix.getHeight());
    var resizedCtx = resizedCanvas.getContext('2d');

    var newImageData = [];

    var width = this.matrix.getWidth();
    var setPixel = function(x, y, color){
        var base = (y * width + x) * 4;
        newImageData[base + 0] = color.r;
        newImageData[base + 1] = color.g;
        newImageData[base + 2] = color.b;
        newImageData[base + 3] = 255;
    };

    for (var x = 0; x < this.matrix.getWidth(); x++) {

        for (var y = 0; y < this.matrix.getHeight(); y++) {

            var color = this.matrix.getColor(y, x);
            setPixel(x, y, color);
        }

    }

    var newImage = resizedCtx.createImageData(this.matrix.getWidth(), this.matrix.getHeight());
    for (var i = 0; i < newImageData.length; i++) {
        newImage.data[i] = newImageData[i];
    }

    resizedCtx.putImageData(newImage, 0, 0);

    return resizedCtx;

};

LiquidScaling.prototype.resize = function(targetDimension){

    if(undefined === targetDimension.width){
        targetDimension.width = this.matrix.getWidth();
    }

    if(undefined === targetDimension.height){
        targetDimension.height = this.matrix.getHeight();
    }

    while(this.matrix.getWidth() > targetDimension.width || this.matrix.getHeight() > targetDimension.height){

        this.matrix = this.matrix.getReduced(targetDimension);

    }

    return this.createResizedCanvas();

};

module.exports = LiquidScaling;
