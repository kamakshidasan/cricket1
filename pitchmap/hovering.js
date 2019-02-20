var printDetails = [
    {
        'var': 'key',
        'print': 'key'
    },
    {
        'var': 'comment',
        'print': 'comment'
    }
];

function updateDetails(ball) {
    tooltip.selectAll("div").remove();
    tooltip.selectAll("div").data(printDetails).enter()
        .append("div")
        .append('span')
        .text(function(d) {
            return d.print + ": ";
        })
        .attr("class", "boldDetail")
        .insert('span')
        .text(function(d) {
            return ball[d.var];
        })
        .attr("class", "normalDetail");
}

var ballCharts = [pitchmapChart, wagonwheelChart, rightBeehiveChart, leftBeehiveChart];

ballCharts.forEach(function(ballChart) {
  ballChart.on('pretransition.add-tip', function(chart) {
    chart.selectAll('circle.bubble')
      .on('mouseover.comment', function(d) {
          tooltip
              .style("left", (d3.event.pageX + 55) + "px")
              .style("top", (d3.event.pageY - 55) + "px")
              .transition().duration(300)
              .style("opacity", 1)
              .style("display", "block");


          var is_beehive = splitkey(d.key);
          console.log(is_beehive);

          var identifier = d.key.split("id")[1];
          updateDetails({"key": identifier, "comment": comment_dictionary[identifier]});

          // get all the other nodes with the same class
          var className = d.key.split(".").join("");
          var classNodes = document.getElementsByClassName(className);

          for (var i = 0; i < classNodes.length; i++) {
            classNodes[i].children[0].style = "fill-opacity: 1; fill: hotpink";
          }

          var trajectoryNode = document.getElementById("materialtrajectory"+identifier);

          if(trajectoryNode !== null){
              trajectoryNode.diffuseColor = "hotpink";
          }
          else{
            console.log("trajectory not found")
          }

      })
      .on('mouseout.comment', function(d) {
          tooltip.transition().duration(700).style("opacity", 0);

          // remove the style from the other guys
          var className = d.key.split(".").join("");
          var classNodes = document.getElementsByClassName(className);

          for (var i = 0; i < classNodes.length; i++) {
            classNodes[i].children[0].removeAttribute("style");
          }

          var identifier = d.key.split("id")[1];
          var trajectoryNode = document.getElementById("materialtrajectory"+identifier);
          if(trajectoryNode !== null){
              trajectoryNode.diffuseColor = "#00FFFF";
          }

      });
    });

});
