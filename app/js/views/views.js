var app = app || {};

app.AppView = Backbone.View.extend({
  el: '#wrap',

  events: {
    'change .ph-selected-file': 'manageSelectedFile',
    'click .icon.marker': 'manageMarker'
  },

  manageMarker: function(event) {
    var el = event.target,
      marker_id = el.dataset.marker_id,
      marker = this.markers.getLayer(marker_id),
      opacity = !!marker.options.opacity?0:1;

    marker.setOpacity(opacity);
    $(el).toggleClass('red', marker.options.opacity);
  },

  initialize: function(data) {
    this.map = data.map;
    this.$photos = this.$('.ph-image-list');

    this.collection = new app.PhotoList();
    this.listenTo(this.collection, 'add', this.addOnePhoto);
    this.collection.fetch();

    this.markers = L.layerGroup().addTo(this.map);
  },

  addOnePhoto: function(model) {
    var marker = L.marker([model.get('lat'), model.get('lng')]).bindPopup(model.get('filename')),
      view;

    this.markers.addLayer(marker);
    model.marker_id = marker._leaflet_id;

    view = new app.PhotoView({model: model});
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
    'click .icon.trash': 'tryRemove'
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
    var data = _.extend(this.model.toJSON(), {
      marker_id: this.model.marker_id
    });

    this.$el.html(this.template(data));

    return this;
  }
});
