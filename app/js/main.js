var app = app || {};

$(function() {

  var map = L.map('map').setView([50.414124,30.522423], 13);

  L.Icon.Default.imagePath = '/images';

  L.tileLayer('http://{s}.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/997/256/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(map);

  $('#content .menu .item').tab();
  $('.ui.checkbox').checkbox();


  app.MapView = Backbone.View.extend({
    el: $('body'),

    mapData: {
      markersVisible: false,
      markers: null
    },

    events: {
      'click .ph-markers-manage': 'manageMarkerLayer',
      'click .ph-form-submit': 'submitForm',
      'change .ph-selected-file': 'manageSelectedFile'
    },

    initialize: function(){
      _.bindAll(this, 'render');
      this.render();
      this.getData();
    },

    manageMarkerLayer: function(event) {
      if (this.mapData.markersVisible) {
        map.removeLayer(this.mapData.markers);
        this.mapData.markersVisible = false;
      } else {
        map.addLayer(this.mapData.markers);
        this.mapData.markersVisible = true;
      }
    },

    render: function(){

    },

    getData: function() {
      var _this = this;

      $.getJSON('/getData', function(data) {
        var markers = [];

        _.each(data, function(item, index) {
          markers.push(L.marker([item.lat, item.lng]));
        // var $img = $('<img>').attr('src', item.src).addClass('rounded ui image').attr('title', item.filename);
        // _this.$('.ph-image-list').append($img);
        });

        _this.mapData.markers = L.layerGroup(markers);

      });
    },

    validate: function(files) {
      var valid = true;

      _.each(files, function(file, index) {
        if (!file.type.match(/image.*/)) {
          valid = false;
        }
      });

      return valid;
    },

    submitForm: function() {
      var form = this.$('.ph-form'),
        _this = this;

      $(form).ajaxSubmit({
        beforeSubmit: function(arr, $form, options) {
          options.dataType = 'json';
        },
        success: function(responseData, textStatus) {
          _this.$('.ph-file-name').empty();
          _this.hideError();
        }
      });
    },

    hideError: function() {
      this.$('.ph-file-error').empty();
    },

    showError: function() {
      this.$('.ph-file-error').html('wrong file');
    },

    manageSelectedFile: function(event) {
      var files = this.$('.ph-selected-file').get(0).files,
          $fileName = this.$('.ph-file-name');

      $fileName.html(files[0].name);

      if (this.validate(files)) {
        this.submitForm();
      } else {
        this.showError();
      }
    }
  });

  var mapView = new app.MapView();

});
