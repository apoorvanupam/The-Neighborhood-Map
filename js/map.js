// Global variablses
let map, marker, markers = [];
let largeInfoWindow, bounds;

function initMap() {
  // Making the map
  map = new google.maps.Map($('#map-container')[0], {
    center: {lat: 28.613939, lng: 77.209021},
    zoom: 14
  });

// Creating boundaries
  largeInfowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();

// Creating markers
  for (let i=0; i<locationsArray.length; i++) {
    marker = new google.maps.Marker({
      title: locationsArray[i].name,
      position: locationsArray[i].center,
      map: map
    });
    markers.push(marker);
    // Seting animation on marker
    marker.addListener('click', function() {
      $('body').addClass('panel-hidden');
      let that = this;
      this.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        that.setAnimation(null);
      }, 1500);
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
  ko.applyBindings(new ViewModel());
  return markers;
}

// Error code if Google Map fails to load
function mapError() {
  $('body').addClass('panel-hidden');
  $('#map-container').html('<div class="row justify-content-center"><h1 class="m-5 p-5 text-muted">Sorry, Google Map could not be loaded</h1></div>')
}

// for changing boundaries when window is resized
window.onresize = function() {
  map.fitBounds(bounds);
};
