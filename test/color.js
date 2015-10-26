var expect = require('chai').expect;
var assert = require('chai').assert;

var Color = require('../lib/color');

describe('Color', function() { it('can be created', function() {

    var r = 10;
    var g = 11;
    var b = 12;
    var a = 255;

    var color = new Color(r, g, b, a);

    expect(color).to.be.instanceof(Color);

	}); it('can get/set rgba ', function() {

    var r = 10;
    var g = 11;
    var b = 12;
    var a = 255;

    var color = new Color(r, g, b, a);

    expect(color.get).to.be.a('function');
    expect(color.set).to.be.a('function');

    var rgba = color.get();
    expect(rgba.r).to.equal(r);
    expect(rgba.g).to.equal(g);
    expect(rgba.b).to.equal(b);
    expect(rgba.a).to.equal(a);

    var r = 20;
    var g = 21;
    var b = 22;
    var a = 23;

    color.set(r, g, b, a);
    var rgba = color.get();
    expect(rgba.r).to.equal(r);
    expect(rgba.g).to.equal(g);
    expect(rgba.b).to.equal(b);
    expect(rgba.a).to.equal(a);

	});


});

