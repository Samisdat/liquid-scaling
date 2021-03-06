var Canvas = require('canvas')
  , Image = Canvas.Image
  , fs = require('fs');

var LiquidScaling = require('../index');

var img = new Image
  , start = new Date;

img.onerror = function(err){
  throw err;
};

img.onload = function(){
  var width = img.width;
  var height = img.height;
  var canvas = new Canvas(width, height);
  var ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, width, height);

  var liquidScaling = new LiquidScaling(ctx);
  var heatMapCtx = liquidScaling.resize({
      width:500
  });

  heatMapCtx.canvas.toBuffer(function(err, buf){
    fs.writeFile(__dirname + '/scaled.jpg', buf, function(){
      console.log('Resized and saved in %dms', new Date - start);
    });
  });

}

img.src = __dirname + '/broadway_tower.jpg';
