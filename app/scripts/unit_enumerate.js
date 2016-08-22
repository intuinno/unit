var UnitChart = require('./unit_chart').UnitChart;

exports.enumerate = function(selectedInputs, numLayer, divId) {

  d3.json('./data/enumerate.json', function(error, data) {
    var base = data;
    var flattenLayers, markPolicies;
    var specs = []
    switch (numLayer) {
      case 1:
        flattenLayers = getFlattenLayers(selectedInputs);
        markPolicies = getMarkPolicies(selectedInputs);

        flattenLayers.forEach(function(aFlattenLayer) {
          markPolicies.forEach(function(aMarkPolicy) {
            var aSpec = {
              "title": "Titanic",
              "data": "data/titanic3.csv",
              "width": 1000,
              "height": 320,
              "padding": {
                "top": 5,
                "left": 5,
                "bottom": 5,
                "right": 5
              },
              "layouts": []
            };
            aSpec.layouts.push(aFlattenLayer);
            aSpec.mark = aMarkPolicy;
            specs.push(aSpec);
          });
        });
        console.log(specs);
        drawSpecs(specs, divId);
        break;
    }

  });

};

function drawSpecs(specs, divId) {
  d3.select("#" + divId).selectAll("div")
    .data(specs)
    .enter()
    .append("div")
    .attr("id", function(d, i) {
      return "enum" + i;
    });

  specs.forEach(function(spec, i) {
    UnitChart('enum' + i, spec);
  })
}

function getFlattenLayers(selectedInputs) {

  var enum_aspect_ratio = ['fillX', 'fillY', 'maxfill', 'square', 'parent'];
  var enum_size_type = ['uniform'];
  var enum_size_isShared = [true, false];
  var enum_direction = ['LRTB', 'TBLR'];
  var enum_align = ['LB', 'CM'];
  var enum_sort_key = selectedInputs;

  var layers = [];

  enum_aspect_ratio.forEach(function(a_aspect_ratio) {
    enum_size_type.forEach(function(a_size_type) {
      enum_size_isShared.forEach(function(a_size_isShared) {
        enum_direction.forEach(function(a_direction) {
          enum_align.forEach(function(a_align) {
            enum_sort_key.forEach(function(a_sort_key) {
              var aLayer = {
                "name": "flattenLayer",
                "type": "gridxy",
                "subgroup": {
                  "type": "flatten"
                },
                "aspect_ratio": a_aspect_ratio,
                "size": {
                  "type": a_size_type,
                  "isShared": a_size_isShared
                },
                "direction": a_direction,
                "align": a_align,
                "margin": {
                  "top": 0,
                  "left": 0,
                  "bottom": 0,
                  "right": 0
                },
                "padding": {
                  "top": 0,
                  "left": 0,
                  "bottom": 0,
                  "right": 0
                },
                "box": {
                  "fill": "yellow",
                  "stroke": "red",
                  "stroke-width": 0,
                  "opacity": 0.1
                },
                "sort": {
                  "type": isCategorical(a_sort_key) ? "categorical" : "numerical",
                  "key": a_sort_key
                }
              };

              layers.push(aLayer);

            });
          });
        });
      });
    });
  });

  return layers;
}

function isCategorical(key) {

  var numericalVariables = ['age', 'fare'];

  if (numericalVariables.indexOf(key) == -1) {
    return true;
  } else {
    return false;
  }
}

function getMarkPolicies(keys) {
  var enum_color_key = keys;
  var enum_size_isShared = [true, false];
  var enum_color_isShared = [true, false];
  var enum_shape = ['circle', 'rect'];
  var marks = [];

  enum_color_key.forEach(function(a_color_key) {
    enum_size_isShared.forEach(function(a_size_isShared) {
      enum_color_isShared.forEach(function(a_color_isShared) {
        enum_shape.forEach(function(a_shape) {
          var aMark = {
            "shape": a_shape,
            "color": {
              "key": a_color_key,
              "type": (isCategorical(a_color_key)) ? "categorical" : "numerical",
              "isShared": a_color_isShared
            },
            "size": {
              "type": "max",
              "isShared": a_size_isShared
            },
            "isColorScaleShared": true
          };
          marks.push(aMark);
        });
      });
    });
  });

  return marks;
}
