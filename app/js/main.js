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
    }

  });

  var mapView = new MapView();

});