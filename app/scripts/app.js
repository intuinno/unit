'use strict';

/**
 * @ngdoc overview
 * @name unitApp
 * @description
 * # unitApp
 *
 * Main module of the application.
 */
angular
  .module('unitApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/example', {
        templateUrl: 'views/example.html',
        controller: 'ExampleCtrl',
        controllerAs: 'example'
      })
      .when('/example', {
        templateUrl: 'views/example.html',
        controller: 'ExampleCtrl',
        controllerAs: 'example'
      })
      .when('/live', {
        templateUrl: 'views/live.html',
        controller: 'LiveCtrl',
        controllerAs: 'live'
      })
      .when('/enum', {
        templateUrl: 'views/enum.html',
        controller: 'EnumCtrl',
        controllerAs: 'enum'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
