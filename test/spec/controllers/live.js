'use strict';

describe('Controller: LiveCtrl', function () {

  // load the controller's module
  beforeEach(module('unitApp'));

  var LiveCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LiveCtrl = $controller('LiveCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LiveCtrl.awesomeThings.length).toBe(3);
  });
});
