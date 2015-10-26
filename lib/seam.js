var Seam = function(startCol, startHeat) {

    this.members = [startCol];
    this.value = startHeat;

    this.unique = true;

};

Seam.prototype.getValue = function(){

    return this.value;

};

Seam.prototype.getLast = function(){

    return this.members[ (this.members.length - 1) ];

};

Seam.prototype.addRow = function(col, heat){

    this.members.push(col);
    this.value += heat;

};

Seam.prototype.getRow = function(row){

    return this.members[row];

};
Seam.prototype.getRows = function(){

    return this.members.length;

};


Seam.prototype.isUnique = function(row){

    return (true === this.unique);

};

Seam.prototype.markDuplicate = function(row){

    this.unique = false;

};


module.exports = Seam;
