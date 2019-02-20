var BeehiveCongfig = {

    xyz: {
        x: 1.19629250340501e+001,
        y: 4.44219825170092e-003,
        z: 1.41549010276794e+000
    },
    rpy: {
        r: 0.00000000000000,
        p: -1.58300000638701,
        y: 1.56240000052247
    },
    ar: 1,
    fl: 1.49774475097656e+003,
    center: {
        x: 315,
        y: 175
    }
};

var beehive = {
    width: 630,
    height: 350,
    region: {
        origin: {
            x: 63,
            y: 0
        },
        width: 504,
        height: 350
    },
    projection: new OldProjection(
        BeehiveCongfig.xyz,
        BeehiveCongfig.rpy,
        BeehiveCongfig.ar,
        BeehiveCongfig.fl,
        BeehiveCongfig.center),
    ballSize: 7,
    ballImagePath: '//datacdn.iplt20.com/test/client/india-times/i/hawkeye/balls/',
    variants: {
        rh: {
            background: 'i/hawkeye/CF05_Beehive_RH.jpg',
            clazz: 'beehive-right',
            css: 'beehive right'
        },
        lh: {
            background: 'i/hawkeye/CF05_Beehive_LH.jpg',
            clazz: 'beehive-left',
            css: 'beehive left'
        },
        mix: {
            background: 'i/hawkeye/CF05_Beehive_RH.jpg',
            clazz: 'beehive',
            css: 'beehive'
        }
    },
    colors: {
        w: 'white',
        d: 'red',
        o: 'blue',
        ob: 'cyan',
        l: 'yellow',
        lb: 'orange'
    }
};

function BeehiveRenderer(config)
{
  this.config = config;
}

BeehiveRenderer.prototype.setSize = function(sizeProperties)
{
	if (this.config.region)
	{
		if (!this.origConfig)
		{
			this.origConfig = Utils.cloneObject(this.config);

			this.origConfig.aspect = this.origConfig.region.width / this.origConfig.region.height;
		}

		//set current aspect ration
		this.config.aspect = sizeProperties.width / sizeProperties.height;

		var widerRatio = this.config.aspect >= this.origConfig.aspect;
		var scaleX = (1 / this.origConfig.region.width) * sizeProperties.width;
		var scaleY = (1.1 / this.origConfig.region.height) * sizeProperties.height;

		if (widerRatio)
		{
			var scale = this.config.scaleXY = scaleY;
		}
		else
		{
			var scale = this.config.scaleXY = scaleX;
		}

		//create canvas dimensions and offset

		this.dimensions = {};

		this.config.width = this.dimensions.x = this.origConfig.width * scale;
		this.config.height = this.dimensions.y = this.origConfig.height * scale;

		this.cropDimensions = {};

		this.cropDimensions.x = this.origConfig.region.width * scale;
		this.cropDimensions.y = this.origConfig.region.height * scale;

		this.cropOffset = {};

		this.cropOffset.x = (sizeProperties.width / 2) - ((this.origConfig.region.width / 2) * scale);
		this.cropOffset.y = (sizeProperties.height / 2) - ((this.origConfig.region.height / 2) * scale);

		this.offset = {};

		this.offset.x = (sizeProperties.width / 2) - ((this.origConfig.region.origin.x + (this.origConfig
			.region.width / 2)) * scale);
		this.offset.y = (sizeProperties.height / 2) - ((this.origConfig.region.origin.y + (this.origConfig
			.region.height / 2)) * scale);

		this.config.projection.fl = this.origConfig.projection.fl * scale;
		this.config.projection.center.x = this.offset.x + (this.config.width / 2);
		this.config.projection.center.y = this.offset.y + (this.config.height / 2);
	}
	else
	{
		if (!this.origConfig)
		{
			this.origConfig = Utils.cloneObject(this.config);
			//sets some static values
			this.origConfig.aspect = this.origConfig.width / this.origConfig.height;
		}

		//set current aspect ration
		this.config.aspect = sizeProperties.width / sizeProperties.height;

		if (this.config.aspect >= this.origConfig.aspect)
		{
			//if this canvas is wider than the original
			//scale based on current height
			var scale = this.config.scale = (1 / this.origConfig.height) * sizeProperties.height;
		}
		else
		{
			//scale based on current width
			var scale = this.config.scale = (1 / this.origConfig.width) * sizeProperties.width;
		}

		this.config.height = this.origConfig.height * scale;
		this.config.width = this.origConfig.width * scale;

		this.config.projection.fl = this.origConfig.projection.fl * scale;
		this.config.projection.center.x = sizeProperties.width / 2;
		this.config.projection.center.y = sizeProperties.height / 2;
	}
};

var beehiveRenderer = new BeehiveRenderer(beehive);
beehiveRenderer.setSize( { x:0, y:0, width: 1077, height: 598 } );
