'use strict';

var heatmap = function(pixels){

    var rows = pixels.length;
    var cols = pixels[0].length;

    var maxHeat = 0;

    var getMaxHeat = function(){
        return maxHeat;
    };

    var setMaxHeat = function(){

        var maxHeatInRows = [];

        for (var row = 0; row < rows; row += 1) {

            var maxHeatInRow = [];

            for (var col = 0; col < cols; col += 1) {

                maxHeatInRow.push(pixels[row][col].getHeat());

            }

            maxHeatInRows.push(Math.max.apply(Math, maxHeatInRow));

        }

        maxHeat = Math.max.apply(Math, maxHeatInRows);

    };

    var sumColorChanels = function(col, row){

        if (0 > col || 0 > row || row >= rows || col >= cols) {

            return 0;

        }

        var color = pixels[row][col].getColor();

        return (color.r + color.g + color.b);

    };

    // the heatmap implenentation from https://github.com/axemclion/seamcarving generates ver high values for all four edges
    // for now: just replace all edge pixels with their neibours
    var correctHeatMap = function(){

        var lastRow = rows - 1;
        var lastCol = cols - 1;

        for (var x = 0; x < cols; x += 1) {

            pixels[0][x].setHeat(
                pixels[1][x].getHeat()
            );

            pixels[lastRow][x].setHeat(
                pixels[(lastRow - 1)][x].getHeat()
            );

        }

        for (var y = 0; y < rows; y += 1) {

            pixels[y][0].setHeat(
                pixels[y][1].getHeat()
            );

            pixels[y][lastCol].setHeat(
                pixels[y][(lastCol - 1)].getHeat()
            );

        }

    };


    for (var x = 0; x < cols; x += 1) {

        for (var y = 0; y < rows; y++) {

            var xenergy = sumColorChanels(x - 1, y - 1) + 2 * sumColorChanels(x - 1, y) + sumColorChanels(x - 1, y + 1) - sumColorChanels(x + 1, y - 1) - 2 * sumColorChanels(x + 1, y) - sumColorChanels(x + 1, y + 1);
            var yenergy = sumColorChanels(x - 1, y - 1) + 2 * sumColorChanels(x, y - 1) + sumColorChanels(x + 1, y - 1) - sumColorChanels(x - 1, y + 1) - 2 * sumColorChanels(x, y + 1) - sumColorChanels(x + 1, y + 1);
            pixels[y][x].setHeat(Math.sqrt(xenergy * xenergy + yenergy * yenergy) );
        }
    }

    correctHeatMap();
    setMaxHeat();


    return {
        getMaxHeat: getMaxHeat
    };
};

module.exports = heatmap;
