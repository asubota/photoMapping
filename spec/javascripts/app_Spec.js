describe("Application", function() {
  var app;

  beforeEach(function() {
    app = app || {};
  });

  it("should be defined", function() {
    expect(app).toBeDefined();
  });

  it("should have leaflet maps", function() {
    expect(L).toBeDefined();
    expect(L.map).toBeDefined();
  });

});
