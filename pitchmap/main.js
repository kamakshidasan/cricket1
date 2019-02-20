var inningsChart = dc.pieChart("#dc-innings-chart");
var runsCountChart = dc.barChart("#dc-runscount-chart");
var dotBallsChart = dc.pieChart("#dc-dotballs-chart");
var speedCountChart = dc.barChart("#dc-speedcount-chart");
var stackedOverChart = dc.barChart("#dc-stacked-chart");
var batsmenChart = dc.rowChart("#dc-batsmen-chart");
var handChart = dc.pieChart("#dc-hand-chart");
var bowlingTypeChart = dc.pieChart("#dc-bowlingtype-chart");
var bowlingFromChart = dc.pieChart("#dc-bowlingfrom-chart");
var bowlersChart = dc.rowChart("#dc-bowlers-chart");
var runsChart = dc.barChart("#dc-runs-chart");
var speedChart = dc.seriesChart("#dc-speed-chart");
var bowlingDetailChart = dc.rowChart("#dc-bowlingdetail-chart");
var pitchmapChart = dc.bubbleOverlay("#dc-pitchmap-bubblechart").svg(d3.select("#dc-pitchmap-bubblechart svg"));
var rightBeehiveChart = dc.bubbleOverlay("#dc-rightbeehive-bubblechart").svg(d3.select("#dc-rightbeehive-bubblechart svg"));
var leftBeehiveChart = dc.bubbleOverlay("#dc-leftbeehive-bubblechart").svg(d3.select("#dc-leftbeehive-bubblechart svg"));
var wagonwheelChart = dc.bubbleOverlay("#dc-wagonwheel-bubblechart").svg(d3.select("#dc-wagonwheel-bubblechart svg"));
var footChart = dc.rowChart("#dc-foot-chart");
var connectionChart = dc.rowChart("#dc-connection-chart");
var shotsChart = dc.rowChart("#dc-shots-chart");
var fielderPositionChart = dc.rowChart("#dc-position-chart");
var fielderChart = dc.rowChart("#dc-fielder-chart");
var commentTable = dc.dataTable("#dc-comment-table");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1e-6)
    .style("background", "rgba(250,250,250,.7)");

var comment_dictionary = {};
var global_balls; // haha

var filename = document.getElementById("filename").innerHTML;

// load data from a csv file
d3.csv("together-35063.csv").then(function(data) {
  // format our data
   data.forEach(function(d, index) {
     d.pitchmapid = "id" + d.inning_over_ball;
     d.beehiveid = "id" + d.inning_over_ball;
     d.alternateBeehiveid = "id" + d.inning_over_ball;
     d.wagonwheelid = "id" + d.inning_over_ball;

     d.period = +d.period;
     d.over_number = +d.over_number-1;
     d.over_period = parseFloat(d.over_number + "." +d.period_text);

     d.ball_unique = ((d.over_unique).split("."))[1];
     d.normalized_ball = +parseFloat(d.over_number + "." + d.period + "" + d.ball_unique);

     if(d.bowling_from === "1"){
       d.bowling_from_name = "Over the Wicket";
     }
     else{
       d.bowling_from_name = "Around the Wicket";
     }

     d.pitchmapCoordinates = getPitchmapCoordinates({x: +d.PITCHED_X, y: +d.PITCHED_Y, z: 0}, d.IS_RHB);
     d.beehiveCoordinates = getBeehiveCoordinates({x: 0, y: +d.STUMPS_Y, z: +d.STUMPS_Z}, d.IS_RHB);
     d.wagonwheelCoordinates = getWagonwheelCoordinates({x: +d.LANDING_X, y: +d.LANDING_Y, z: 0});

     // goes to keeper
     if(d.LANDING_X == 5 && d.LANDING_Y == 5){
       d.wagonwheelCoordinates = {x: 365, y:200};
     }

     comment_dictionary[d.inning_over_ball] = d.commentary_short_text + ", " + d.commentary_text;

   });

  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(data);
  var all = facts.groupAll();

  // list of dimensions and groups

  // innings dimension
  var inningsDimension = facts.dimension(function (d){
    return d.period_text;
  });

  var inningsGroup = inningsDimension.group();

  // dimension with over and innnings
  var overInningDimension = facts.dimension(function(d) {
    return multikey(d.over_number, d.period);
  });

  var overInningGroup = overInningDimension.group().reduceCount();
  var stackedGroup = stack_second(overInningGroup);

  var periodExtent = d3.extent(data, function(d){return d.over_period;});
  var speedExtent = d3.max(data, function(d){return +d.speed;});
  var overExtent = d3.extent(data, function(d){return +d.over_number;});
  var inningsCount = d3.max(data, function(d){return +d.period;});

  var ballDimension = facts.dimension(function(d) {return d.inning_over_ball;});
  var outlierBallDimension = facts.dimension(function(d) {return +d.normalized_ball;});

  var speedGroup = ballDimension.group().reduceSum(function(d){return +d.speed;});
  var positveSpeedGroup = remove_null_speed(speedGroup, overInningGroup, 50);

  // rounded
  var speedDimension = facts.dimension(function (d) {
    return +parseInt(d.speed);
  });
  var speedValueGroup = speedDimension.group();

  // batsmen runs dimension
  var batsmenDimension = facts.dimension(function (d) {
    return d.batsman_display_name;
  });
  var batsmenGroup = batsmenDimension.group().reduceSum(function(d){return +d.batsman_runs_scored;});
  var batsmenBallsGroup = batsmenDimension.group().reduceCount();

  // right hand dimension
  var handDimension = facts.dimension(function (d) {
    return d.IS_RHB;
  });

  var handGroup = handDimension.group();

  // bowling type dimension
  var bowlingTypeDimension = facts.dimension(function (d) {
    return d.bowling_type_name;
  });

  var bowlingTypeGroup = bowlingTypeDimension.group();

  // bowling over/around the wicket
  var bowlingFromDimension = facts.dimension(function (d) {
    return d.bowling_from_name;
  });

  var bowlingFromGroup = bowlingFromDimension.group();

  // bowlers
  var bowlersDimension = facts.dimension(function (d) {
  	return d.bowler_display_name;
  });
  var bowlersGroup = bowlersDimension.group();

  // team runs timeline
  var inningBallDimension = facts.dimension(function (d) {
    return d.over_period;
  });

  var runsGroup = inningBallDimension.group().reduceSum(function(d){return +d.team_runs;});
  var runsGroupCount = inningBallDimension.group().reduceCount();

  var bowlerRunsGroup = bowlersDimension.group().reduceSum(function(d){return +d.bowler_runs_conceded;});

  var bowlerWicketsGroup = bowlersDimension.group().reduceSum(
    function(d){
      if(d.is_dismissal_bowled  === "True"){
        return 1;
      }
      else{
        return 0;
      }
    }
  );

var bowlerDotsGroup = bowlersDimension.group().reduceSum(
    function(d){
      if(d.bowler_runs_conceded === 0){
        return 1;
      }
      else{
        return 0;
      }
    }
  );

  // Create bowling detail dimension
  var bowlingDetailDimension = facts.dimension(function (d) {
    return d.bowling_detail_name;
  });

  var bowlingDetailGroup = bowlingDetailDimension.group();

  var pitchmapDimension = facts.dimension(function (d) {
    return d.pitchmapid;
  });

  var pitchmapGroup = pitchmapDimension.group().reduceCount();

  var beehiveDimension = facts.dimension(function (d) {
    return d.beehiveid;
  });

  var beehiveGroup = beehiveDimension.group();

  // alternate dimension
  var alternateBeehiveDimension = facts.dimension(function (d) {
    return d.alternateBeehiveid;
  });

  var alternateBeehiveGroup = alternateBeehiveDimension.group();

  // wagonwheel dimension
  var wagonwheelDimension = facts.dimension(function (d) {
    return d.wagonwheelid;
  });

  var wagonwheelGroup = wagonwheelDimension.group().reduceCount();

  var runsDimension = facts.dimension(function (d) {
    return +d.team_runs;
  });

  var runsCountGroup = runsDimension.group().reduceCount();

  var dotsDimension = facts.dimension(function (d) {
    if(+d.team_runs > 0){
      return 1;
    }
    else{
      return 0;
    }
  });

  var dotsGroup = dotsDimension.group();

  // we want the bar chart for runs scored to show maiden overs also
  var positiveRuns = make_positive_runs(runsGroup, runsGroupCount);

  var oversDimension = facts.dimension(function (d) {
    return +d.over_number;
  });

  var wicketDimensionGroup = oversDimension.group().reduceSum(
    function(d){
      if(d.is_dismissal === "True"){
        return 1;
      }
      else{
        return 0;
      }
    }
  );

  // foot movement
  var footDimension = facts.dimension(function (d) {
    return d.foot_movement_name;
  });

  var footDimensionGroup = footDimension.group();

  // batting connection
  var connectionDimension = facts.dimension(function (d) {
    return d.batting_connection_name;
  });

  var connectionDimensionGroup = connectionDimension.group();

  var nonEmptyConnection = remove_empty_connection(connectionDimensionGroup);


  // shots played
  var shotsDimension = facts.dimension(function (d){
    return d.shot_type_name;
  });
  var shotsGroup = shotsDimension.group();

  // fielder position
  var fielderPositionDimension = facts.dimension(function (d){
    return d.fielder_position;
  });
  var fielderPositionGroup = fielderPositionDimension.group();

  // fielder names
  var fielderDimension = facts.dimension(function (d) {
    return d.fielder_name_1;
  });

  //do not remove empty
  var fielderGroup = fielderDimension.group();

  // time dimension
  var timeDimension = facts.dimension(function (d) {
    return d.ball_unique;
  });

  // count all the facts
  var countChart = dc.dataCount(".dc-data-count")
    .dimension(facts)
    .group(all);

  pitchmapChart
    .width(1078)
    .height(598)
    .dimension(pitchmapDimension)
    .group(pitchmapGroup)
    .radiusValueAccessor(function(p) {
        //console.log("pitchmap: " + p.key + " " + p.value);
        if (p.value === 0){
          return 0;
        }
        return 0.0001;
    })
    .r(d3.scaleLinear().domain([0, 100]))
    .colors(["orange"])
    .renderLabel(false)
    .renderTitle(false);

  data.forEach(function(d) {
    pitchmapChart.point(d.pitchmapid, d.pitchmapCoordinates.x, d.pitchmapCoordinates.y);
  });

  rightBeehiveChart.width(1077)
    .height(598)
    .dimension(alternateBeehiveDimension)
    .group(alternateBeehiveGroup)
    .radiusValueAccessor(function(p) {
        if (p.value === 0){
          return 0;
        }
        return 0.0001;
    })
    .r(d3.scaleLinear().domain([0, 100]))
    .colors(["orange"])
    .renderLabel(false)
    .renderTitle(false);

  leftBeehiveChart.width(1077)
    .height(598)
    .dimension(beehiveDimension)
    .group(beehiveGroup)
    .radiusValueAccessor(function(p) {
        if (p.value === 0){
          return 0;
        }
        return 0.0001;
    })
    .r(d3.scaleLinear().domain([0, 100]))
    .colors(["orange"])
    .renderLabel(false)
    .renderTitle(false);

    data.forEach(function(d) {
        if(d.IS_RHB === "y"){
          rightBeehiveChart.point(d.alternateBeehiveid, d.beehiveCoordinates.x, d.beehiveCoordinates.y);
        }
        else{
          leftBeehiveChart.point(d.beehiveid, d.beehiveCoordinates.x, d.beehiveCoordinates.y);
        }
    });


  wagonwheelChart.width(1077)
    .height(598)
    .dimension(wagonwheelDimension)
    .group(wagonwheelGroup)
    .radiusValueAccessor(function(p) {
        //console.log("wagonwheel" + p.key + " " + p.value);
        if (p.value === 0){
          return 0;
        }
        return 0.0001;
    })
    .r(d3.scaleLinear().domain([0, 100]))
    .colors(["orange"])
    .title(function(p) {
        return p.key;
    })
    .renderLabel(false)
    .renderTitle(false);

  data.forEach(function(d) {
    wagonwheelChart.point(d.wagonwheelid, d.wagonwheelCoordinates.x, d.wagonwheelCoordinates.y);
  });


  // innings donut chart
  inningsChart.width(250)
    .height(150)
    .radius(70)
    .dimension(inningsDimension)
    .innerRadius(30)
    .title(function(d){return d.value;})
    .group(inningsGroup);

    // dot balls chart
    dotBallsChart.width(250)
      .height(150)
      .radius(70)
      .dimension(dotsDimension)
      .innerRadius(30)
      .label(function(d){
        if(d.key === 0){
          return "Dot Balls";
        }
        else{
          return "Scoring Balls";
        }
      })
      .group(dotsGroup);

    // batsmen row chart
    runsCountChart.width(250)
      .height(150)
      .dimension(runsDimension)
      .group(runsCountGroup)
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)
      .brushOn(false)
      .elasticX(true)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .yAxis()
      .ticks(6)
      .tickFormat(function(d) {
        return d % 1 ? null : d;
      });

  speedCountChart
    .width(250)
    .height(150)
    .dimension(speedDimension)
    .group(speedValueGroup)
    .x(d3.scaleLinear().domain([60, speedExtent+5]))
    .elasticX(true)
    .elasticY(true)
    .renderHorizontalGridLines(true)
    .yAxis()
    .ticks(4)
    .tickFormat(function(d) {
      return d % 1 ? null : d;
    });

    speedCountChart.xAxis().ticks(4);

  // stacked over chart
  stackedOverChart
      .width(1000)
      .height(200)
      .controlsUseVisibility(true)
      .x(d3.scaleLinear().domain(overExtent))
      .brushOn(false)
      .clipPadding(10)
      .dimension(overInningDimension)
      .group(stackedGroup, "1", sel_stack('1'))
      .label(function(d){

        var wicketCount = wicketDimensionGroup.all().filter(function(item) {
          return item.key == +d.data.key;
        })[0].value;

        if (wicketCount === 0){
          return "";
        }
        else{
            return wicketCount;
        }

      })
      .renderLabel(true)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .yAxis()
      .ticks(8)
      .tickFormat(function(d) {
        return d % 1 ? null : d;
      });


  for(var i = 2; i < inningsCount + 1; i++){
      stackedOverChart.stack(stackedGroup, ''+i, sel_stack(i));
  }

  stackedOverChart.on('pretransition', function(chart) {
      chart.selectAll('rect.bar')
          .classed('stack-deselected', function(d) {
              var key = multikey(d.x, d.layer);
              return chart.filter() && chart.filters().indexOf(key)===-1;
          })
          .on('click', function(d) {
              chart.filter(multikey(d.x, d.layer));
              dc.redrawAll();
          });
  });

  // batsmen row chart
  batsmenChart.width(400)
    .height(600)
    .dimension(batsmenDimension)
    .group(batsmenGroup)
    //.colors(d3.scaleOrdinal(batsmen_colours))
    .label(function (d){

      var balls = batsmenBallsGroup.all().filter(function(item) {
        return item.key === d.key;
      })[0].value;

       if (balls === 0){
         return d.key;
       }
       else{
         return d.key + " " + d.value + "(" + balls + ")";
       }
    })
    .title(function(d){return d.value;})
    .elasticX(true)
    .xAxis()
    .ticks(4)
    .tickFormat(function(d) {
      return d % 1 ? null : d;
    });

  // hand pie chart
  handChart.width(250)
    .height(150)
    .radius(70)
    .dimension(handDimension)
    .title(function(d){return d.value;})
    .group(handGroup)
    .colors(d3.scaleOrdinal().range(hand_colours));


  // bowling type pie chart
  bowlingTypeChart.width(250)
    .height(150)
    .radius(70)
    .dimension(bowlingTypeDimension)
    .title(function(d){return d.value;})
    .group(bowlingTypeGroup)
    .colors(d3.scaleOrdinal().range(d3.schemeSet2));

  // bowling from pie chart
  bowlingFromChart.width(250)
    .height(150)
    .radius(70)
    .dimension(bowlingFromDimension)
    .title(function(d){return d.value;})
    .group(bowlingFromGroup)
    .colors(d3.scaleOrdinal().range(bowling_from_colours));


  // bowlers row chart
  bowlersChart.width(400)
    .height(600)
    .dimension(bowlersDimension)
    .group(bowlersGroup)
    //.colors(d3.scaleOrdinal(bowler_colours))
    .label(function(d){
        var wickets = bowlerWicketsGroup.all().filter(function(item) {
          return item.key === d.key;
        })[0].value;

        var runs = bowlerRunsGroup.all().filter(function(item) {
          return item.key === d.key;
        })[0].value;

        var balls = bowlersGroup.all().filter(function(item) {
          return item.key === d.key;
        })[0].value;

        var dots = bowlerDotsGroup.all().filter(function(item) {
          return item.key === d.key;
        })[0].value;

        if (balls !== 0){
          var economy = (Math.round((runs/balls) * 100)/100);

          return d.key + " [" + balls + "-" + dots + "-" + runs + "-" + wickets + "] ("+ economy + ")";
        }
        else{
          return d.key;
        }
      })
    .title(function(d){return d.value;})
    .elasticX(true)
    .xAxis()
    .ticks(4)
    .tickFormat(function(d) {
      return d % 1 ? null : d;
    });


  // runs bar chart
  runsChart.width(1000)
    .height(200)
    .dimension(inningBallDimension)
    .group(positiveRuns)
    .transitionDuration(500)
    .centerBar(true)
    .gap(5)
    .x(d3.scaleLinear().domain(periodExtent))
    .colors(d3.scaleOrdinal().range(["#3993c8", "#f34b50", "#36b74e", "#ff9439"]))
    .colorAccessor(function(d) {
      var keyString = (d.key).toString();
      var innings = parseInt(keyString.split(".")[1]);
      return innings - 1;
    })
    .elasticY(true)
    .yAxis()
    .ticks(5)
    .tickFormat(function(d) {
      return d % 1 ? null : d-1;
    });

    speedChart
      .width(1000)
      .height(200)
      .chart(function(c) { return dc.lineChart(c).curve(d3.curveLinear); })
      .dimension(outlierBallDimension)
      .group(positveSpeedGroup)
      .seriesAccessor(function(d) {
        [inning, over, ball] = (d.key.toString().split("."));
        return inning;
      })
      .keyAccessor(function(d) {
        [inning, over, ball] = (d.key.toString().split("."));
        var over_ball = parseFloat(over + "." + ball);
        return +over_ball;
      })
      .valueAccessor(function(d) {
        return +d.value;
      })
      .brushOn(true)
      .elasticX(true)
      .elasticY(true)
      .x(d3.scaleLinear().domain([periodExtent[0], periodExtent[1] + 1]))
      .y(d3.scaleLinear().domain([60, speedExtent+5]))
      .xAxis()
      .ticks(6);

    bowlingDetailChart.width(300)
      .height(300)
      .dimension(bowlingDetailDimension)
      .group(bowlingDetailGroup)
      //.colors(d3.scale.category20b())
      .label(function (d){
         return d.key;
      })
      .title(function(d){return d.value;})
      .elasticX(true)
      .xAxis()
      .ticks(4)
      .tickFormat(function(d) {
        return d % 1 ? null : d;
      });

    footChart.width(300)
      .height(250)
      .dimension(footDimension)
      .group(footDimensionGroup)
      //.colors(d3.scaleOrdinal(d3.schemeCategory20))
      .label(function (d){
         return d.key;
      })
      .title(function(d){return d.value;})
      .elasticX(true)
      .xAxis()
      .ticks(4)
      .tickFormat(function(d) {
        return d % 1 ? null : d;
      });

  connectionChart.width(300)
    .height(600)
    .dimension(connectionDimension)
    .group(nonEmptyConnection)
    //.colors(d3.scaleOrdinal().range(randomColorMap))
    .label(function (d){
       return d.key;
    })
    .title(function(d){return d.value;})
    .elasticX(true)
    .xAxis()
    .ticks(4)
    .tickFormat(function(d) {
      return d % 1 ? null : d;
    });

  shotsChart.width(300)
    .height(600)
    .dimension(shotsDimension)
    .group(shotsGroup)
    //.colors(d3.scaleOrdinal().range(rainbow))
    .label(function (d){
       return d.key;
    })
    .title(function(d){return d.value;})
    .elasticX(true)
    .xAxis()
    .ticks(4)
    .tickFormat(function(d) {
      return d % 1 ? null : d;
    });

  fielderPositionChart.width(300)
    .height(600)
    .dimension(fielderPositionDimension)
    .group(fielderPositionGroup)
    //.colors(d3.scaleOrdinal().range(rainbow))
    .label(function (d){
       return d.key;
    })
    .title(function(d){return d.value;})
    .elasticX(true)
    .xAxis()
    .ticks(4)
    .tickFormat(function(d) {
      return d % 1 ? null : d;
    });

  fielderChart.width(300)
    .height(600)
    .dimension(fielderDimension)
    .group(fielderGroup)
    //.colors(d3.scaleOrdinal().range(rainbow))
    .label(function (d){
       return d.key;
    })
    .title(function(d){return d.value;})
    .elasticX(true)
    .xAxis()
    .ticks(4)
    .tickFormat(function(d) {
      return d % 1 ? null : d;
    });

    // Table of earthquake data
    commentTable
      .width(960)
      .height(800)
      .dimension(timeDimension)
      .group(function(d) {return ""})
      .size(Infinity)
      .columns([
        function(d) { return d.inning_over_ball; },
        function(d) { return d.BATSMAN; },
        function(d) { return d.shot_type_name},
        function(d) { return d.BOWLER; },
        function(d) { return d.period_text; },
        function(d) { return d.team_runs; },
        function(d) { return d.commentary_text; },
      ])
      .sortBy(function(d){
        return d.rowindex;
      });

      // the moment you know the number has changed, remove everything currently present
      // this current scheme will work  on the assumption that
      // data-count will change first and then the rest of the charts will make changes

      $('.dc-data-count').on('DOMSubtreeModified', function(d){
        var count = document.getElementsByClassName('filter-count')[0].innerHTML;
        count = parseInt(count.replace(/,/g, ''));

        // whatever happens remove the current trajectories
        removeScreenTrajectories();

        if(!isNaN(count)){
          // Agenda: get all filtered records, sort them and select the bottom 60
          var balls = timeDimension.bottom(Infinity);

          balls.sort(function(x, y) {
              [inning_x, over_x, ball_x] = (x.inning_over_ball).split('.').map(Number);
              [inning_y, over_y, ball_y] = (y.inning_over_ball).split('.').map(Number);

              if (inning_x < inning_y) {
                  return -1;
              } else if (inning_x > inning_y) {
                  return 1;
              } else {
                  if (over_x < over_y) {
                      return -1;
                  } else if (over_x > over_y) {
                      return 1;
                  } else {
                      if (ball_x < ball_y) {
                          return -1;
                      } else if (ball_x > ball_y) {
                          return 1;
                      } else {
                          return 0;
                      }
                  }
              }
          });

          // save for export later
          global_balls = balls;

          balls = balls.slice(-60);

          var encoded_trajectories = balls.map(value => ({"ENCODED_TRAJECTORY": value.ENCODED_TRAJECTORY, "inning_over_ball": value.inning_over_ball}));
          addScreenTrajectories(encoded_trajectories);
        }
        else{
          console.log("changed but with no effect");
        }

      });

  // Render the Charts
  dc.renderAll();

});
