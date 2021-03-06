'use strict';

/**
 * @ngdoc function
 * @name unitApp.controller:EnumCtrl
 * @description
 * # EnumCtrl
 * Controller of the unitApp
 */
angular.module('unitApp')
  .controller('EnumCtrl', function(unit) {
    //Enumeration
    d3.csv('./data/titanic3.csv', function(error, data) {

      var keys = Object.keys(data[0]);

      d3.select("#control_enumeration").selectAll("input")
        .data(keys)
        .enter()
        .append('label')
        .attr('for', function(d, i) {
          return 'a' + i;
        })
        .text(function(d) {
          return d;
        })
        .append('input')
        .property("checked", function(d, i) {
          return false;
        })
        .attr("type", "checkbox")
        .attr("id", function(d, i) {
          return 'a' + i;
        });

    });

    var update_enumeration_button = d3.select('#updatebutton_enumeration');

    update_enumeration_button.on('click', function() {
      var inputs = d3.select('#control_enumeration').selectAll("input");
      console.log(inputs);
      var selectedInputs = [];
      inputs.each(function(d, i) {
        if (d3.select(this).property("checked")) {
          selectedInputs.push(d);
        }
      });
      var numLayer = d3.select("#nLayer").property("value");
      numLayer = +numLayer;
      console.log(selectedInputs);
      enumerate(selectedInputs, numLayer, 'unit_enumerate');
    });

    var UnitChart = unit.UnitChart;

    var enumerate = function(selectedInputs, numLayer, divId) {

      d3.json('./data/enumerate.json', function(error, data) {
        var base = data;
        var flattenLayers, markPolicies;
        var specs = []
        switch (numLayer) {
          case 1:
            flattenLayers = getFlattenLayers(selectedInputs);
            markPolicies = getMarkPolicies(selectedInputs);
            specs = enumeratePolicyForSingleLayer(flattenLayers, markPolicies);
            break;

          case 2:
            var firstLayers = getFirstLayers(selectedInputs);
            flattenLayers = getFlattenLayers(selectedInputs);
            markPolicies = getMarkPolicies(selectedInputs);
            specs = enumeratePolicyForDoubleLayers(firstLayers, flattenLayers, markPolicies);
            break;

          default:
            var firstLayers = getFirstLayers(selectedInputs);
            var middleLayers = getMiddleLayers(selectedInputs, numLayer);
            flattenLayers = getFlattenLayers(selectedInputs);
            markPolicies = getMarkPolicies(selectedInputs);
            specs = enumeratePolicyForGeneralLayers(firstLayers,middleLayers, flattenLayers, markPolicies);

        }
        console.log("Number of Enumerations:", specs.length);


        d3.select('#num_enumeration').text(specs.length);

        if (!d3.select('#enumerate_draw').property("checked")) {
          drawSpecs(specs, divId);

        }

      });

    };


    function enumeratePolicyForDoubleLayers(firstLayers, flattenLayers, markPolicies) {
      var specs = [];
      firstLayers.forEach(function(aFirstLayer) {
        flattenLayers.forEach(function(aFlattenLayer) {
          markPolicies.forEach(function(aMarkPolicy) {
            var newFirstLayer = JSON.parse(JSON.stringify(aFirstLayer));
            var newFlattenLayer = JSON.parse(JSON.stringify(aFlattenLayer));
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
            aSpec.layouts = [newFirstLayer, newFlattenLayer];
            aSpec.mark = aMarkPolicy;
            specs.push(aSpec);
          });
        });
      });

      return specs;
    }

    function enumeratePolicyForGeneralLayers(firstLayers, middleLayers, flattenLayers, markPolicies, numLayer) {
      var specs = [];
      firstLayers.forEach(function(aFirstLayer) {
        middleLayers.forEach(function(aMiddleLayer) {
          flattenLayers.forEach(function(aFlattenLayer) {
            markPolicies.forEach(function(aMarkPolicy) {
              var newFirstLayer = JSON.parse(JSON.stringify(aFirstLayer));
              var newFlattenLayer = JSON.parse(JSON.stringify(aFlattenLayer));
              var newMiddleLayer = JSON.parse(JSON.stringify(aMiddleLayer));
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
              aSpec.layouts = [newFirstLayer];
              aSpec.layouts = aSpec.layouts.concat( newMiddleLayer);
              aSpec.layouts = aSpec.layouts.push( newMiddleLayer);

              aSpec.mark = aMarkPolicy;
              specs.push(aSpec);
            });
          });
        });
      });

      return specs;
    }

    function enumeratePolicyForSingleLayer(flattenLayers, markPolicies) {
      var specs = []
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
      return specs;

    }



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
      var enum_direction = ['LRTB'];
      var enum_align = ['LB'];
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

    function getFirstLayers(selectedInputs) {

      var enum_aspect_ratio = ['fillX', 'fillY', 'maxfill', 'square', 'parent'];
      var enum_groupby_key = selectedInputs;
      var enum_groupby_isShared = [true]
      var enum_size_type = [{
        'type': 'uniform'
      }, {
        'type': 'count'
      }];

      enum_size_type = enum_size_type.concat(selectedInputs.map(function(d) {
        return {
          'type': 'sum',
          'key': d
        };
      }));

      var enum_size_sum_key = selectedInputs;
      var enum_size_isShared = [true];
      var enum_direction = ['LRTB'];
      var enum_align = ['LB'];
      var enum_sort_key = selectedInputs;

      var layers = [];

      enum_aspect_ratio.forEach(function(a_aspect_ratio, i) {
        enum_size_type.forEach(function(a_size_type) {
          enum_size_isShared.forEach(function(a_size_isShared) {
            enum_direction.forEach(function(a_direction) {
              enum_align.forEach(function(a_align) {
                enum_sort_key.forEach(function(a_sort_key) {
                  enum_groupby_key.forEach(function(a_groupby_key) {
                    enum_groupby_isShared.forEach(function(a_groupby_isShared) {
                      var aLayer = {
                        "name": "firstlayer",
                        "type": "gridxy",
                        "subgroup": {
                          "type": "groupby",
                          "key": a_groupby_key,
                          "isShared": a_groupby_isShared
                        },
                        "aspect_ratio": a_aspect_ratio,
                        "size": {
                          "type": a_size_type.type,
                          "isShared": a_size_isShared,
                          "key": (a_size_type.type === 'sum') ? a_size_type.key : ''
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
        });
      });

      return layers;
    }

    function getMiddleLayers(selectedInputs, numLayer) {

      var enum_aspect_ratio = ['fillX', 'fillY', 'maxfill', 'square', 'parent'];
      var enum_groupby_key = [{
        'type': 'passthrough'
      }];

      enum_groupby_key = enum_groupby_key.concat(selectedInputs.map(function(d) {
        return {
          'type': 'groupby',
          'key': d
        }
      }));

      selectedInputs;
      var enum_groupby_isShared = [true]
      var enum_size_type = [{
        'type': 'uniform'
      }, {
        'type': 'count'
      }];

      enum_size_type = enum_size_type.concat(selectedInputs.map(function(d) {
        return {
          'type': 'sum',
          'key': d
        };
      }));

      var enum_size_sum_key = selectedInputs;
      var enum_size_isShared = [true];
      var enum_direction = ['LRTB'];
      var enum_align = ['LB'];
      var enum_sort_key = selectedInputs;

      var layers = [];

      enum_aspect_ratio.forEach(function(a_aspect_ratio, i) {
        enum_size_type.forEach(function(a_size_type) {
          enum_size_isShared.forEach(function(a_size_isShared) {
            enum_direction.forEach(function(a_direction) {
              enum_align.forEach(function(a_align) {
                enum_sort_key.forEach(function(a_sort_key) {
                  enum_groupby_key.forEach(function(a_groupby_key) {
                    enum_groupby_isShared.forEach(function(a_groupby_isShared) {
                      var aLayer = {
                        "name": "firstlayer",
                        "type": "gridxy",
                        "subgroup": {
                          "type": a_groupby_key.type,
                          "key": (a_groupby_key.type === 'groupby') ? a_groupby_key.key : '',
                          "isShared": a_groupby_isShared
                        },
                        "aspect_ratio": a_aspect_ratio,
                        "size": {
                          "type": a_size_type.type,
                          "isShared": a_size_isShared,
                          "key": (a_size_type.type === 'sum') ? a_size_type.key : ''
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
        });
      });

      layers = getCombi(layers, numLayer -2);
      return layers;
    }

    function getCombi(layers, depth) {

      if (depth == 1){
        return layers;
      } else {
        var newLayers = getCombi(layers, depth-1);
        var resultLayers = []

        layers.forEach(function(aLayer) {
          newLayers.forEach(function(aNewLayer) {
            aCopyLayer = JSON.parse(JSON.stringify(aLayer));
            var newArr = [aCopyLayer];
            aNewCopyLayer = JSON.parse(JSON.stringify(aNewLayer));
            newArr = newArr.concat(aNewCopyLayer);

            resultLayers.push(newArr);
          });
        });

        return resultLayers;
      }
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
      var enum_color_isShared = [true];
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

  });
