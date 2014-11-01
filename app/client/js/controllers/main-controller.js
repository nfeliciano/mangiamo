app.controller('mainController', ['$scope', '$resource', '$location', '$modal', 'mealService', 'userService',
	function ($scope, $resource, $location, $modal, mealService, userService) {
		$scope.placedMarkers = [];
		$scope.willBeDeletedMarkers = [];
		$scope.lastPosition = new google.maps.LatLng();

		var mapOptions = {
			zoom: 14
		}

		$scope.addFriend = function(newMealBuddy) {
			userService.addMealBuddy(newMealBuddy);
		}

		/* removeMealBuddy(mealBuddy, rejecting)
		 * mealBuddy: object containing user data
		 * rejecting: bool - True:  User is rejecting a request
		 *					 False: User is deleting an existing friend
		 */
		$scope.removeMealBuddy = function(mealBuddy, rejecting) {
			userService.deleteMealBuddy(mealBuddy[0].key, rejecting);
			$scope.populateMealBuddies();
		}

		$scope.confirmMealBuddy = function(mealBuddyRequest) {
			userService.confirmMealBuddy(mealBuddyRequest[0].key);
			$scope.populateMealBuddies();
		}

		// initializes the google map and populates it with food places
		$scope.initialize = function() {
			$scope.map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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
					
					// refreshes the map with new food places when the map is moved a certain amount
				    google.maps.event.addListener($scope.map, 'bounds_changed', function() {

				    	if(google.maps.geometry.spherical.computeDistanceBetween($scope.lastPosition, $scope.map.getCenter()) > 2000){

							$scope.lastPosition = $scope.map.getCenter();
							request.location=$scope.map.getCenter();
							service.radarSearch(request, smoothUpdateCallback);
						}

				    });

					initializeSearchBar();
				
				}, function() {
					handleNoGeolocation(true);
				});
			} else {
				handleNoGeolocation(true);
			}
			initializeSearchBar();
		}

		// initializes and adds the search bar on the map
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
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) { // Removed the checking because this method now only happens on the first load
						createMarker(results[i]);	// for each place in result create marker
				}
			}
		}

		
		smoothUpdateCallback= function(results, status, pagination) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var newPlaces = [];		//This is a subset of results that will be added
				$scope.willBeDeletedMarkers =  $scope.placedMarkers;	//this is the current set of markers, anything that is left in here will be removed from map
				$scope.placedMarkers = [];	
				var found =false;

				for (var i = 0; i < results.length; i++) {
		
					found = false;
					for (var x = $scope.willBeDeletedMarkers.length-1;  x >=0; x--) {
						
						// If the recent radar search returns a location we already have, then don't remove it, and don't add it again
						if($scope.willBeDeletedMarkers[x].markerId == results[i].place_id){
							found = true;
							$scope.placedMarkers.push($scope.willBeDeletedMarkers[x]);	//add back to placedMarkers
							$scope.willBeDeletedMarkers.splice(x,1);					//this removes the marker we already have from the array that will be deleted
							break;
						}
					}
					
					//if it was not found 
					if(!found) {
						newPlaces.push(results[i]); // these are the markers that will be added
					}
				}
				
				clearMarkers(); //Remove markers that should no longer be on the map	
				
				//for each of the new places, create a marker.
				for( var y =0; y < newPlaces.length; y++){
					createMarker(newPlaces[y]);	// for each place not already on map
				}
				
				newPlaces = []; //not sure how much javascript clean up is needed
				results = [];
		
			}
		}
		
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
						
						// Some additional properties of the markers so we can access them later
						markerId : place.place_id,
						hasMeal: true,
					});
				}
				else {
					// THIS IS THE DOT MARKER, ie no meals here
					var marker =  new MarkerWithLabel({
						icon: 'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0',  //Red dot
						map: $scope.map,
						position: place.geometry.location,
						draggable: false,    //property that allows user to move marker
						raiseOnDrag: false,
						//labelContent:randomIntFromInterval(1,15), 
						labelAnchor: new google.maps.Point(7, 33),    // anchors to
						labelClass: 'labels', // the CSS class for the label
						
						// Some additional properties of the markers so we can access them later
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
		
		// Returns random numbers
		randomIntFromInterval = function(min,max) {
		    return Math.floor(Math.random()*(max-min+1)+min);
		}
	
		// Removes the markers from the map,
		function clearMarkers(){
			for (var i = 0; i < $scope.willBeDeletedMarkers.length; i++ ) {
				$scope.willBeDeletedMarkers[i].setMap(null);
			}
			
			$scope.willBeDeletedMarkers = [];
			
		}
		
		// In the event that the browser cannot or user chooses not to support geolocation, this is how that's handled
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

// This is an instance of the modal controller, which pops up when a marker is clicked on the map
// It can theoretically go into another file, but since it's heavily attached to the main controller, I think it makes sense to keep it here
app.controller('ModalInstanceCtrl', function($scope, $modalInstance, mealService, userService, placeInfo, marker) {
	$scope.placeInfo = placeInfo;
	$scope.placeName = placeInfo.name;
	if (marker.hasMeal) {
		$scope.hasMeal = "Join!";
	}
	else {
		$scope.hasMeal = "Create a Meal";
	}
	$scope.users = [];				// the list of users who have committed to this meal
	
	mealService.getPeopleFromMeal($scope.placeInfo.place_id).success(function(data) {
		for (var i = 0; i < data.length; i++) {
			var user = data[i];
			userService.getUserWithID(user.key).success(function(data) {
				$scope.users.push(data[0]);
			});
		}
	})
	
	// Handles when the 'Join!' or 'Create a Meal' button has been clicked. Should maybe be separate methods later.
	$scope.join = function() {
		if (sessionStorage.key == null) {
			return; 
		}
		if ($scope.hasMeal == 'Joined!') {
			return;
		}
		var key = angular.fromJson(localStorage.user).key;
		if (marker.hasMeal) {
			mealService.addUserToMeal($scope.placeInfo.place_id, key).success(function(data) {
				marker.labelContent = marker.labelContent+1; 
				marker.label.setContent();
				$scope.hasMeal = 'Joined!';

				userService.getUserWithID(key).success(function(data) {
					$scope.users.push(data[0]);
				});
			})
		}
		else {
			mealService.addNewMeal($scope.placeInfo.place_id, 0, new Date(), [], true).success(function(data) {
				mealService.addUserToMeal($scope.placeInfo.place_id, key).success(function(data) {
					marker.setIcon('../../img/restaurant.png');
					marker.hasMeal = true; 
					marker.labelContent = 1; 
					marker.label.setContent();
					$scope.hasMeal = 'Joined!';	

					userService.getUserWithID(key).success(function(data) {
						$scope.users.push(data[0]);
					});
				})
			});
		}
	}

	// When the 'Ok' button has been clicked
	$scope.ok = function () {
		$modalInstance.close();
	};
});
