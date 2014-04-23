var app = app || {};

app.PhotoModel = Backbone.Model.extend({
  idAttribute: 'filename',

  defaults: {
    filename: '',
    src: '',
    lat: 50,
    lng: 30
  }
});
