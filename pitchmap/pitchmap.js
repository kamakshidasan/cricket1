var pitchmapCanvas = d3.select("#pitchmapCanvas");

var pitchmapImage = pitchmapCanvas
                    .append("image")
                    .attr("xlink:href", pitchmap.variants.mix.background);

function getPitchmapCoordinates(xyz, is_rhb){
  var xyz = normalise(xyz);
  xyz.z = 0.036;

  var ball = pitchmap.projection.project(xyz);

  if (is_rhb === "y") {
      ball.x += pitchmap.variants.rh.offset * pitchmapRenderer.config.scaleXY;
  } else {
      ball.x += pitchmap.variants.lh.offset * pitchmapRenderer.config.scaleXY;
  }

  return ball;
}
