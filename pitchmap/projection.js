function OldProjection( xyz, rpy, ar, fl, center )
{
	this.xyz 	= xyz;
	this.rpy 	= rpy;
	this.ar  	= ar;
	this.fl  	= fl;
	this.center = center;
	this.LUT 	= [ [ 0, 1, 2 ], [ 1, 0, 2 ], [2, 0, 1] ];
}

OldProjection.prototype.distanceSquared = function ( world )
{
    var dx = world.x - this.xyz.x;
    var dy = world.y - this.xyz.y;
    var dz = world.z - this.xyz.z;
    var dsquared = dx*dx + dy*dy + dz*dz;
    return dsquared;
};

OldProjection.prototype.project = function ( world )
{
	if ( this.rot === undefined )
	{
		this.rot = this.makeRotation();
	}

	var newWorld = [ world.x - this.xyz.x, world.y - this.xyz.y, world.z - this.xyz.z ];
	var cam = this.matrixVectorMultiply( this.rot, newWorld );

	if ( cam[2] < 1e-9 )
	{
		cam[2] = -1e-9;
	}

    var x = this.center.x + ( ( cam[0] / cam[2] ) * this.fl );
    var y = this.center.y + ( ( cam[1] / cam[2] ) * this.fl * this.ar );
    return { x:x, y:y, dsquared:this.distanceSquared( world ) };
};

// Returns a 3x3 matrix
OldProjection.prototype.makeRotation = function()
{
    var mRoll  = this.axisRotation( 2, this.rpy.r );
    var mPitch = this.axisRotation( 0, this.rpy.p );
    var mYaw   = this.axisRotation( 2, this.rpy.y );

    var m = this.matrixMatrixMultiply( mRoll, mPitch );
    m = this.matrixMatrixMultiply( m, mYaw );

    return m;
};

// Returns a 3x3 matric
OldProjection.prototype.axisRotation = function( axis, angle )
{
    var i0 = this.LUT[axis][0];
    var i1 = this.LUT[axis][1];
    var i2 = this.LUT[axis][2];

    var rot = [ [0,0,0], [0,0,0], [0,0,0] ];
    rot[i0][i0] = 1.0;
    rot[i1][i1] = Math.cos( angle );
    rot[i2][i2] = Math.cos( angle );
    rot[i1][i2] = Math.sin( angle );
    rot[i2][i1] = -rot[i1][i2];

    return rot;
};

// Returns a 3x3 matrix
OldProjection.prototype.matrixMatrixMultiply = function( a, b )
{
	return [
	        [ a[0][0]*b[0][0] + a[0][1]*b[1][0] + a[0][2]*b[2][0], a[0][0]*b[0][1] + a[0][1]*b[1][1] + a[0][2]*b[2][1], a[0][0]*b[0][2] + a[0][1]*b[1][2] + a[0][2]*b[2][2] ],
	        [ a[1][0]*b[0][0] + a[1][1]*b[1][0] + a[1][2]*b[2][0], a[1][0]*b[0][1] + a[1][1]*b[1][1] + a[1][2]*b[2][1],	a[1][0]*b[0][2] + a[1][1]*b[1][2] + a[1][2]*b[2][2] ],
            [ a[2][0]*b[0][0] + a[2][1]*b[1][0] + a[2][2]*b[2][0], a[2][0]*b[0][1] + a[2][1]*b[1][1] + a[2][2]*b[2][1],	a[2][0]*b[0][2] + a[2][1]*b[1][2] + a[2][2]*b[2][2] ]
	       ];
};

// Returns a 3x3 matrix
OldProjection.prototype.matrixVectorMultiply = function( a, b )
{
	return [ a[0][0]*b[0] + a[0][1]*b[1] + a[0][2]*b[2],
	         a[1][0]*b[0] + a[1][1]*b[1] + a[1][2]*b[2],
	         a[2][0]*b[0] + a[2][1]*b[1] + a[2][2]*b[2] ];
};
