'use strict';

var Color = require('./color');

var Pixel = function(r, g, b, a) {
    Color.call(this, r, g, b, a);

    this.heat = undefined;

    this.deleted = false;
};

Pixel.prototype = Object.create(Color.prototype);
Pixel.prototype.constructor = Pixel;


Pixel.prototype.getHeat = function(){
    return this.heat;
};

Pixel.prototype.setHeat = function(heat){
    this.heat = heat;
};

Pixel.prototype.isDeleted = function(){
    return (true === this.deleted);
};

Pixel.prototype.markAsDeleted = function(){
    this.deleted = true;
};

module.exports = Pixel;
