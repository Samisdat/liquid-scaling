var expect = require('chai').expect;
var assert = require('chai').assert;

var Pixelmap = require('../lib/pixelmap');

var Pixel = require('../lib/pixel');
var Seam = require('../lib/seam');

describe('Pixelmap', function() {

    var pixels = [];

    beforeEach(function() {
        pixels = [
            [
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 255, 0, 255),
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 0, 0, 255),
            ],
            [
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 255, 0, 255),
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 0, 0, 255),
            ],
            [
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 255, 0, 255),
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 0, 0, 255),
            ],
            [
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 255, 0, 255),
                new Pixel(0, 0, 0, 255),
                new Pixel(0, 0, 0, 255),
            ],
        ];

    });

    it('can be created', function() {

        var pixelmap = new Pixelmap(pixels);

        expect(pixelmap).to.be.instanceof(Pixelmap);

    });

    it('can get width/height', function() {

        var pixelmap = new Pixelmap(pixels);

        expect(pixelmap.getWidth()).to.be.equal(5);
        expect(pixelmap.getHeight()).to.be.equal(4);

    });

    it('can get/set color', function() {

        var pixelmap = new Pixelmap(pixels);

        var color = pixelmap.getColor(0, 0);

        expect(color.r).to.equal(0);
        expect(color.g).to.equal(0);
        expect(color.b).to.equal(0);
        expect(color.a).to.equal(255);

    });

    it('can getHeat', function() {

        var pixelmap = new Pixelmap(pixels);
        expect(pixelmap.getHeat(1,1)).to.be.equal(1020);
        expect(pixelmap.getHeat(2,2)).to.be.equal(0);

    });

    it('can check isDeleted and markAsDeleted', function() {

        var pixelmap = new Pixelmap(pixels);

        expect(pixelmap.isDeleted(1,1)).to.be.false;

        pixelmap.markAsDeleted(1, 1);
        expect(pixelmap.isDeleted(1,1)).to.be.true;


    });

    it('can getMaxHeat', function() {

        var pixelmap = new Pixelmap(pixels);

        // very clever test, but covers 100% of heatmap ;)
        expect(pixelmap.getMaxHeat()).to.be.equal(1020);

    });

    it('can generateSeams and getSeams', function() {

        var pixelmap = new Pixelmap(pixels);

        pixelmap.generateSeams();

        expect(pixelmap.numberOfSeams()).to.be.equal(2);

        var seams = pixelmap.getSeams();

        expect(seams[0]).to.be.instanceof(Seam);
        expect(seams[1]).to.be.instanceof(Seam);

        pixelmap.generateSeams();
        expect(pixelmap.numberOfSeams()).to.be.equal(2);

    });

});

