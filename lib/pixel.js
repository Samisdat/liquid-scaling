'use strict';

var Pixel = function(r, g, b, a) {

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.heat = undefined;

    this.deleted = false;
};

Pixel.prototype.clone = function(){
    var color = this.getColor();
    var clone = new Pixel(color.r, color.g, color.b, color.a);
    clone.setHeat(this.getHeat());

    if(true === this.isDeleted()){
        clone.markAsDeleted();
    }

    return clone;
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
