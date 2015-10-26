var Seams = function() {

    this.seams = [];

    this.uniqueSeams = undefined;
};

Seams.prototype.getLength = function(){

    return this.seams.length;

};

Seams.prototype.add = function(seam){

    this.seams.push(seam);

};

Seams.prototype.get = function(startCol){

    return this.seams[startCol];

};

Seams.prototype.compareSeam = function(a, b){
      if (a.getValue() < b.getValue()) {
        return -1;
      }
      if (a.getValue() > b.getValue()) {
        return 1;
      }
      // a must be equal to b
      return 0;
};

Seams.prototype.filter = function(a, b){
    this.seams.sort(this.compareSeam);

    this.uniqueSeams = this.seams.length;

    for(var i = 0, x = this.seams.length; i < x; i += 1){
        for(var j = (i + 1), y = this.seams.length; j < y; j += 1){
            if(false === this.get(j).isUnique()){
                continue;
            }
            var base = this.get(i);
            var compare = this.get(j);

            for(var row = 0, rows = base.getRows(); row < rows; row += 1){
                if(base.getRow(row) === compare.getRow(row)){
                    compare.markDuplicate();
                    this.uniqueSeams -= 1;
                    break;
                }
            }
        }

    }
};

Seams.prototype.getUnique = function(){
    var uniqueSeams = [];

    for(var i = 0, x = this.seams.length; i < x; i += 1){
        if(false === this.get(i).isUnique()){
            continue;
        }

        uniqueSeams.push(this.get(i));
    }

    return uniqueSeams;
};

module.exports = Seams;
