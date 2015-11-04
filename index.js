'use strict';

var Canvas = require('canvas');

var Pixelmap = require('./lib/pixelmap');
var Transform = require('./lib/transform');
var Pixel = require('./lib/pixel');

var getColorsFromCanvasCtx = function(ctx){

    var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;

    var pixels = [];

    var getPixel = function(col, row){
        var base = (row * ctx.canvas.width + col) * 4;

        return new Pixel(
            imageData[base + 0],
            imageData[base + 1],
            imageData[base + 2],
            imageData[base + 3]
        );
    };

    for (var row = 0, rows = ctx.canvas.height; row < rows; row += 1) {

        pixels[row] = [];

        for (var col = 0, cols = ctx.canvas.width; col < cols; col += 1) {

            pixels[row].push(getPixel(col, row));

        }
    }

    return pixels;
};


var LiquidScaling = function(canvasContext) {

    this.ctx = canvasContext;

    this.pixelmap = new Pixelmap(getColorsFromCanvasCtx(this.ctx));

};


LiquidScaling.prototype.getHeatMap = function(){

    var heatMapCanvas = new Canvas(this.matrix.getWidth(), this.matrix.getHeight());
    var heatMapCtx = heatMapCanvas.getContext('2d');

    var maxHeat = this.pixelmap.getMaxHeat();

    var newImageData = [];

    var width = this.pixelmap.getWidth();

    var setPixel = function(x, y, color){
        var base = (y * width + x) * 4;
        newImageData[base + 0] = color.r;
        newImageData[base + 1] = color.g;
        newImageData[base + 2] = color.b;
        newImageData[base + 3] = 255;
    };

    for (var x = 0; x < this.pixelmap.getWidth(); x++) {

        for (var y = 0; y < this.pixelmap.getHeight(); y++) {

            var color = parseInt(this.pixelmap.getHeat(y, x) / maxHeat * 255, 10);
            setPixel(x, y, {r: color, g: color, b: color});
        }

    }

    var newImage = heatMapCtx.createImageData(this.pixelmap.getWidth(), this.pixelmap.getHeight());
    for (var i = 0; i < newImageData.length; i++) {
        newImage.data[i] = newImageData[i];
    }

    heatMapCtx.putImageData(newImage, 0, 0);

    return heatMapCtx;

};

LiquidScaling.prototype.createResizedCanvas = function(){

    var resizedCanvas = new Canvas(this.pixelmap.getWidth(), this.pixelmap.getHeight());
    var resizedCtx = resizedCanvas.getContext('2d');

    var newImageData = [];

    var width = this.pixelmap.getWidth();
    var setPixel = function(x, y, color){
        var base = (y * width + x) * 4;
        newImageData[base + 0] = color.r;
        newImageData[base + 1] = color.g;
        newImageData[base + 2] = color.b;
        newImageData[base + 3] = 255;
    };

    for (var x = 0; x < this.pixelmap.getWidth(); x++) {

        for (var y = 0; y < this.pixelmap.getHeight(); y++) {

            var color = this.pixelmap.getColor(y, x);
            setPixel(x, y, color);
        }

    }

    var newImage = resizedCtx.createImageData(this.pixelmap.getWidth(), this.pixelmap.getHeight());
    for (var i = 0; i < newImageData.length; i++) {
        newImage.data[i] = newImageData[i];
    }

    resizedCtx.putImageData(newImage, 0, 0);

    return resizedCtx;

};

LiquidScaling.prototype.resize = function(targetDimension){

    if(undefined === targetDimension.width){
        targetDimension.width = this.pixelmap.getWidth();
    }

    if(undefined === targetDimension.height){
        targetDimension.height = this.pixelmap.getHeight();
    }

    if(targetDimension.width > this.pixelmap.getWidth() ){
        var transform = new Transform(this.pixelmap);
        this.pixelmap = transform.resize(targetDimension);

        /**
        while(this.pixelmap.getWidth() < targetDimension.width || this.pixelmap.getHeight() < targetDimension.height){

            this.pixelmap = this.pixelmap.resize(targetDimension);

        }
        */

    }
    else{

        var transform = new Transform(this.pixelmap);
        this.pixelmap = transform.resize(targetDimension);
        /*
        while(this.pixelmap.getWidth() > targetDimension.width || this.pixelmap.getHeight() > targetDimension.height){

            this.pixelmap = this.pixelmap.resize(targetDimension);

        }*/

    }

    return this.createResizedCanvas();

};

module.exports = LiquidScaling;
