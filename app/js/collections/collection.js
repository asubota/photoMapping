var app = app || {};

app.PhotoList = Backbone.Collection.extend({
  model: app.PhotoModel,
  url: '/photos'
});
