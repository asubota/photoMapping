var app = app || {};

app.PhotoModel = Backbone.Model.extend({
  defaults: {
    filename: 'test.jpg',
    src: '/../uploads/thumb/test.jpg',
    lat: 50,
    lng: 30
  }
});
