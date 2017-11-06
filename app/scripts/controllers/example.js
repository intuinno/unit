'use strict';

/**
 * @ngdoc function
 * @name unitApp.controller:ExampleCtrl
 * @description
 * # ExampleCtrl
 * Controller of the unitApp
 */
angular.module('unitApp')
  .controller('ExampleCtrl', ['unit', function (unit) {

    var UnitChart = unit.UnitChart;

    //Unit Column Chart
    d3.json('./data/unit_column_chart_shared.json', function(error,data){
      UnitChart('unit_column_chart_shared', data);
    });
    d3.json('./data/unit_column_chart.json', function(error,data){
      UnitChart('unit_column_chart', data);
    });
    d3.json('./data/unit_column_chart_shared_mark.json', function(error,data){
      UnitChart('unit_column_chart_shared_mark', data);
    });
    d3.json('./data/horizontal_unit_column.json', function(error,data){
      UnitChart('horizontal_unit_column', data);
    });


    //Hierarchy
    d3.json('./data/titanic_spec_packxy_hierarchy.json', function(error,data){
      UnitChart('packxy_hierarchy', data);
    });
    d3.json('./data/titanic_spec_packxy_isolated.json', function(error,data){
      UnitChart('packxy_isolated', data);
    });
    d3.json('./data/titanic_spec4.json', function(error,data){
      UnitChart('packxy2', data);
    });
    d3.json('./data/titanic_spec_packxy_mixed.json', function(error,data){
      UnitChart('packxy_mixed', data);
    });

    //Aspect ratio
    d3.json('./data/square_aspect.json', function(error,data){
      UnitChart('square_aspect', data);
    });
    d3.json('./data/maxfill_aspect.json', function(error,data){
      UnitChart('maxfill_aspect', data);
    });
    d3.json('./data/unit_small_multiple.json', function(error,data){
      UnitChart('unit_small_multiple', data);
    });

    //size
    d3.json('./data/size_uniform_notShared.json', function(error,data){
      UnitChart('size_uniform_notshared', data);
    });
    d3.json('./data/size_sum_notShared.json', function(error,data){
      UnitChart('size_sum_notshared', data);
    });
    d3.json('./data/size_uniform_shared.json', function(error,data){
      UnitChart('size_uniform_shared', data);
    });
    d3.json('./data/size_sum_shared.json', function(error,data){
      UnitChart('size_sum_shared', data);
    });

    //violin
    d3.json('./data/violin.json', function(error,data){
      UnitChart('violin', data);
    });
    
    //Squarified
    d3.json('./data/squarified.json', function(error,data){
      UnitChart('squarified', data);
    });

    //Fluctuation 
    d3.json('./data/fluctuation.json', function(error,data){
      UnitChart('fluctuation', data);
    });
    
    //Mosaic
    d3.json('./data/mosaic.json', function(error,data){
      UnitChart('mosaic', data);
    });


  }]);
