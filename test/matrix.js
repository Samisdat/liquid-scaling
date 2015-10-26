var expect = require('chai').expect;
var assert = require('chai').assert;

var Matrix = require('../lib/matrix');
var Color = require('../lib/color');

describe('Matrix', function() {     it('can be created', function() {

    var matrix = new Matrix();

    expect(matrix).to.be.instanceof(Matrix);

});

    it('can get width/height', function() {

        var width = 4;
        var height = 3;

        var matrix = new Matrix(width, height);

        expect(matrix.getWidth()).to.be.equal(width);
        expect(matrix.getHeight()).to.be.equal(height);

    });

    it('can get/set color', function() {

        var matrix = new Matrix(4, 3);

        var rgba = matrix.getColor(1, 1);
        expect(rgba.r).to.be.undefined;
        expect(rgba.g).to.be.undefined;
        expect(rgba.b).to.be.undefined;
        expect(rgba.a).to.be.undefined;

        var r = 10;
        var g = 11;
        var b = 12;
        var a = 13;

        matrix.setColor(1, 1, r, g, b, a);
        var rgba = matrix.getColor(1, 1);
        expect(rgba.r).to.equal(r);
        expect(rgba.g).to.equal(g);
        expect(rgba.b).to.equal(b);
        expect(rgba.a).to.equal(a);     });     it('can get/set heat', function() {

    var matrix = new Matrix(4, 3);

    expect(matrix.getHeat(1, 1)).to.be.undefined;

    var heat = 10;
    matrix.setHeat(1, 1, heat);
    expect(matrix.getHeat(1,1)).to.be.equal(heat);

	});     it('can check deteled and mark as deleted', function() {

    var matrix = new Matrix(4, 3);

    expect(matrix.isDeleted(1, 1)).to.be.false;

    matrix.markAsDeleted(1,1);
    expect(matrix.isDeleted(1,1)).to.be.true;

});

    it('can sumColorChanels', function() {

        var matrix = new Matrix(1, 1);

        var r = 1;
        var g = 2;
        var b = 3;
        var a = 4;

        matrix.setColor(0, 0, r, g, b, a);

        expect(matrix.sumColorChanels(0, 0)).to.be.equal(10);

        expect(matrix.sumColorChanels(1, 0)).to.be.equal(0);
        expect(matrix.sumColorChanels(0, 1)).to.be.equal(0);

        expect(matrix.sumColorChanels(-1, 0)).to.be.equal(0);
        expect(matrix.sumColorChanels(0, -1)).to.be.equal(0);

    });

    it('can getMaxHeat', function() {

        var matrix = new Matrix(5, 5);

        for (var x = 0, width = matrix.getWidth(); x < width; x += 1) {

            for (var y = 0; y < matrix.getHeight(); y++) {

                matrix.setColor(y, x, 0, 0, 0, 0);

            }
        }
        matrix.setColor(2, 2, 255, 255, 255, 255);

        matrix.generateHeatMap();

        /* very dummy test, but covers 100% of heatmap ;) */
        expect(matrix.getMaxHeat()).to.be.equal(2040);

    });


});

