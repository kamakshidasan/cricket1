var ProjecionCongfig = {
    xyz: {
        x: 5.71221291054471e+001,
        y: -1.74487035898505e-002,
        z: 1.31300009460449e+001
    },
    rpy: {
        r: 0.00100000004750,
        p: -1.77694492740557,
        y: 1.57078523249460
    },
    ar: 1,
    fl: 4.20865283203125e+003,
    center: {
        x: 315,
        y: 175
    }
};

var pitchmap = {
    width: 630,
    height: 350,
    projection: new OldProjection(
        ProjecionCongfig.xyz,
        ProjecionCongfig.rpy,
        ProjecionCongfig.ar,
        ProjecionCongfig.fl,
        ProjecionCongfig.center),
    ballSize: '8px',
    ballImagePath: '//datacdn.iplt20.com/test/client/india-times/i/hawkeye/balls/',
    region: {
        origin: {
            x: 63,
            y: 0
        },
        width: 504,
        height: 350
    },
    variants: {
        rh: {
            background: 'i/hawkeye/SF03-pitchmap-RH.jpg',
            offset: -157.5,
            css: 'pitchmap right',
            clazz: 'pitchmap-right'
        },
        lh: {
            background: 'i/hawkeye/SF03-pitchmap-LH.jpg',
            offset: 157.5,
            css: 'pitchmap left',
            clazz: 'pitchmap-left'
        },
        mix: {
            background: 'i/hawkeye/SF03-pitchmap-split.jpg',
            css: 'pitchmap split',
            clazz: 'pitchmap-split'
        }
    },
    colors: {
        w: 'white',
        0: 'red',
        1: 'blue',
        2: 'blue',
        3: 'blue',
        4: 'yellow',
        5: 'yellow',
        6: 'yellow',
        7: 'yellow'
    }
};

function PitchMapRenderer ( config )
{
	this.config = config;
}

PitchMapRenderer.prototype.setSize = function ( sizeProperties )
{
	console.log( 'setSize x=' + sizeProperties.x +
			                  ' y=' + sizeProperties.y +
			                  ' w=' + sizeProperties.width +
			                  ' h=' + sizeProperties.height );

	if( this.config.region )
	{
		if( !this.origConfig )
		{
			this.origConfig = Utils.cloneObject( this.config );

			this.origConfig.aspect = this.origConfig.region.width / this.origConfig.region.height;
		}

		//set current aspect ration
		this.config.aspect = sizeProperties.width / sizeProperties.height;

		var widerRatio = this.config.aspect >= this.origConfig.aspect;
		var scaleX = ( 1 / this.origConfig.region.width ) * sizeProperties.width;
		var scaleY = ( 1.1 / this.origConfig.region.height ) * sizeProperties.height;

		var scale;
		if( widerRatio )
		{
			this.config.scaleXY = scaleY;
		}
		else
		{
			this.config.scaleXY = scaleX;
		}
		scale = this.config.scaleXY;
		console.log( 'Scale is set to ' + scale );

		//create canvas dimensions and offset

		this.dimensions = {};

		this.config.width = this.dimensions.x = this.origConfig.width * scale;
		this.config.height = this.dimensions.y = this.origConfig.height * scale;

		this.cropDimensions = {};

		this.cropDimensions.x = this.origConfig.region.width * scale;
		this.cropDimensions.y = this.origConfig.region.height * scale;

		this.cropOffset = {};

		this.cropOffset.x = ( sizeProperties.width / 2 ) - ( ( this.origConfig.region.width / 2 ) * scale );
		this.cropOffset.y = ( sizeProperties.height / 2 ) - ( ( this.origConfig.region.height / 2 ) * scale );

		this.offset = {};

		this.offset.x = ( sizeProperties.width / 2 ) - ( ( this.origConfig.region.origin.x + ( this.origConfig.region.width / 2 ) ) * scale );
		this.offset.y = ( sizeProperties.height / 2 ) - ( ( this.origConfig.region.origin.y + ( this.origConfig.region.height / 2 ) ) * scale );

		this.config.ballSize = 6;
		this.config.projection.fl = this.origConfig.projection.fl * scale;
		this.config.projection.center.x = this.offset.x + ( this.config.width / 2 );
		this.config.projection.center.y = this.offset.y + ( this.config.height / 2 );
	}
	else
	{
		if( !this.origConfig )
		{
			this.origConfig = Utils.cloneObject( this.config );
			//sets some static values
			this.origConfig.aspect = this.origConfig.width / this.origConfig.height;
		}

		//set current aspect ration
		this.config.aspect = sizeProperties.width / sizeProperties.height;

		if( this.config.aspect >= this.origConfig.aspect )
		{
			//if this canvas is wider than the original
			//scale based on current height
			var scale = this.config.scale = ( 1 / this.origConfig.height ) * sizeProperties.height;
		}
		else
		{
			//scale based on current width
			var scale = this.config.scale = ( 1 / this.origConfig.width ) * sizeProperties.width;
		}

		console.log( 'Scale is set to ' + scale );

		this.config.height 	= this.origConfig.height * scale;
		this.config.width 	= this.origConfig.width * scale;

		this.config.ballSize= Utils.numberToPixelString( Utils.pixelStringToNumber( this.origConfig.ballSize ) * scale > 11 ? 12 : 8 );
		this.config.projection.fl = this.origConfig.projection.fl * scale;
		this.config.projection.center.x = sizeProperties.width / 2;
		this.config.projection.center.y = sizeProperties.height / 2;
	}
};

var pitchmapRenderer = new PitchMapRenderer( pitchmap );
pitchmapRenderer.setSize( { x:0, y:0, width: 1078, height: 598 } );
