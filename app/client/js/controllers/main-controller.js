
app.controller('mainController', ['$scope', '$resource','$modal', 'mealService', 
	function ($scope, $resource,$modal,mealService) {
		$scope.placedMarkers = [];
		$scope.lastPosition = new google.maps.LatLng();
		var mapOptions = {
			zoom: 14
		}

		$scope.initialize = function() {
			$scope.map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					/*$scope.infowindow = new google.maps.InfoWindow({
				    	map: $scope.map,
				    	position: pos,
				        content: 'Location found using HTML5.'
				    });*/

				    $scope.map.setCenter(pos);
					$scope.lastPosition = $scope.map.getCenter();

				    var request = {
						location: pos,
						rankby : google.maps.places.RankBy.DISTANCE,
						radius: 4000,
						types: ['restaurant','cafe', 'bar', 'food']
					};
					
				    $scope.infowindow = new google.maps.InfoWindow();
				    var service = new google.maps.places.PlacesService($scope.map);
				    service.radarSearch(request, callback);
					
				    google.maps.event.addListener($scope.map, 'bounds_changed', function() {

				    	if(google.maps.geometry.spherical.computeDistanceBetween($scope.lastPosition, $scope.map.getCenter()) > 2000){
						
							clearMarkers();
							$scope.lastPosition = $scope.map.getCenter();
							request.location=$scope.map.getCenter();
							service.radarSearch(request, callback);
						}

				    });
					
				/*	
					// Testing id that I KNOW is in the data base
					var tempRequest = {
						placeId: 'ChIJs8FQZ3V0j1QRYwgN-UfyxVQ'
					};
					

					service = new google.maps.places.PlacesService($scope.map);
					service.getDetails(tempRequest, callback);
					*/
				    initializeSearchBar();
				}, function() {
					handleNoGeolocation(true);
				});
			} else {
				handleNoGeolocation(true);
			}
			initializeSearchBar();
		}

		initializeSearchBar = function() {
			var markers = [];
			// Create the search box and link it to the UI element.
			var input = /** @type {HTMLInputElement} */(
		    	document.getElementById('pac-input'));
			$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
						map: $scope.map,
						icon: image,
						title: place.name,
						position: place.geometry.location
					});

					markers.push(marker);
					bounds.extend(place.geometry.location);
				}
				$scope.map.fitBounds(bounds);
			});

			// Bias the SearchBox results towards places that are within the bounds of the
			// current map's viewport.
			google.maps.event.addListener($scope.map, 'bounds_changed', function() {
		    	var bounds = $scope.map.getBounds();
		    	searchBox.setBounds(bounds);
			});
		}

		// --- This is fed in the "result" of the search as an array, and for each a marker is placed 
		callback = function(results, status, pagination) {
			if (status != google.maps.places.PlacesServiceStatus.OK) {
			//alert(status);
				return;
			} else {
				//clearMarkers();
				var skip = false;
				for (var i = 0; i < results.length; i++) {
					skip = false;
					for (var markerId = 0; markerId < $scope.placedMarkers.length; markerId++) {
						if($scope.placedMarkers[markerId].markerId == results[i].place_id){
							skip = true;
							break;
						}
					}
					if(!skip) {
						createMarker(results[i]);	// for each place in result create marker
					}
				}
			}
		}

		//Adds pin to map
		createMarker = function(place) {
			
	
			var meal = mealService.getMealsAtPlaceID( place.place_id).success(function(data){
			
				if( data.length >0){
					
					// This is the Mangiamo Meal marker, ie there is a meal here
					var marker =  new MarkerWithLabel({
						icon: '../../img/restaurant.png',
						map: $scope.map,
						position:  place.geometry.location,
						draggable: false,    //property that allows user to move marker
						raiseOnDrag: false,
						labelContent:data[0].numPeople, 
						labelAnchor: new google.maps.Point(7, 33),    // anchors to
						labelClass: "labels", // the CSS class for the label
						
						// Just me things
						markerId : place.place_id,
						hasMeal: true,
					});
				}
				else {
					
					// THIS IS THE DOT MARKER, ie no meals here
					var marker =  new MarkerWithLabel({
						icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0",  //Red dot
						map: $scope.map,
						position: place.geometry.location,
						draggable: false,    //property that allows user to move marker
						raiseOnDrag: false,
						//labelContent:randomIntFromInterval(1,15), 
						labelAnchor: new google.maps.Point(7, 33),    // anchors to
						labelClass: "labels", // the CSS class for the label
						
						// Just me things
						markerId : place.place_id,
						hasMeal: false,
					});
				}
				
				$scope.placedMarkers.push(marker); // Array marker

				google.maps.event.addListener(marker, 'click', function() {
					
					var request = {
						placeId:marker.markerId,
					};
					var service = new google.maps.places.PlacesService($scope.map);
					service.getDetails(request,getPlaceDetails);
			
					// Returns ALL the place details and information 
					function getPlaceDetails(place, status) {
						  if (status == google.maps.places.PlacesServiceStatus.OK) {
						  //console.log(place.name);
							//return place.name;
							$scope.openModal('lg',place, marker);
						}
					}
				});
			
			});
			
		}
		
		
		
		// Opens a modal when a map pin is clicked.
		$scope.openModal = function (size, placeInfo, marker) {
		
			var modalInstance = $modal.open({
				templateUrl: 'modalContent.html',
				controller: 'ModalInstanceCtrl',
				size: size,
				resolve: {
					placeInfo: function () {
						return placeInfo;
					},
					marker: function() {
						return marker;
					}
				}
			});
			
			
		}
		
		//Temp thing to return random numbers
		randomIntFromInterval = function(min,max)
		{
		    return Math.floor(Math.random()*(max-min+1)+min);
		}

		// Removes the markers from the map, but keeps them in the array.
		// Removes the markers from the map,
		function clearMarkers(){
			for (var i = 0; i < $scope.placedMarkers.length; i++ ) {
				$scope.placedMarkers[i].setMap(null);
			}
			$scope.placedMarkers.length = 0;
			$scope.placedMarkers = [];
			
		}

		
		function handleNoGeolocation(errorFlag) {
			if (errorFlag) {
				var content = 'Error: The Geolocation service failed.';
			} else {
				var content = 'Error: Your browser doesn\'t support geolocation.';
			}

			var options = {
				map: $scope.map,
				position: new google.maps.LatLng(-33.8665433, 151.1956316),   // This is the position it goes to if the user failed to give permision or, it failed for some other reason
				content: content
			};
			
			var infowindow = new google.maps.InfoWindow(options);
			$scope.map.setCenter(options.position);
		}
}]);




app.controller('ModalInstanceCtrl', function($scope, $modalInstance, mealService, userService, placeInfo, marker) {
	$scope.placeInfo =placeInfo;
	$scope.restName =placeInfo.name;
	if (marker.hasMeal) {
		$scope.hasMeal = "Join!";
	}
	else {
		$scope.hasMeal = "Create a Meal";
	}
	
	$scope.users = [];
	
	var peopleInMeal = mealService.getPeopleFromMeal($scope.placeInfo.place_id).success(function(data) {
		for (var i = 0; i < data.length; i++) {
			var user = data[i];
			userService.getUserWithID(user.id).success(function(data) {
				$scope.users.push(data[0]);
			});
		}
	}).error(function(error) {
		console.log(error);
	});
	
	$scope.join = function() {
		if (sessionStorage.userID == null) { return; }
		if ($scope.hasMeal == 'Joined!') { return; }
		var usrID = sessionStorage.userID.replace(/['"]+/g, '');
		if (marker.hasMeal) {
			mealService.addUserToMeal($scope.placeInfo.place_id, usrID).success(function(data) {
				console.log('success');
			}).error(function(error) {
				console.log(error);
			});
			marker.labelContent = marker.labelContent+1; 
			marker.label.setContent();
			$scope.hasMeal = 'Joined!';
		} else {
			mealService.addNewMeal($scope.placeInfo.place_id, 0, new Date(), [], true);
			mealService.addUserToMeal($scope.placeInfo.place_id, usrID).success(function(data) {
				console.log(data);
			}).error(function(error) {
				console.log(error);
			});
			
			marker.setIcon('../../img/restaurant.png');
			marker.hasMeal = true; 
			marker.labelContent = 1; 
			marker.label.setContent();
			
			$scope.hasMeal = 'Joined!';
		}
		userService.getUserWithID(usrID).success(function(data) {
			$scope.users.push(data[0]);
		});
	}

	$scope.ok = function () {
		$modalInstance.close();
	};
	
	
	
	
});
