function multikey(x,y) {
    return x + 'x' + y;
}

function splitkey(k) {
    return k.split('x');
}

function stack_second(group) {
    return {
        all: function() {
            var all = group.all(),
                m = {};
            // build matrix from multikey/value pairs
            all.forEach(function(kv) {
                var ks = splitkey(kv.key);
                m[ks[0]] = m[ks[0]] || {};
                m[ks[0]][ks[1]] = kv.value;
            });
            // then produce multivalue key/value pairs
            return Object.keys(m).map(function(k) {
                //console.log({key: k, value: m[k]});
                return {key: k, value: m[k]};
            });
        }
    };
}

function sel_stack(i) {
    return function(d) {
        return d.value[i];
    };
}

function remove_key(source_group, key_value) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.key !== key_value;
            });
        }
    };
  }

  function remove_null_speed(source_group, count_group, key_value) {
      return {
          all:function () {
              var answer = source_group.all().filter(function(d) {
                  return d.value > key_value;
              });

              var m = {};
              var ball_identifiers = {};

              var counter = count_group.all();
              counter.forEach(function(kv) {
                var ks = splitkey(kv.key);
                m[ks[0]] = m[ks[0]] || {};
                m[ks[0]][ks[1]] = kv.value;

                //console.log(kv.key + " " + kv.value + " " + ks[0] + " " + ks[1]);
              });

              answer.forEach(function(kv) {
                  var inning_over_ball = kv.key;
                  [inning, over, ball] = inning_over_ball.split(".");

                  // plus one for equal spacing
                  var normalized_ball = (Math.round((ball/(m[over][inning]+1))*100) / 100);
                  var ball_over = parseFloat(over) + normalized_ball;
                  var normalized_inning_over_ball = inning + "." + ball_over;

                  ball_identifiers[normalized_inning_over_ball] = kv.value;
              });

              return Object.keys(ball_identifiers).map(function(k) {
                  //console.log({key: k, value: m[k]});
                  return {key: k, value: ball_identifiers[k]};
              });
          }
      };
    }

  function make_positive_runs(group, counter) {
      return {
          all: function() {
              var all = group.all(),
                  countall = counter.all(),
                  m = {},
                  n = {};

              // build matrix from multikey/value pairs
              all.forEach(function(kv) {
                  m[kv.key] = kv.value;
              });

              countall.forEach(function(kv) {
                  n[kv.key] = kv.value;
              });

              // then produce multivalue key/value pairs
              return Object.keys(m).map(function(k) {
                  if(n[k] > 0){
                    m[k] += 1;
                  }
                  //console.log({key: k, value: m[k]});
                  return {key: k, value: m[k]};
              });
          }
      };
  }

function remove_empty_connection(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.key !== "None";
            });
        }
    };
  }

function show_trajectories(input){
  console.log(input);
  console.log("adhitya");
}

var four_colours = ["#3993c8", "#f34b50", "#36b74e", "#ff9439"];

var batsmen_colours =
["#c94eb1",
"#5db645",
"#9d5ccf",
"#b3b736",
"#656dc9",
"#de852d",
"#5f97d1",
"#da4938",
"#3fbfbc",
"#d94279",
"#57bd84",
"#974c7f",
"#98b163",
"#d28dca",
"#51732c",
"#bb5863",
"#358054",
"#ae4e2a",
"#777f29",
"#e68e75",
"#d1a44f",
"#956c31"];

var bowler_colours =
["#db7cff",
"#47f144",
"#530049",
"#c0ff17",
"#0050a2",
"#ffd64d",
"#6c9fff",
"#00a721",
"#ffafe1",
"#01d693",
"#840018",
"#51ffbc",
"#ff8e9c",
"#bfff84",
"#0084c4",
"#a08d00",
"#57f6ff",
"#ff9b56",
"#00516a",
"#00803c",
"#dde2ff",
"#3f2d00"]

hand_colours = ["#ebc544", "#864ba8"];
bowling_from_colours = ["#3e91a6", "#fd9cb7"];
