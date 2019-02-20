wagonwheel = {
    width: 630,
    height: 350,
    lineWidth: 2,
    origin: {
        x: 214,
        y: 157
    },
    scale: {
        x: 0.71,
        y: 0.83
    },
    scaleback: {
        length: 100,
        amount: 0.8
    },
    region: {
        origin: {
            x: 10,
            y: 0
        },
        width: 610,
        height: 350
    },
    background: 'i/hawkeye/WW.jpg',
    clazz: 'ww',
    transform: function(x, y, sign) {
        return {
            x: this.origin.x + (sign * (y * this.scale.x)),
            y: this.origin.y + (sign * (x * this.scale.y))
        };
    },
    colors: {
        1: ['rgba(255,224,11,0)', 'rgba(255,224,11,1)'],
        2: ['rgba(200,200,200,0)', 'rgba(200,200,200,1)'],
        3: ['rgba(200,200,200,0)', 'rgba(200,200,200,1)'],
        4: ['rgba(90,173,250,0)', 'rgba(90,173,250,1)'],
        5: ['rgba(90,173,250,0)', 'rgba(90,173,250,1)'],
        6: ['rgba(226,6,44,0)', 'rgba(226,6,44,1)'],
        7: ['rgba(226,6,44,0)', 'rgba(226,6,44,1)']
    },
    key: {
        x: [453, 608],
        runs: {
            label: 'Runs',
            y: 27,
            color: 'white',
            lcolor: 'white'
        },
        balls: {
            label: 'Balls',
            y: 51,
            color: 'white',
            lcolor: 'white'
        },
        scoring: {
            label: 'Scoring Balls',
            y: 75,
            color: 'white',
            lcolor: 'white'
        },
        runsleg: {
            label: 'Runs Leg-side',
            y: 100,
            color: 'white',
            lcolor: 'white'
        },
        runsoff: {
            label: 'Runs Off-side',
            y: 125,
            color: 'white',
            lcolor: 'white'
        },
        singles: {
            label: 'Singles',
            y: 181,
            color: 'white',
            lcolor: 'white'
        },
        twothrees: {
            label: '2\'s and 3\'s',
            y: 206,
            color: 'white',
            lcolor: 'white'
        },
        fours: {
            label: 'Fours',
            y: 231,
            color: 'white',
            lcolor: 'white'
        },
        sixes: {
            label: 'Sixes',
            y: 256,
            color: 'white',
            lcolor: 'white'
        }
    },

    keyLabelLeftLimit: 306,
    keyLabelRightLimit: 590,
    keyLabelTopLimit: 135,
    keyLabelBottomLimit: 218,
    keyLabelWidth: 21,

    keyDisplayMode: 'labelsandvalues'

};

function WagonWheelRenderer(config)
{
	this.config = config;
	this.selected = -1;
}

WagonWheelRenderer.prototype.setSize = function(sizeProperties)
{
	if (!this.origConfig)
	{
		this.origConfig = Utils.cloneObject(this.config);

		//sets some static values
		this.origConfig.aspect = this.origConfig.region.width / this.origConfig.region.height;
	}

	//set current aspect ration
	this.config.aspect = sizeProperties.width / sizeProperties.height;

	var widerRatio = this.config.aspect >= this.origConfig.aspect;

	var scaleX = (1 / this.origConfig.region.width) * sizeProperties.width;
	var scaleY = (1.1 / this.origConfig.region.height) * sizeProperties.height;

	if (this.config.aspect > 2)
	{
		// Scale based on height if aspect ratio is wider that 16:8, very unlikely
		var scale = this.config.scaleXY = scaleY;
	}
	else
	{
		//scale based on current width
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

	this.offset.x = (sizeProperties.width / 2) - ((this.origConfig.region.origin.x + (this.origConfig.region
		.width / 2)) * scale);
	this.offset.y = (sizeProperties.height / 2) - ((this.origConfig.region.origin.y + (this.origConfig
		.region.height / 2)) * scale);

	this.config.origin.y = (this.origConfig.origin.y * scale) + this.offset.y;
	this.config.origin.x = (this.origConfig.origin.x * scale) + this.offset.x;

	//	this.config.scale.y 	= this.origConfig.scale.y;// * scale;
	//	this.config.scale.x 	= this.origConfig.scale.x;// * scale;

	this.config.scaleback.length = this.origConfig.scaleback.length * scale;

	//make sure the labels are scaled correctly
	for (k in this.origConfig.key)
	{
		if (k === 'x')
		{
			this.config.key[k][0] = this.origConfig.key[k][0] * scale + this.offset.x;
			this.config.key[k][1] = this.origConfig.key[k][1] * scale + this.offset.x;
		}
		else
		{
			this.config.key[k].y = this.origConfig.key[k].y * scale + this.offset.y;
		}
	}

	//scale the label thresholds
	this.config.keyLabelLeftLimit = this.origConfig.keyLabelLeftLimit * scaleX;
	this.config.keyLabelRightLimit = this.origConfig.keyLabelRightLimit * scaleX;
	this.config.keyLabelTopLimit = this.origConfig.keyLabelTopLimit * scaleY;
	this.config.keyLabelBottomLimit = this.origConfig.keyLabelBottomLimit * scaleY;
	this.config.keyLabelWidth = this.origConfig.keyLabelWidth * scaleX;

};

var wagonwheelRenderer = new WagonWheelRenderer(wagonwheel);
wagonwheelRenderer.setSize( { x:0, y:0, width: 1077, height: 598 } );
