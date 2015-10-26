var Color = require('./color');

var LiquidColor = function(r, g, b, a) {
    Color.call(this, r, g, b, a);

    this.heat = undefined;

    this.deleted = false;
};

LiquidColor.prototype = Object.create(Color.prototype);
LiquidColor.prototype.constructor = LiquidColor;


LiquidColor.prototype.getHeat = function(){
    return this.heat;
};

LiquidColor.prototype.setHeat = function(heat){
    this.heat = heat;
};

LiquidColor.prototype.isDeleted = function(){
    return (this.deleted === true);
};

LiquidColor.prototype.markAsDeleted = function(){
    this.deleted = true;
};

module.exports = LiquidColor;
