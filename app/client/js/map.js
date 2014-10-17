var map;
var infowindow;
var textToFile ="Places.place_id \r\n";
var placedMarkers= [];
var placedMarkersInfo = [];
Array.prototype.binaryIndexOf = binaryIndexOf;
var lastPosition = new google.maps.LatLng();

function initialize() {
	var mapOptions = { zoom: 15 };
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Try HTML5 geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			lastPosition = pos;
			
			infowindow = new google.maps.InfoWindow({
				map: map,
				position: pos,
				content: 'Location found using HTML5.'
			});

			map.setCenter(pos); 
			// Search request 
			var request = {
				//bounds: map.getBounds();
				location: pos,
				rankby : google.maps.places.RankBy.DISTANCE,
				//service.setBounds(map.getBounds()),
				radius: 4000,
				types: ['restaurant','cafe', 'bar', 'food']
				//query: 'restaurant',
			};
	
			infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(map);
			//service.nearbySearch(request, callback);
			service.radarSearch(request, callback);
			//https://developers.google.com/maps/documentation/javascript/places#TextSearchRequests
			//service.textSearch(request, callback);
			// Bias the seach results towards places that are within the bounds of the
			// current map's viewport.
			google.maps.event.addListener(map, 'bounds_changed', function() {
		
				if(google.maps.geometry.spherical.computeDistanceBetween(lastPosition, map.getCenter()) > 2000){
					clearMarkers();
					console.log(lastPosition);
					lastPosition = map.getCenter();
					request.location=map.getCenter();
					
					//service.nearbySearch(request, callback);
					service.radarSearch(request, callback);
				}
			});
	
			initializeSearchBar();
	 
		}, function() {
			handleNoGeolocation(true);
		});
	
	} 
  
	else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}
    

}

function createDoc()
{
	var doc=document.open("answer.txt","replace");
	var txt="<html><body>You clicked Allow</body></html>";
	doc.write(txt);
	doc.close();
}


function initializeSearchBar() {


	var markers = [];

	// Create the search box and link it to the UI element.
	var input = /** @type {HTMLInputElement} */( document.getElementById('pac-input'));
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var searchBox = new google.maps.places.SearchBox(
	/** @type {HTMLInputElement} */(input));

		// Listen for the event fired when the user selects an item from the
		// pick list. Retrieve the matching places for that item.
		google.maps.event.addListener(searchBox, 'places_changed', function() {
	
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}
		
		for (var i = 0, marker; marker = markers[i]; i++) {
			marker.setMap(null);
		}

		// For each place, get the icon, place name, and location.
		markers = [];
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++) {
			var image = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			var marker = new google.maps.Marker({
				map: map,
				icon: image,
				title: place.name,
				position: place.geometry.location
			});

			markers.push(marker);
			bounds.extend(place.geometry.location);
		}
		map.fitBounds(bounds);
	});

	// Bias the SearchBox results towards places that are within the bounds of the
	// current map's viewport.
	google.maps.event.addListener(map, 'bounds_changed', function() {
		var bounds = map.getBounds();
		searchBox.setBounds(bounds);
	});

}



// --- This is fed in the "result" of the search as an array, and for each a marker is placed 
function callback(results, status, pagination) {
	if (status != google.maps.places.PlacesServiceStatus.OK) {
		//alert(status);
		return;
	}
	else{
	//clearMarkers();
		var skip = false;
		for (var i = 0; i < results.length; i++) {
		  
			skip = false;
			for (var markerId = 0; markerId < placedMarkers.length; markerId++) {
				if( placedMarkers[markerId].markerId == results[i].place_id){
					skip = true;
					break;
				}
			}
			
			if( !skip){
				createMarker(results[i]);	// for each place in result create marker
			}
		}
	}
  
	if( pagination.hasNextPage){
		sleep:3;
		pagination.nextPage();
	}
 
}

/**
 * Performs a binary search on the host array. This method can either be
 * injected into Array.prototype or called with a specified scope like this:
 * binaryIndexOf.call(someArray, searchElement);
 *
 * @param {*} searchElement The item to search for within the array.
 * @return {Number} The index of the element which defaults to -1 when not found.
 */
function binaryIndexOf(searchElement) {
	'use strict';

	var minIndex = 0;
	var maxIndex = this.length - 1;
	var currentIndex;
	var currentElement;
	var resultIndex;

	while (minIndex <= maxIndex) {
		resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
		currentElement = this[currentIndex];

		if (currentElement < searchElement) {
			minIndex = currentIndex + 1;
		}
		else if (currentElement > searchElement) {
			maxIndex = currentIndex - 1;
		}
		else {
			return currentIndex;
		}
	}

	return ~maxIndex;
}


//Adds pin to map
function createMarker(place) {

	// Marker this is the pin on the map.
    var marker =  new MarkerWithLabel({
		//icon: "../img/restaurant.png",		//Square restaurant 
		icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0",  //Red dot
		map: map,
		position: place.geometry.location,
		draggable: false,    //property that allows user to move marker
		raiseOnDrag: false,
		//labelContent:randomIntFromInterval(1,15),	// The labels content 
		labelAnchor: new google.maps.Point(7, 33),    // anchors to
		labelClass: "labels", // the CSS class for the label
		
		// Just me things
		markerId : place.place_id,
		name: place.name,
    });
	
	placedMarkers.push(marker);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
		//alert(this.name );
		//alert(this.markerId);
	});

}

//Temp thing to return random numbers
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Removes the markers from the map,
function clearMarkers(){
	for (var i = 0; i < placedMarkers.length; i++ ) {
		placedMarkers[i].setMap(null);
	}
	placedMarkers.length = 0;
	placedMarkers = [];
	
}

function handleNoGeolocation(errorFlag) {
	if (errorFlag) {
		var content = 'Error: The Geolocation service failed.';
	} else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	}

	var options = {
		map: map,
		position: new google.maps.LatLng(-33.8665433, 151.1956316),   // This is the position it goes to if the user failed to give permision or, it failed for some other reason
		content: content
	};
	
	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}


google.maps.event.addDomListener(window, 'load', initialize);