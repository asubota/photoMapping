$(function() {

  var map;

  try {
    map = L.map('map').setView([50.414124,30.522423], 13);
    L.Icon.Default.imagePath = '/images';
    L.tileLayer('http://{s}.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/997/256/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map);
  } catch(e) {

  }

  $('#content .menu .item').tab();
  $('.ui.checkbox').checkbox();

  var photos = new App.Collection.PhotoCollection();

});
