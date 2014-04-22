var app = app || {};

app.AppView = Backbone.View.extend({
  el: '#wrap',

  events: {
    'change .ph-selected-file': 'manageSelectedFile'
  },

  initialize: function() {
    this.$photos = this.$('.ph-image-list');
    this.collection = new app.PhotoList();

    this.listenTo(this.collection, 'add', this.addOnePhoto);
    this.collection.fetch();
  },

  addOnePhoto: function(model) {
    var view = new app.PhotoView({model: model});

    this.$photos.append(view.render().el);
  },

  manageSelectedFile: function(event) {
    var _this = this;
    var files = this.$('.ph-selected-file').get(0).files,
      $fileName = this.$('.ph-file-name');

    $('.ph-file-error').empty();
    this.$('form').ajaxSubmit({
      success: function(responseData, textStatus) {
        if (_.has(responseData, 'status')) {
           $('.ph-file-error').html(responseData.message);
        } else {
          _this.collection.add(responseData);
        }
      }
    });

  }
});

app.PhotoView = Backbone.View.extend({
  tagName: 'div',
  className: 'ph-photo-wrap',
  template: _.template('<img src="<%= src %>" title="<%= filename %>" class="rounded ui image">'),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  }
});
