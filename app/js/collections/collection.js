var App = App || {};
App.Collection = App.Collection || {};


App.Collection.PhotoCollection = Backbone.Collection.extend({
  model: App.Model.PhotoModel,
  url: '/getData'
});
