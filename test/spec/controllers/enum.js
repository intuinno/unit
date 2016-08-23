'use strict';

describe('Controller: EnumCtrl', function () {

  // load the controller's module
  beforeEach(module('unitApp'));

  var EnumCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EnumCtrl = $controller('EnumCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EnumCtrl.awesomeThings.length).toBe(3);
  });
});
