var expect = require('chai').expect;
var assert = require('chai').assert;

var LiquidColor = require('../lib/liquid-color');

describe('LiquidColor', function() {

    it('can be created', function() {

        var liquidColor = new LiquidColor(10, 11, 12, 255);

        expect(liquidColor).to.be.instanceof(LiquidColor);

	});

    it('can get/set heat', function() {

        var liquidColor = new LiquidColor(10, 11, 12, 255);

        expect(liquidColor.getHeat()).to.be.undefined;

        liquidColor.setHeat(1000);
        expect(liquidColor.getHeat()).to.be.equal(1000);

	});

    it('can idendify as deleted and marked as deleted', function() {

        var liquidColor = new LiquidColor(10, 11, 12, 255);

        expect(liquidColor.isDeleted()).to.be.false;

        liquidColor.markAsDeleted();
        expect(liquidColor.isDeleted()).to.be.true;

    });


});

