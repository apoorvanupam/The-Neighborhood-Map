let ViewModel = function(){
  // Creating let locationList and searchedTextas observable array & observable
  // Setting self as ViewModel's
  let self = this;
  this.locationList = ko.observableArray([]);
  this.searchedText = ko.observable('');
  this.listEmpty = ko.observable(false);

// Pushing markers in LocationList observable array
  markers.forEach(function(marker){
    self.locationList.push(marker);
  });

 // After search keyword is entered, these functions will execute
  this.searchedText.subscribe(function(newvalue){
    self.listEmpty(false);
    let newList = [];
    // Setting marker's visible that includes any letter of searched value others invisible
    for (let i = 0; i < markers.length; i++) {
        if (markers[i].title.toLowerCase().includes(newvalue.toLowerCase())) {
            markers[i].setVisible(true);
            // Pushing visible markers
            newList.push(markers[i]);
        } else {
            markers[i].setVisible(false);
        }
    }
    // Checking whether list is empty, if list is empty then display 'no results found'
    if(!newList.length) {
      self.listEmpty(true);
    }
    // Pushing updated newList
    self.locationList(newList);
  });

  // Hiding the slide-panel
  this.togglePanel = function(){
    $('body').toggleClass('panel-hidden');
  }

  // Setting marker animation to bounce for 1500ms
  this.highlightMarker = function(e){
    self.togglePanel();
    e.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
      e.setAnimation(null);
    }, 1500);
    populateInfoWindow(e, largeInfowindow);
    }
  }
  // Createing infowindow for each marker
function populateInfoWindow(marker, infowindow) {
  infowindow.marker = marker;
  // Setting infowindow maximum width
  infowindow.setOptions({maxWidth:250});
  // Setting infowindow content to marker title
  infowindow.setContent(`<div class="text-center iw-header text-white m-2">${marker.title}</div><div class="text-center m-3"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>`);
  // Wikipedia API Url & set datatype to jsonp
  const url = `http://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=pageimages&list=search&titles=${marker.title}&pithumbsize=200&srsearch=${marker.title}`;
  const body = {dataType: 'jsonp'};
  // Fetching reponse from api & retrieve data & set snippet from wikipedia reponse
  // Show error message in information window in case of error
  fetch(url, body)
    .then(response => response.json())
    .then(data => {
      infowindow.setContent(`<div class="text-center iw-header text-white m-2">${marker.title}</div><div class="m-2"><p class="iw-text">${data.query.search[0].snippet}<a class="text-primary" target="_blank" href="https://en.wikipedia.org/w/index.php?title=${marker.title}"> (Read more)</a></p><p class="mt-3">Attribution: Wikipedia, <a class="text-primary" target="_blank" href="https://en.wikipedia.org/w/index.php?title=${marker.title}">https://en.wikipedia.org/w/index.php?title=${marker.title}</a></p></div>`);
    }).catch(e => {
      infowindow.setContent(`<div class="text-center iw-header text-white m-2">${marker.title}</div><div class="m-2"><p class="iw-text text-danger">Sorry, Wikipedia API could not get loaded. Please try again!</p></div>`);
    });
  infowindow.open(map, marker);
  // Stopping marker animation & setting marker value to null
  infowindow.addListener('closeclick',function(){
    marker.setAnimation(null);
    infowindow.setMarker = null;
  });
}
