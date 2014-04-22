var app = app || {};

app.PhotoModel = Backbone.Model.extend({
  defaults: {
    filename: '',
    src: '',
    lat: 50,
    lng: 30
  }
});
