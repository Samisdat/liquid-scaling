var expect = require('chai').expect;
var assert = require('chai').assert;

var Pixel = require('../lib/pixel');

describe('Pixel', function() {

    it('can be created', function() {

        var pixel = new Pixel(10, 11, 12, 255);

        expect(pixel).to.be.instanceof(Pixel);

	});

    it('can be cloned', function() {

        var pixel = new Pixel(10, 11, 12, 255);
        var clone = pixel.clone();

        expect(clone).to.be.instanceof(Pixel);
        expect(clone).to.be.deep.equal(pixel);

        var pixel = new Pixel(10, 11, 12, 255);
        pixel.markAsDeleted();
        var clone = pixel.clone();

        expect(clone.isDeleted()).to.be.true;


	});

    it('can get/set rgba ', function() {

        var r = 10;
        var g = 11;
        var b = 12;
        var a = 255;

        var pixel = new Pixel(r, g, b, a);

        expect(pixel.getColor).to.be.a('function');
        expect(pixel.setColor).to.be.a('function');

        var rgba = pixel.getColor();
        expect(rgba.r).to.equal(r);
        expect(rgba.g).to.equal(g);
        expect(rgba.b).to.equal(b);
        expect(rgba.a).to.equal(a);

        var r = 20;
        var g = 21;
        var b = 22;
        var a = 23;

        pixel.setColor(r, g, b, a);
        var rgba = pixel.getColor();
        expect(rgba.r).to.equal(r);
        expect(rgba.g).to.equal(g);
        expect(rgba.b).to.equal(b);
        expect(rgba.a).to.equal(a);

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

