var expect = require('chai').expect;
var assert = require('chai').assert;

var Pixel = require('../lib/pixel');

describe('Pixel', function() {

    it('can be created', function() {

        var pixel = new Pixel(10, 11, 12, 255);

        expect(pixel).to.be.instanceof(Pixel);

	});

    it('can get/set heat', function() {

        var pixel = new Pixel(10, 11, 12, 255);

        expect(pixel.getHeat()).to.be.undefined;

        pixel.setHeat(1000);
        expect(pixel.getHeat()).to.be.equal(1000);

	});

    it('can idendify as deleted and marked as deleted', function() {

        var pixel = new Pixel(10, 11, 12, 255);

        expect(pixel.isDeleted()).to.be.false;

        pixel.markAsDeleted();
        expect(pixel.isDeleted()).to.be.true;

    });


});

