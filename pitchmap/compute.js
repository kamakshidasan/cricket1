function getScreenTrajectory(encoded){
  var trajectory = parseTrajectory(encoded);
  var timestepInterval = 0.04;
  var trajectoryCoordinates = [];

  var startCoordinate, pitchCoordinate, endCoordinate;

  for(var currentTime = trajectory.period.start; currentTime <= trajectory.period.end; currentTime += timestepInterval){

    //if(currentTime > trajectory.bt){
      var currentCoordinate = getBallOnScreen(trajectory, currentTime);
      trajectoryCoordinates.push(currentCoordinate);
    //}

    // make sure ball pitch also gets captured
    var nextTime = currentTime + timestepInterval;
    if (currentTime < trajectory.bt && nextTime > trajectory.bt){
      var currentCoordinate = getBallOnScreen(trajectory, trajectory.bt);
      trajectoryCoordinates.push(currentCoordinate);
    }
  }

  // forcefully push endCoordinate -- in case we increase timestep interval to reduce memory
  trajectoryCoordinates.push(getBallOnScreen(trajectory, trajectory.period.end));

  startCoordinate = getBallOnScreen(trajectory, trajectory.period.start);
  pitchCoordinate = getBallOnScreen(trajectory, trajectory.bt);
  endCoordinate = getBallOnScreen(trajectory, trajectory.period.end);

  return [trajectoryCoordinates, startCoordinate, pitchCoordinate, endCoordinate];
}

function getCoordinateString(coordinate){
  return coordinate.x + " " + coordinate.y + " " + coordinate.z + " ";
}

function getSpineString(trajectoryCoordinates){
  var spineValue = "";
  for (var j = 0; j < trajectoryCoordinates.length; j++) {
    spineValue += getCoordinateString(trajectoryCoordinates[j]);
  }
  return spineValue;
}

function getCrossSectionString(circlePoints){
  var crossSectionValue = "";
  for (var j = 0; j < circlePoints.length; j++) {
    var x = Math.round(circlePoints[j].x * 10000)/10000;
    var y = Math.round(circlePoints[j].y * 10000)/10000;
    crossSectionValue += x + " " + y + " ";
  }
  return crossSectionValue;
}

function addScreenTrajectory(crossSectionValue, spineValue, color, identifier){
  var trajectoryTag = document.getElementById("trajectories");
  var shapeElement = document.createElement("Shape");
  var appearanceElement = document.createElement("Appearance");
  var materialElement = document.createElement("Material");
  var extrusionElement = document.createElement("Extrusion");

  shapeElement.setAttribute('data-shapetype', "trajectory");
  shapeElement.setAttribute('id', identifier);
  materialElement.setAttribute('diffuseColor', color);
  materialElement.setAttribute('id', "material"+identifier);
  extrusionElement.setAttribute('crossSection', crossSectionValue);
  extrusionElement.setAttribute('spine', spineValue);


  appearanceElement.appendChild(materialElement);
  shapeElement.appendChild(appearanceElement);
  shapeElement.appendChild(extrusionElement);
  trajectoryTag.appendChild(shapeElement);
}

function addScreenSphere(coordinateString, radius, colour, def, identifier){
  var trajectoryTag = document.getElementById("trajectories");
  var transformElement = document.createElement("Transform");
  var shapeElement = document.createElement("Shape");
  var appearanceElement = document.createElement("Appearance");
  var materialElement = document.createElement("Material");
  var sphereElement = document.createElement("Sphere");

  shapeElement.setAttribute('id', identifier);
  shapeElement.setAttribute('data-shapetype', def);
  materialElement.setAttribute('diffuseColor', colour);
  transformElement.setAttribute('translation', coordinateString);
  sphereElement.setAttribute('radius', radius);
  appearanceElement.appendChild(materialElement);
  shapeElement.appendChild(appearanceElement);
  shapeElement.appendChild(sphereElement);
  transformElement.appendChild(shapeElement);
  trajectoryTag.appendChild(transformElement);
}

function toggleShape(shapeType){
  var x = document.getElementsByTagName("shape");
  for(i = 0; i < x.length; i++){
      var shapeDef = x[i].getAttribute("data-shapetype");
      var renderShape = x[i].getAttribute("render");

      if(shapeDef === shapeType){
        if(renderShape === "true"){
          x[i].render = "false";
        }
        else{
          x[i].render = "true";
        }
      }
  }
}
