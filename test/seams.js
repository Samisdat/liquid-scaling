'use strict';

var expect = require('chai').expect;

var Seams = require('../lib/seams');
var Seam = require('../lib/seam');

describe('Seams', function() {

    it('can be created', function() {

        var seams = new Seams();

        expect(seams).to.be.instanceof(Seams);

    });

    it('can add seam and get them', function() {

        var seams = new Seams();

        expect(seams.getLength()).to.be.equal(0);
        expect(seams.get(0)).to.be.undefined;

        var seam = new Seam(4, 4);
        seams.add(seam);

        expect(seams.getLength()).to.be.equal(1);
        expect(seams.get(0)).to.be.equal(seam);

	});

    it('can filter seams', function() {

        var seams = new Seams();

        var seamOne = new Seam(0, 10)
        seamOne.addRow(0, 10);
        seamOne.addRow(0, 10);
        seamOne.addRow(0, 10);
        seams.add(seamOne);

        var seamTwo = new Seam(1, 20);
        seamTwo.addRow(1, 20);
        seamTwo.addRow(1, 20);
        seamTwo.addRow(1, 20);
        seams.add(seamTwo);

        var seamThree = new Seam(2, 10);
        seamThree.addRow(2, 10);
        seamThree.addRow(1, 10);
        seamThree.addRow(2, 10);
        seams.add(seamThree);

        var seamFour = new Seam(3, 30);
        seamFour.addRow(3, 30);
        seamFour.addRow(3, 30);
        seamFour.addRow(4, 30);
        seams.add(seamFour);

        var seamFive = new Seam(4, 20);
        seamFive.addRow(4, 20);
        seamFive.addRow(4, 20);
        seamFive.addRow(4, 20);
        seams.add(seamFive);

        var seamSix = new Seam(5, 30);
        seamSix.addRow(5, 30);
        seamSix.addRow(4, 30);
        seamSix.addRow(4, 30);
        seams.add(seamSix);

        expect(seams.getLength()).to.be.equal(6);

        seams.filter();

        var uniqueSeams = seams.getUnique();

        expect(uniqueSeams.length).to.be.equal(3);
        expect(seamOne.isUnique()).to.be.equal(true);

        // two and three contain duplicates, three has lower value
        expect(seamTwo.isUnique()).to.be.equal(false);
        expect(seamThree.isUnique()).to.be.equal(true);

        // four, five and six contain duplicates, six has higher value
        expect(seamFour.isUnique()).to.be.equal(false);
        expect(seamFive.isUnique()).to.be.equal(true);
        expect(seamSix.isUnique()).to.be.equal(false);

	});


});

