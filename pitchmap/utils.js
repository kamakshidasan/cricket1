var Utils = {

    cloneObject: function(object) {
        var newObject = {};
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if ('object' === typeof object[property]) {
                    newObject[property] = this.cloneObject(object[property]);
                } else {
                    newObject[property] = object[property];
                }
            }
        }
        return newObject;
    },

    numberToPixelString: function(number) {
        return number + 'px';
    }

};

normalise = function ( xyz ) {
    return{ x: xyz.x - 10.06, y: xyz.y, z: xyz.z };
};


covertWWToCoaching = function ( wwX, wwY )
{
	var scaleX = 4.05;
	var scaleY = 3.45;
	var offsetX = -130.33;
	var offsetY = -163.64;

	return { x: ( ( wwY * scaleX ) + offsetX ), y : ( ( wwX * scaleY ) + offsetY ) };
};
