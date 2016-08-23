'use strict';

describe('Service: UnitChart', function () {

  // load the service's module
  beforeEach(module('unitApp'));

  // instantiate service
  var UnitChart;
  beforeEach(inject(function (_UnitChart_) {
    UnitChart = _UnitChart_;
  }));

  it('should do something', function () {
    expect(!!UnitChart).toBe(true);
  });

});
