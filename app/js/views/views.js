var app = app || {};

app.AppView = Backbone.View.extend({
  el: '#wrap',

  events: {
    'change .ph-selected-file': 'manageSelectedFile',
  },

  initialize: function(data) {
    this.map = data.map;
    this.$photos = this.$('.ph-image-list');

    this.collection = new app.PhotoList();
    this.listenTo(this.collection, 'add', this.addOnePhoto);
    this.collection.fetch();

    this.on('marker:add', this.markerAdd, this);
  },

  addOnePhoto: function(model) {
    var view = new app.PhotoView({model: model});

    this.$photos.append(view.render().el);
    this.trigger('marker:add', model.toJSON());
  },

  markerAdd: function(data) {
    L.marker([data.lat, data.lng]).addTo(this.map).bindPopup(data.filename);
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

app.ModalView = Backbone.View.extend({
  template: _.template($('.ph-modal-template').html()),

  initialize: function(data) {
    this.data = {
      src: data.src,
      filename: data.filename
    };

    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.data));
    $('body').append(this.el);

    return this;
  },

  unrender: function() {
    this.remove();
    $('.ui.modal').remove();
  },

  show: function() {
    var _this = this,
      result = new $.Deferred();

    $('.ui.modal').modal('setting', {
      closable: false,
      onDeny : function(){
        result.reject();
        _this.unrender();
      },
      onApprove : function() {
        result.resolve();
        _this.unrender();
      }
    }).modal('show');

    return result.promise();
  }

});

app.PhotoView = Backbone.View.extend({
  tagName: 'div',
  className: 'ph-photo-wrap',
  template: _.template($('.ph-photo-wrap-template').html()),

  events: {
    'mouseenter': 'mouseenter',
    'mouseleave': 'mouseleave',
    'click .trash': 'tryRemove'
  },

  mouseleave: function() {
    this.$('img').removeClass('disabled');
  },

  mouseenter: function() {
    this.$('img').addClass('disabled');
  },

  tryRemove: function() {
    var _this = this;

    new app.ModalView(this.model.toJSON()).show().done(function() {
      _this.model.destroy().done(function() {
        _this.remove();
      });
    });
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  }
});
