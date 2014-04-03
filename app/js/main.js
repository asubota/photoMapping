$(function() {

  var map = L.map('map').setView([50.414124,30.522423], 13);

  L.Icon.Default.imagePath = '/images';

  L.tileLayer('http://{s}.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/997/256/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(map);

  $('#content .menu .item').tab();
  $('.ui.checkbox').checkbox();




  var MapView = Backbone.View.extend({
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
      this.getMarkerData();
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

    getMarkerData: function() {
      var _this = this;

      $.getJSON('/getCoords', function(data) {
        var marker = L.marker([data.lat, data.lng]);

        _this.mapData.markers = L.layerGroup([marker]);
      });
    },

    submitForm: function() {
      var form = this.$('.ph-form');

      $(form).ajaxSubmit({
        beforeSubmit: function(arr, $form, options) {
          options.dataType = 'json';
        },
        success: function(responseData, textStatus) {
          // console.log(responseData);
        }
      });
    },

    manageSelectedFile: function(event) {
      var files = this.$('.ph-selected-file').get(0).files,
          $fileName = this.$('.ph-file-name');

      _.each(files, function(file, index) {
        if (!file.type.match(/image.*/)) {
          return;
        }

        $fileName.html(file.name);
      });
    }

  });

  var mapView = new MapView();

});