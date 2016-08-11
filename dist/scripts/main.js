!function t(n,e,i){function a(o,c){if(!e[o]){if(!n[o]){var s="function"==typeof require&&require;if(!c&&s)return s(o,!0);if(r)return r(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var l=e[o]={exports:{}};n[o][0].call(l.exports,function(t){var e=n[o][1][t];return a(e?e:t)},l,l.exports,t,n,e,i)}return e[o].exports}for(var r="function"==typeof require&&require,o=0;o<i.length;o++)a(i[o]);return a}({1:[function(t,n,e){"use strict";var i=t("./unit_chart").UnitChart;d3.json("./data/editor.json",function(t,n){i("editorchart",n)}),d3.json("./data/unit_column_chart_shared.json",function(t,n){i("unit_column_chart_shared",n)}),d3.json("./data/unit_column_chart.json",function(t,n){i("unit_column_chart",n)}),d3.json("./data/unit_column_chart_shared_mark.json",function(t,n){i("unit_column_chart_shared_mark",n)}),d3.json("./data/titanic_spec_packxy_hierarchy.json",function(t,n){i("packxy_hierarchy",n)}),d3.json("./data/titanic_spec_packxy_isolated.json",function(t,n){i("packxy_isolated",n)}),d3.json("./data/titanic_spec4.json",function(t,n){i("packxy2",n)});var a=document.getElementById("jsoneditor"),r={},o=new JSONEditor(a,r);d3.json("./data/editor.json",function(t,n){o.set(n)});var c=d3.select("#updatebutton");c.on("click",function(){var t=o.get();console.log(t),d3.select("#editorchart").select("svg").remove(),i("editorchart",t)})},{"./unit_chart":2}],2:[function(t,n,e){"use strict";function i(t){if(Array.isArray(t)){for(var n=0,e=Array(t.length);n<t.length;n++)e[n]=t[n];return e}return Array.from(t)}function a(t,n){var e={};return e.contents=t,e.label="root",n.hasOwnProperty("padding")||(n.padding={top:10,left:30,bottom:30,right:10}),e.visualspace={width:n.width,height:n.height,posX:0,posY:0,padding:n.padding},e.layout="StartOfLayout",e.parent="RootContainer",e}function r(t,n){var e={};return e.head=t[0],t.forEach(function(t,n,e){n>0?t.parent=e[n-1]:t.parent="StartOfLayout",n<e.length-1?t.child=e[n+1]:t.child="EndOfLayout"}),e}function o(t,n){var e=d3.nest().key(function(t){return t[n]}).entries(t);return e.map(function(t){return t.key})}function c(t,n){return o(t,n).map(function(t){return{contents:[],label:t,visualspace:{}}})}function s(t,n,e){switch(console.log("calcVisualSpace",e.name),e.containers=n,e.type){case"gridxy":u(t,n,e);break;default:console.log("Unsupported Layout type")}}function u(t,n,e){switch(e.aspect_ratio){case"fillX":case"fillY":l(t,n,e);break;case"square":case"parent":case"custom":d(t,n,e)}}function l(t,n,e){var i=t.visualspace;"fillX"===e.aspect_ratio?n.forEach(function(t,n,a){t.visualspace.width=1*(i.width-i.padding.left-i.padding.right)/a.length-e.margin.left-e.margin.right,t.visualspace.height=i.height-i.padding.top-i.padding.bottom-e.margin.top-e.margin.bottom,t.visualspace.posX=i.padding.left+n*(t.visualspace.width+e.margin.right+e.margin.left)+e.margin.left,t.visualspace.posY=i.padding.top+e.margin.top,t.visualspace.padding=e.padding}):"fillY"===e.aspect_ratio?n.forEach(function(t,n,a){t.visualspace.height=1*(i.height-i.padding.top-i.padding.bottom)/a.length-e.margin.top-e.margin.bottom,t.visualspace.width=i.width-i.padding.left-i.padding.right-e.margin.left-e.margin.right,t.visualspace.posY=i.padding.top+n*(t.visualspace.height+e.margin.top+e.margin.bottom)+e.margin.top,t.visualspace.posX=i.padding.left+e.margin.left,t.visualspace.padding=e.padding}):console.log("TODO")}function d(t,n,e){p(t,n,e)}function p(t,n,e){v(e.direction)?h(t,n,e):calcHeightFillingPackVisualSpace(t,n,e)}function h(t,n,e){var i;switch(e.aspect_ratio){case"square":i=1;break;case"parent":i=1*t.visualspace.width/t.visualspace.height}var a=g(t.visualspace.width,t.visualspace.height,n.length,i);f(t,n,e,a)}function f(t,n,e,i){var a,r,o,c,s;switch(e.direction){case"LRTB":a=0,r=0,o=i.fillingEdgeSideUnitLength,c=i.remainingEdgeSideUnitLength,s=i.fillingEdgeRepetitionCount;break;case"LRBT":a=0,r=t.visualspace.height-i.remainingEdgeSideUnitLength,o=i.fillingEdgeSideUnitLength,c=-1*i.remainingEdgeSideUnitLength,s=i.fillingEdgeRepetitionCount;break;case"RLBT":case"RLTB":console.log("TODO")}n.forEach(function(t,n,u){t.visualspace.width=i.fillingEdgeSideUnitLength,t.visualspace.height=i.remainingEdgeSideUnitLength,t.visualspace.posX=a+o*(n%s),t.visualspace.posY=r+c*Math.floor(n/s),t.visualspace.padding=e.padding})}function g(t,n,e,i){var a,r,o,c,s=0;do s++,c=1*t/s,a=c/i,r=Math.floor(1*n/a),o=r*s;while(e>o);return{fillingEdgeRepetitionCount:s,remainingEdgeRepetitionCount:r,fillingEdgeSideUnitLength:c,remainingEdgeSideUnitLength:a}}function v(t){switch(t){case"LRBT":case"LRTB":case"RLBT":case"RLTB":return!0;case"BTLR":case"BTRL":case"TBLR":case"TBLR":return!1}}function y(t,n){var e=t.sizeSharingGroup;return d3.min(e,function(t){return t.visualspace[n]})}function m(t,n){var e=w(n.sizeSharingGroup);e.forEach(function(e){var i=b(e,t,n);f(e,e.contents,n,i)})}function w(t){var n=new Set;return t.forEach(function(t){n.add(t.parent)}),[].concat(i(n))}function b(t,n,e){var i,a=Math.round(t.visualspace.width/n),r=0;return"square"===e.aspect_ratio?i=n:console.log("TODO"),{fillingEdgeRepetitionCount:a,remainingEdgeRepetitionCount:r,fillingEdgeSideUnitLength:n,remainingEdgeSideUnitLength:i}}function E(t,n){var e=S(t,n);s(t,e,n),"EndOfLayout"!==n.child&&e.forEach(function(t){E(t,n.child)}),t.contents=e,k(t,n),console.log("Fininshing",n.name)}function k(t,n){n.size.isShared?(n.hasOwnProperty("sizeSharingGroup")||(n.sizeSharingGroup=[]),n.sizeSharingGroup=n.sizeSharingGroup.concat(t.contents)):_(n.child)}function _(t){"EndOfLayout"!==t&&t.size.isShared===!0&&("EndOfLayout"!=t.child&&t.child.size.isShared&&_(t.child),x(t),t.sizeSharingGroup=[])}function x(t){switch(t.aspect_ratio){case"fillX":case"fillY":L(t);break;case"square":case"parent":case"custom":O(t)}}function L(t){console.log("TODO: makeSharedSizeFill")}function O(t){if(console.log(t),v(t.direction)){var n=y(t,"width");m(n,t)}else{calcHeightFillingPackVisualSpace(parentContainer,childContainers,t);y(childContainers,"height")}}function S(t,n){var e=T(t,n,"groupby"),i=P(e);return n.groupby.hasOwnProperty("type")&&"numerical"===n.groupby.type?j(i,t,n):R(i,t,n)}function R(t,n,e){var i=c(t,e.groupby.key);return i.forEach(function(t,i,a){t.contents=n.contents.filter(function(n){return n[e.groupby.key]==t.label}),t.parent=n}),i}function j(t,n,e){var i=e.groupby,a=d3.extent(t,function(t){return+t[i.key]}),r=d3.scaleLinear().domain([0,i.numBin]).range(a),o=d3.range(i.numBin+1).map(r),c=t.filter(function(t){return""==t[i.key]}),s=t.filter(function(t){return""!=t[i.key]}),u=d3.histogram().domain(a).thresholds(o).value(function(t){return+t[i.key]})(s);console.log(u),c=[c],c.x0="",c.x1="";var l=c.concat(u);return l=l.map(function(t){return{contents:t,label:t.x0+"-"+t.x1,visualspace:{},parent:n}})}function T(t,n,e){return n[e].isShared&&"RootContainer"!==t.parent?T(t.parent,n.parent,e):t}function P(t){if(U(t)){var n=[];return t.contents.forEach(function(t){var e=P(t);e.forEach(function(t){n.push(t)})}),n}return[t]}function U(t){return!!(t.hasOwnProperty("contents")&&t.hasOwnProperty("visualspace")&&t.hasOwnProperty("parent"))}function B(t,n,e,i){var a=n.layouts,r=n.mark,o=d3.select("#"+i).append("svg").attr("width",n.width).attr("height",n.height),c=o.selectAll(".root").data([t]).enter().append("g").attr("class","root").attr("transform",function(t){return"translate("+t.visualspace.posX+", "+t.visualspace.posY+")"}),s=c;a.forEach(function(t){var n=s.selectAll("."+t.name).data(function(t){return t.contents}).enter().append("g").attr("class",t.name).attr("transform",function(t){return"translate("+t.visualspace.posX+", "+t.visualspace.posY+")"});n.append("rect").attr("x",0).attr("y",0).attr("width",function(t){return t.visualspace.width}).attr("height",function(t){return t.visualspace.height}).style("opacity",function(n){return t.hasOwnProperty("box")&&t.box.hasOwnProperty("opacity")?t.box.opacity:q.layout.box.opacity}).style("fill",function(n){return t.hasOwnProperty("box")&&t.box.hasOwnProperty("fill")?t.box.fill:q.layout.box.fill}).style("stroke",function(n){return t.hasOwnProperty("box")&&t.box.hasOwnProperty("stroke")?t.box.stroke:q.layout.box.stroke}).style("stroke-width",function(n){return t.hasOwnProperty("box")&&t.box.hasOwnProperty("stroke-width")?t.box["stroke-width"]:q.layout.box["stroke-width"]}),s=n}),s.append("circle").attr("cx",function(t){return t.visualspace.width/2}).attr("cy",function(t){return t.visualspace.height/2}).attr("r",function(n){return C(n,t,r,e)}).style("fill",function(t){return"purple"})}function C(t,n,e,i){var a;return a=e.size.isShared?X(t,n,e,i):z(t,e)}function z(t,n){var e=t.visualspace.width,i=t.visualspace.height;if("max"===n.size.type)return e>i?i/2:e/2}function X(t,n,e,i){var a=Y(n,i.head);return d3.min(a,function(t){return z(t,e)})}function Y(t,n){if("EndOfLayout"!==n.child){var e=[];return t.contents.forEach(function(t){var i=Y(t,n.child);i.forEach(function(t){e.push(t)})}),e}return t.contents}e.UnitChart=function(t,n){d3.csv(n.data,function(e,i){i.forEach(function(t,n){t.id=n});var o=a(i,n),c=r(n.layouts);E(o,c.head),B(o,n,c,t)})};var q={layout:{box:{fill:"blue",stroke:"black","stroke-width":1,opacity:.03}}}},{}]},{},[1]);