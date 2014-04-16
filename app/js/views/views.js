var app = app || {};

app.AppView = Backbone.View.extend({
  el: '#wrap',

  initialize: function() {
    this.$photos = this.$('.ph-image-list');
    this.collection = new app.PhotoList();

    this.listenTo(this.collection, 'add', this.addOne);
    this.collection.fetch();
  },

  addOne: function(model) {
    var view = new app.PhotoView({model: model});

    this.$photos.append(view.render().el);
  }
});

app.PhotoView = Backbone.View.extend({
  tagName: 'div',
  className: 'ph-photo-wrap',
  template: _.template('<img src="<%= src %>" title="<%= filename %>">'),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  }
});