function addScreenTrajectories(data){
  data.forEach(function(d, index) {
    var identifier = d.inning_over_ball;

    if (d.ENCODED_TRAJECTORY !== "NULL"){
      var values = getScreenTrajectory(d.ENCODED_TRAJECTORY);
      var trajectoryCoordinates, startCoordinate, pitchCoordinate, endCoordinate;
      [trajectoryCoordinates, startCoordinate, pitchCoordinate, endCoordinate] = values;

      //postMessage(["trajectory", getSpineString(trajectoryCoordinates),identifier]);
      console.log(identifier);

      //if (index < 1000){

        addScreenTrajectory(getCrossSectionString(circlePoints), getSpineString(trajectoryCoordinates),'#00FFFF',"trajectory"+identifier);
        addScreenSphere(getCoordinateString(startCoordinate), "0.07", '#FF69B4', "starting", "startSphere"+identifier);
        addScreenSphere(getCoordinateString(endCoordinate), "0.07", '#FF69B4', "ending", "endSphere"+identifier);

        // the ball can be full toss as well
        if (pitchCoordinate != null){
            addScreenSphere(getCoordinateString(pitchCoordinate), "0.07", '#FF69B4', "pitching", "pitchSphere"+identifier);
        }

    }
  });
}

// mercilessly kill everything that is currently existing within the trajectory tag
function removeScreenTrajectories(){
  var trajectoryNode = document.getElementById('trajectories');
  while (trajectoryNode.firstChild) {
    trajectoryNode.removeChild(trajectoryNode.firstChild);
  }
}
