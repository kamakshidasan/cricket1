var rightHandBeehiveCanvas = d3.select("#rightHandBeehiveCanvas");
var leftHandBeehiveCanvas = d3.select("#leftHandBeehiveCanvas");

var rightHandBeehiveImage = rightHandBeehiveCanvas
                    .append("image")
                    .attr("xlink:href", beehive.variants.rh.background);

var leftHandBeehiveImage = leftHandBeehiveCanvas
                    .append("image")
                    .attr("xlink:href", beehive.variants.lh.background);


function getBeehiveCoordinates(xyz, is_rhb){
  var xyz = normalise( xyz );
  if (xyz.x > -999 && xyz.y > -999){
    if (is_rhb === "n"){
      xyz.y = -xyz.y;
    }
    var screenBeehive = beehiveRenderer.config.projection.project(xyz);
    return screenBeehive;
  }
  else{
    return -1;
  }
}
