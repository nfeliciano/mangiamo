app.controller('mainController', ['$scope', '$resource', '$location', '$modal', '$http', 'mealService', 'userService',
	function ($scope, $resource, $location, $modal, $http, mealService, userService) {
		$scope.placedMarkers = [];
		$scope.willBeDeletedMarkers = [];
		$scope.lastPosition = new google.maps.LatLng();
		$scope.dataBase = [];
		$scope.usersMealBuddies = [];
		$scope.selectedMarker = null;
		$scope.selectedMarkerOldIcon= null;
		var minZoomLevel = 13; // as far back as they can go
		var mapOptions = {
			zoom: 14,
			streetViewControl: false		
		}
		$scope.showSuppBuddiesButton();

		$scope.showMealInfo = false;  // ng-show variable
		$scope.showJoinMealButton = false;
		$scope.mealTimeHours = [];
		$scope.mealTimeMinutes = [];
		$scope.mealAttendees = [];// the list of users who have committed to this meal
		$scope.mealPlace = "";
		$scope.mealMarker = "";
		$scope.meals = [];
		$scope.currentMealKey = "";
		

		$scope.addFriend = function(newMealBuddy) {
			$scope.newMealBuddy = "";
			userService.addMealBuddy(newMealBuddy);
		}

		$scope.initMealForm = function() {
			$http.get('/json/mealTime.json').success( function(data) {
				$scope.mealTimeHours = data.mealTimeHours;
				$scope.mealTimeMinutes = data.mealTimeMinutes;
			});
		}

		$scope.joinMeal = function() {
			if ($scope.mealMarker.hasMeal) {
				var key = angular.fromJson(localStorage.user).key;
				mealService.addUserToMeal($scope.currentMealKey, key).success(function(data) {
					$scope.mealMarker.labelContent = $scope.mealMarker.labelContent+1; 
					$scope.mealMarker.label.setContent();

					userService.getUserWithID(key).success(function(data) {
						$scope.mealAttendees.push(data[0]);
					});
				})
			}
		}

		$scope.submitMealData = function() {
			var currentTime = new Date();
			var date = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), $scope.mealTimeHour, $scope.mealTimeMinute, 0, 0);

			mealService.addNewMeal($scope.mealPlace.place_id, 0, date, [], true).success(function(data) {
				var key = angular.fromJson(localStorage.user).key;
				mealService.addUserToMeal(data.key, key).success(function(data2) {
					$scope.mealMarker.setIcon('../../img/restaurant.png');
					$scope.mealMarker.hasMeal = true; 
					$scope.mealMarker.labelContent = 1; 
					$scope.mealMarker.label.setContent();
					$scope.meals.push(data2);
					
					userService.getUserWithID(key).success(function(data3) {
						$scope.mealAttendees.push(data3[0]);
					});
				})
			});
		}

		/* 
		 * meal - boolean: true - user clicked on a meal marker
		 *				   false - user clicked on a regular marker
		 * 
		 */
		$scope.updateMealInfo = function(place, marker, meal) {
			$scope.mealPlace = place;
			$scope.mealMarker = marker;
			$scope.initMeal();
			$scope.showMealInfo = true;
			$scope.showJoinMealButton = false;
			$scope.mealAttendees = [];
		}

		$scope.showAttendees = function(meal) {
			$scope.showJoinMealButton = true;
			$scope.currentMealKey = meal.key;
			$scope.mealAttendees = [];
			mealService.getPeopleFromMeal(meal.key).success(function(data) {
				for (var i = 0; i < data.length; i++) {
					userService.getUserWithID(data[i].key).success(function(data2) {
						$scope.mealAttendees.push(data2[0]);
					});
				}
			});
		}
		

		/* removeMealBuddy(mealBuddy, rejecting)
		 * mealBuddy: a key of the buddy
		 */
		$scope.removeMealBuddy = function(mealBuddy) {
			userService.deleteMealBuddy(mealBuddy[0].key);
			$scope.populateMealBuddies();
		}

		$scope.confirmMealBuddy = function(mealBuddyRequest) {
			userService.confirmMealBuddy(mealBuddyRequest[0].key);
			$scope.populateMealBuddies();
		}

		$scope.getKeyFromFacebookID = function(facebookID){
			userService.findByFacebook(facebookID).success(function(data) {
				$scope.addFriend(data[0].key);
			});
		}

		$scope.initMeal = function() {
			$scope.meals = [];
			mealService.getMealsAtPlaceID($scope.mealPlace.place_id).success(function(data) {
				for (var i = 0; i < data.length; i++) {
					$scope.meals.push(data[i]);
				}
			});
		}
	
		//Fills in global array of users friends
		//TODO: Do we need this method?
		$scope.getUsersMealBuddies = function() {
			userService.getMealBuddies().success(function(data){
				console.log(data);
				$scope.usersMealBuddies= data;
			});
		}

		// initializes the google map and populates it with food places
		$scope.initialize = function() {
			$scope.map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
			$scope.getUsersMealBuddies();
			$scope.lastPosition = new google.maps.LatLng(48.4449579, -123.33535710000001);   // This is the default position if Geolocation is enabled it is overwritten to the users location 
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				    $scope.map.setCenter(pos);
				
				}, function() {
				
					handleNoGeolocation(true);
				});
			} else {
				handleNoGeolocation(false); // not compatable with browswer I think
			}
				
			//IF geolocation was succesfull then map center will not be undefined, but if its not then we know they dont have geolocation enabled and mustthen keep the default location
			if( typeof $scope.map.getCenter() != 'undefined'){
				$scope.lastPosition = $scope.map.getCenter();
			}
		
			//Form request for location search
			var request = {
				location: $scope.lastPosition,
				rankby : google.maps.places.RankBy.DISTANCE,
				radius: 3000,
				types: ['restaurant','cafe', 'bar', 'food']
			};
				
		
			var service = new google.maps.places.PlacesService($scope.map);
			service.radarSearch(request, callback);
			
			// refreshes the map with new food places when the map is moved a certain amount
			google.maps.event.addListener($scope.map, 'bounds_changed', function() {
				if(google.maps.geometry.spherical.computeDistanceBetween($scope.lastPosition, $scope.map.getCenter()) > 2000){
					$scope.lastPosition = $scope.map.getCenter();
					request.location=$scope.map.getCenter();
					service.radarSearch(request, fastCallback); 
					//service.radarSearch(request, smoothUpdateCallback);  //smooth update wont work anymore without some special consideration of the aysc ness
				}
			});
		
			initializeSearchBar();
		}
		
		// initializes and adds the search bar on the map
		initializeSearchBar = function() {
			var markers = [];
			// Create the search box and link it to the UI element.
			var input = /** @type {HTMLInputElement} */(
		    	document.getElementById('pac-input'));
			$scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

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
				$scope.map.setZoom(15);
			});

			// Bias the SearchBox results towards places that are within the bounds of the
			// current map's viewport.
			google.maps.event.addListener($scope.map, 'bounds_changed', function() {
		    	var bounds = $scope.map.getBounds();
		    	searchBox.setBounds(bounds);
			});
			
			
		   // Limit the zoom level
			google.maps.event.addListener($scope.map, 'zoom_changed', function() {
				if ($scope.map.getZoom() < minZoomLevel){
					$scope.map.setZoom(minZoomLevel);
				}
			});
		}

		// --- This is fed in the "result" of the search as an array, and for each a marker is placed 
		callback = function(results, status, pagination) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				
				mealService.getAllMeals().success(function(data){
				
					$scope.dataBase =data;
				
					var hasMeal = false;		
					for (var i = 0; i < results.length; i++) { // Removed the checking because this method now only happens on the first load
						hasMeal = false;
						for( var x = 0; x < $scope.dataBase.length; x++){
							if($scope.dataBase[x].placeID == results[i].place_id){
								hasMeal = true;
								break;
							}
						}
						
						if( hasMeal){
							createMealMarker(results[i]);
						}
						else{
							createDotMarker(results[i]);	// for each place in result create marker
						}
						
					}
				});
			}
		}
		
		fastCallback = function(results, status){
			
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				
				mealService.getAllMeals().success(function(data){
					nukeAllMarkers();
					$scope.database =null; //think it might be a possible leak so for now do this
					$scope.dataBase =data;
				
					var hasMeal = false;		
					for (var i = 0; i < results.length; i++) { // Removed the checking because this method now only happens on the first load
						hasMeal = false;
						for( var x = 0; x < $scope.dataBase.length; x++){
							if($scope.dataBase[x].placeID == results[i].place_id){
								hasMeal = true;
								break;
							}
						}
						
						if( hasMeal){
							createMealMarker(results[i]);
						}
						else{
							createDotMarker(results[i]);	// for each place in result create marker
						}
						
					}
				});
			}
		}
		
		
		
		createDotMarker = function(place){
			var marker =  new MarkerWithLabel({
				icon: 'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0',  //Red dot
				map: $scope.map,
				position: place.geometry.location,
				draggable: false,    //property that allows user to move marker
				raiseOnDrag: false,
				labelAnchor: new google.maps.Point(7, 33),    // anchors to
				labelClass: 'labels', // the CSS class for the label
				
				// Some additional properties of the markers so we can access them later
				markerId : place.place_id,
				hasMeal: false,
			});
			
			$scope.placedMarkers.push(marker); // Array marker
			google.maps.event.addListener(marker, 'click', function() {
					updateMarkerIcon(marker);
					var request = {
						placeId:marker.markerId,
					};
					var service = new google.maps.places.PlacesService($scope.map);
					service.getDetails(request,getPlaceDetails);
			
					// Returns ALL the place details and information 
					function getPlaceDetails(place, status) {
						if (status == google.maps.places.PlacesServiceStatus.OK) {
							$scope.updateMealInfo(place, marker, false);
						}
					}
			});
		}
		
		createMealMarker = function(place){
		
			mealService.getMealsAtPlaceID(place.place_id).success(function(data) {
				
				var numPeople = 0;
				var searchingForBuddy = true;
				var buddyWasFound = false;
				
				//see if user has friends
				if(  $scope.usersMealBuddies == 0 ){
					searchingForBuddy = false;	
				}
				
				loop1:
				for (var i = 0; i < data.length; i++) {
					
					numPeople += data[i].numPeople;
					
					if( searchingForBuddy){
						
						loop2:
						for( var y = 0; y < $scope.usersMealBuddies.length; y++){
							
							loop3:
							for(var z = 0; z< data[i].people.length; z++){
						
								if( $scope.usersMealBuddies[y].key == data[i].people[z].key){
									buddyWasFound = true;
									searchingForBuddy = false; 
									break loop2;
								}
							}	
						}
					}	
				}
				
				var icon = '../../img/restaurant.png'; //default meal marker
				
				/*
				if( buddyWasFound && user is going){
				
				}
				else if ( user is going){
				
				}
				
				*/
				
				if( buddyWasFound){
					icon = '../../img/restaur_friend.png'; // friend going marker
				}
						
				// This is the Mangiamo Meal marker, ie there is a meal here
				var marker =  new MarkerWithLabel({
					icon: icon,
					map: $scope.map,
					position:  place.geometry.location,
					draggable: false,    //property that allows user to move marker
					raiseOnDrag: false,
					labelContent:numPeople, 
					labelAnchor: new google.maps.Point(7, 33),    // anchors to
					labelClass: "labels", // the CSS class for the label
					
					// Some additional properties of the markers so we can access them later
					markerId : place.place_id,
					hasMeal: true,
				});
			
			
				$scope.placedMarkers.push(marker); // Array marker
				google.maps.event.addListener(marker, 'click', function() {
					updateMarkerIcon(marker);
					
					var request = {
						placeId:marker.markerId,
					};
					var service = new google.maps.places.PlacesService($scope.map);
					service.getDetails(request,getPlaceDetails);
			
					// Returns ALL the place details and information 
					function getPlaceDetails(place, status) {
						if (status == google.maps.places.PlacesServiceStatus.OK) {
							$scope.updateMealInfo(place, marker, true);
						}
					}
				});
			});
		}
		
	
		//paramater is the new selected marker,
		// function updates old marker to its old image, and update new to new image
		updateMarkerIcon = function(marker) {
		  
			//if the old one exists, return it to normal
			if($scope.selectedMarker != null){
				$scope.selectedMarker.setIcon($scope.selectedMarkerOldIcon);
			}
			
			$scope.selectedMarker = marker; 
			$scope.selectedMarkerOldIcon =marker.icon; // saves the current image so it can be updated next time we enter here
			
			switch(marker.icon){
			
			//Red dot
			case 'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0':
				marker.setIcon( '../../img/restaur_selected.png');
				break;
				
			//Normal Meal
			case '../../img/restaurant.png':
				marker.setIcon('../../img/restaur_selected.png');
				break;
			//Friend going
			case '../../img/restaur_friend.png':
				marker.setIcon('../../img/restaur_selected_friend.png');
				break;
			//CASE IT IS THE ONE YOU ARE GOING TO 
			//CURRENT NO CHANGE
			case '../../img/restaur_going.png':
				marker.setIcon('../../img/restaur_going.png');
				break;
			}
			
			
			
		}
	
		
	
		// Removes the markers from the map,
		function clearMarkers(){
			for (var i = 0; i < $scope.willBeDeletedMarkers.length; i++ ) {
				$scope.willBeDeletedMarkers[i].setMap(null);
			}
			$scope.willBeDeletedMarkers = [];
		}
		
		function nukeAllMarkers(){
			for (var i = 0; i < $scope.placedMarkers.length; i++ ) {
				$scope.placedMarkers[i].setMap(null);
			}
			$scope.placedMarkers = [];
		}
		
		// In the event that the browser cannot or user chooses not to support geolocation, this is how that's handled
		function handleNoGeolocation(errorFlag) {
		
			if (errorFlag) {
				var content = 'EnableGeolocation.';
			} else {
				var content = 'Error: Your browser doesn\'t support geolocation.';
			}

			var options = {
				map: $scope.map,
				position: new google.maps.LatLng(48.4449579, -123.33535710000001),   // This is the position it goes to if the user failed to give permision or, it failed for some other reason
				content: content
			};
			
			var infowindow = new google.maps.InfoWindow(options);
			$scope.map.setCenter(options.position);
		}

		// This redirects back to login if the user tries to navigate here and they are not logged in
		$scope.initMain = function() {
			if (!userService.isUserLoggedIn()) {
				$location.path('login').replace();
			}
		}
		$scope.initMain();

		// Opens a modal when a map pin is clicked.
		$scope.openModal = function (size, placeInfo, marker) {
			var modalInstance = $modal.open({
				templateUrl: '/views/modalContent.html',
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
	$scope.users = [];// the list of users who have committed to this meal
	
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
		// NOT POSSIBLE ANYMORE
		if (angular.fromJson(localStorage.user).key == null) {
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
					marker.icon.setIcon('../../img/restaurant.png');
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
