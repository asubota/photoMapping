
describe("photoMapping application", function() {

  it("should have leaflet maps", function() {
    expect(L).toBeDefined();
    expect(L.map).toBeDefined();
  });

  it("should be defined", function() {
    expect(app).toBeDefined();
  });

  it("should have MapView method", function() {
    expect(app.MapView).toBeDefined();
  });

  describe('MapView method', function() {
    var mapView;

    beforeEach(function() {
      mapView = new app.MapView();
    });

    it("should have validate method", function() {
      expect(mapView.validate).toBeDefined();
    });

    it("should return false when validate doesn't pass", function() {
      var badFiles = [
        {type: 'image/png'},
        {type: 'text/html'},
        {type: ''},
        {type: 'application/zip'},
        {type: 'text/x-markdown '}
      ];

      expect(mapView.validate(badFiles)).toBe(false);
    });

    it("should return true when validate pass", function() {
      var goodFiles = [
        {type: 'image/png'},
        {type: 'image/jpeg '}
      ];

      expect(mapView.validate(goodFiles)).toBe(true);
    });

  });

});
