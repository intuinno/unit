/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	import {
	  UnitChart
	} from "./unit_chart";

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


/***/ }
/******/ ]);