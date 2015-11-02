'use strict';

var Pixel = function(r, g, b, a) {

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.heat = undefined;

    this.deleted = false;
};

Pixel.prototype.getColor = function(){
    return {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a
    };
};

Pixel.prototype.setColor = function(r, g, b, a){

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

};

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
