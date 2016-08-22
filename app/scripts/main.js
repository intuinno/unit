var UnitChart = require('./unit_chart').UnitChart;
var enumerate = require('./unit_enumerate').enumerate;

editor
d3.json('./data/editor.json', function(error,data){
  UnitChart('editorchart', data);
});

//
//Unit Column Chart
d3.json('./data/unit_column_chart_shared.json', function(error,data){
  UnitChart('unit_column_chart_shared', data);
});
// d3.json('./data/unit_column_chart.json', function(error,data){
//   UnitChart('unit_column_chart', data);
// });
// d3.json('./data/unit_column_chart_shared_mark.json', function(error,data){
//   UnitChart('unit_column_chart_shared_mark', data);
// });
// d3.json('./data/horizontal_unit_column.json', function(error,data){
//   UnitChart('horizontal_unit_column', data);
// });
//
//
// //Hierarchy
// d3.json('./data/titanic_spec_packxy_hierarchy.json', function(error,data){
//   UnitChart('packxy_hierarchy', data);
// });
// d3.json('./data/titanic_spec_packxy_isolated.json', function(error,data){
//   UnitChart('packxy_isolated', data);
// });
// d3.json('./data/titanic_spec4.json', function(error,data){
//   UnitChart('packxy2', data);
// });
// d3.json('./data/titanic_spec_packxy_mixed.json', function(error,data){
//   UnitChart('packxy_mixed', data);
// });
//
// //Aspect ratio
// d3.json('./data/square_aspect.json', function(error,data){
//   UnitChart('square_aspect', data);
// });
// d3.json('./data/maxfill_aspect.json', function(error,data){
//   UnitChart('maxfill_aspect', data);
// });
// d3.json('./data/unit_small_multiple.json', function(error,data){
//   UnitChart('unit_small_multiple', data);
// });
//
// //size
// d3.json('./data/size_uniform_notShared.json', function(error,data){
//   UnitChart('size_uniform_notshared', data);
// });
// d3.json('./data/size_sum_notShared.json', function(error,data){
//   UnitChart('size_sum_notshared', data);
// });
// d3.json('./data/size_uniform_shared.json', function(error,data){
//   UnitChart('size_uniform_shared', data);
// });
// d3.json('./data/size_sum_shared.json', function(error,data){
//   UnitChart('size_sum_shared', data);
// });
//
// //violin
// d3.json('./data/violin.json', function(error,data){
//   UnitChart('violin', data);
// });
//
// //Mosaic
// d3.json('./data/mosaic.json', function(error,data){
//   UnitChart('mosaic', data);
// });

var container = document.getElementById('jsoneditor');
var options = {};
var editor = new JSONEditor(container, options);

d3.json('./data/editor.json', function(error, json) {
  editor.set(json);
});

var button = d3.select('#updatebutton');

button.on('click', function() {
  var json = editor.get();
  console.log(json);
  d3.select('#editorchart').select('svg').remove();
  UnitChart('editorchart', json);
});

//Enumeration
d3.csv('./data/titanic3.csv', function(error, data) {

  var keys = Object.keys(data[0]);

  d3.select("#control_enumeration").selectAll("input")
    .data(keys)
    .enter()
    .append('label')
      .attr('for', function(d,i){return 'a'+i;})
      .text(function(d) {return d;})
    .append('input')
      .property("checked", function(d,i) {
        return false;
      })
      .attr("type", "checkbox")
      .attr("id", function(d, i) {return 'a'+i;});

});

var update_enumeration_button = d3.select('#updatebutton_enumeration');

update_enumeration_button.on('click', function() {
  var inputs = d3.select('#control_enumeration').selectAll("input");
  console.log(inputs);
  var selectedInputs = [];
  inputs.each(function(d,i) {
    if (d3.select(this).property("checked")) {
      selectedInputs.push(d);
    }
  });
  var numLayer = d3.select("#nLayer").property("value");
  numLayer = +numLayer;
  console.log(selectedInputs);
  enumerate(selectedInputs, numLayer,'unit_enumerate');
});
