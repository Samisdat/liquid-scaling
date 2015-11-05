var expect = require('chai').expect;
var assert = require('chai').assert;

var Transform = require('../lib/transform');

var Pixelmap = require('../lib/pixelmap');
var Pixel = require('../lib/pixel');
var Seam = require('../lib/seam');

describe('Transform', function() {

    var pixels = [];
    var pixelmap;

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

        pixelmap = new Pixelmap(pixels);

    });

    it('can be created', function() {

        var transform = new Transform(pixelmap);

        expect(transform).to.be.instanceof(Transform);

    });

    it('getTargetDimension', function() {

        var transform = new Transform(pixelmap);
        var targetDimension = transform.getTargetDimension({
            width:4,
            height:3
        });
        expect(targetDimension.width).to.be.equal(4);
        expect(targetDimension.height).to.be.equal(3);

        var targetDimension = transform.getTargetDimension({
            width:4
        });
        expect(targetDimension.width).to.be.equal(4);
        expect(targetDimension.height).to.be.equal(pixelmap.getHeight());

        var targetDimension = transform.getTargetDimension({
            height:3
        });
        expect(targetDimension.width).to.be.equal(pixelmap.getWidth());
        expect(targetDimension.height).to.be.equal(3);

    });

    it('can flip Pixelmap', function() {

        var transform = new Transform(pixelmap);

        var flipped = transform.flip(pixelmap);

        expect(flipped).to.be.instanceof(Pixelmap);
        expect(flipped.getHeight()).to.be.equal(pixelmap.getWidth());
        expect(flipped.getWidth()).to.be.equal(pixelmap.getHeight());

    });

    it('can addSeams', function() {

        var transform = new Transform(pixelmap);

        var largerPixelmap = transform.addSeams(6, pixelmap);

        expect(largerPixelmap).to.be.instanceof(Pixelmap);
        expect(largerPixelmap.getWidth()).to.be.equal(6);

        var largerPixelmap = transform.addSeams(20, pixelmap);

        expect(largerPixelmap).to.be.instanceof(Pixelmap);
        expect(largerPixelmap.getWidth()).to.be.equal(7);

    });

    it('can removeSeams', function() {

        var transform = new Transform(pixelmap);

        var smallerPixelmap = transform.removeSeams(4, pixelmap);

        expect(smallerPixelmap).to.be.instanceof(Pixelmap);
        expect(smallerPixelmap.getWidth()).to.be.equal(4);

        var smallerPixelmap = transform.removeSeams(1, pixelmap);

        expect(smallerPixelmap).to.be.instanceof(Pixelmap);
        expect(smallerPixelmap.getWidth()).to.be.equal(3);

    });

    it('can resize', function() {

        var transform = new Transform(pixelmap);

        var sameSizePixelmap = transform.resize({width: pixelmap.getWidth(), height: pixelmap.getHeight()}, pixelmap);

        expect(sameSizePixelmap).to.be.instanceof(Pixelmap);
        expect(sameSizePixelmap.getWidth()).to.be.equal(pixelmap.getWidth());
        expect(sameSizePixelmap.getHeight()).to.be.equal(pixelmap.getHeight());

        var smallerPixelmap = transform.resize({width: 4, height: 3}, pixelmap);

        expect(smallerPixelmap).to.be.instanceof(Pixelmap);
        expect(smallerPixelmap.getWidth()).to.be.equal(4);
        expect(smallerPixelmap.getHeight()).to.be.equal(3);

        var smallerPixelmap = transform.resize({width: 6, height: 5}, pixelmap);

        expect(smallerPixelmap).to.be.instanceof(Pixelmap);
        expect(smallerPixelmap.getWidth()).to.be.equal(6);
        expect(smallerPixelmap.getHeight()).to.be.equal(5);

    });


});

