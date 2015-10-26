var Color = function(r, g, b, a) {

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

Color.prototype.get = function(){
    return{
        r:this.r,
        g:this.g,
        b:this.b,
        a:this.a
    };
};

Color.prototype.set = function(r, g, b, a){

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

};

module.exports = Color;
