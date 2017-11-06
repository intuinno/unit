'use strict';

/**
 * @ngdoc function
 * @name unitApp.controller:LiveCtrl
 * @description
 * # LiveCtrl
 * Controller of the unitApp
 */
angular.module('unitApp')
  .controller('LiveCtrl', function(unit) {
    //editor

    var UnitChart = unit.UnitChart;
    
    d3.json('./data/squarified.json',function(error, data) {
      UnitChart('editorchart', data);
    })

    var container = document.getElementById('jsoneditor');
    var options = {};
    var editor = new JSONEditor(container, options);

    d3.json('./data/squarified.json', function(error, json) {
      editor.set(json);
    });

    var button = d3.select('#updatebutton');

    button.on('click', function() {
      var json = editor.get();
      console.log(json);
      d3.select('#editorchart').select('svg').remove();
      UnitChart('editorchart', json);
    });

  });
