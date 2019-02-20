var wagonwheelCanvas = d3.select("#wagonwheelCanvas");

var wagonwheelImage = wagonwheelCanvas
                    .append("image")
                    .attr("xlink:href", wagonwheel.background);

function getWagonwheelCoordinates(xyz){
  var landing = covertWWToCoaching(xyz.x, xyz.y);
  if(landing.x > -999 && landing.y > -999){
    var screenPos = wagonwheelRenderer.config.transform(landing.x * wagonwheelRenderer.config.scaleXY, landing.y * wagonwheelRenderer.config.scaleXY, 1);
    return screenPos;
  }
  else{
    return -1;
  }
}
