var UnitChart = require('./unit_chart').UnitChart;

d3.json('/data/editor.json', function(error,data){
  UnitChart('editorchart', data);
});

d3.json('/data/titanic_spec_packxy_hierarchy.json', function(error,data){
  UnitChart('packxy_hierarchy', data);
});

d3.json('/data/titanic_spec_packxy_isolated.json', function(error,data){
  UnitChart('packxy_isolated', data);
});

d3.json('/data/titanic_spec4.json', function(error,data){
  UnitChart('packxy2', data);
});

d3.json('/data/titanic_spec3.json', function(error,data){
  UnitChart('packxy', data);
});

d3.json('/data/titanic_spec2.json', function(error,data){
  UnitChart('titanic2', data);
});

d3.json('/data/titanic_spec1.json', function(error,data){
  UnitChart('titanic1', data);
});

var container = document.getElementById("jsoneditor");
var options = {};
var editor = new JSONEditor(container, options);

d3.json("/data/titanic_spec_packxy_hierarchy.json", function(error, json) {
  editor.set(json);
});

var button = d3.select('#updatebutton');

button.on('click', function() {
  var json = editor.get();
  console.log(json);
  d3.select('#editorchart').select('svg').remove();
  UnitChart('editorchart', json);

});
