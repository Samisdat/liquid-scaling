'use strict';

var expect = require('chai').expect;

var Seam = require('../lib/seam');

describe('Seam', function() {

    it('can be created', function() {

        var seam = new Seam(0, 4);

        expect(seam).to.be.instanceof(Seam);

    });

    it('can get value', function() {

        var seam = new Seam(0, 4);

        expect(seam.getValue()).to.be.equal(4);

        seam.addRow(1, 10);
        expect(seam.getValue()).to.be.equal(14);
    });

    it('can handle addRow, getLast and getRow', function() {

        var seam = new Seam(4, 4);

        expect(seam.getValue()).to.be.equal(4);
        expect(seam.getLast()).to.be.equal(4);

        seam.addRow(5, 10);
        expect(seam.getLast()).to.be.equal(5);
        expect(seam.getRow(1)).to.be.equal(5);

	});

    it('can count rows', function() {

        var seam = new Seam(4, 4);
        expect(seam.getRows()).to.be.equal(1);

        seam.addRow(5, 10);
        expect(seam.getRows()).to.be.equal(2);

        seam.addRow(5, 10);
        seam.addRow(5, 10);
        expect(seam.getRows()).to.be.equal(4);

    });

    it('can idendify as unique and marked as duplicate', function() {

        var seam = new Seam(4, 4);

        expect(seam.isUnique()).to.be.equal(true);

        seam.markDuplicate();
        expect(seam.isUnique()).to.be.equal(false);

    });


});

