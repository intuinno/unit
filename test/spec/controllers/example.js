'use strict';

describe('Controller: ExampleCtrl', function () {

  // load the controller's module
  beforeEach(module('unitApp'));

  var ExampleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExampleCtrl = $controller('ExampleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ExampleCtrl.awesomeThings.length).toBe(3);
  });
});
