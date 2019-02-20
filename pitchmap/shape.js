var Point = function(x, y, z) {
	this.x, this.y, this.z,
	this.x = x;
	this.y = y;
	this.z = z;
}

function generatePoint (radius, angleInRad) {
    var x = radius * Math.cos(angleInRad);
    var y = radius * Math.sin(angleInRad);
    var z = 0.0;
    var point = new Point(x, y, z);
    return point;
}

var Circle = function() {
	this.circlePoints;
	this.circlePoints = new Array();
}

Circle.prototype.generateCircle = function(radius, thetaInRad) {
	var point;
	var angle;

	var arrayLength = 2*thetaInRad + 1;
	this.circlePoints = new Array(arrayLength);

    for(var circleIndex=0; circleIndex<arrayLength; circleIndex++){
        angle = (circleIndex * Math.PI)/thetaInRad;
        point = generatePoint(radius,angle);
        this.circlePoints[circleIndex] = point;
    }
    return this.circlePoints;
}

// use this for all trajectories
var circle = new Circle();
var radius = 0.05;
var samplePoints = 24;
var circlePoints = circle.generateCircle(radius, samplePoints);
