app.controller('mainController', ['$scope', '$resource', '$location', '$modal', '$http', 'mealService', 'userService',
	function ($scope, $resource, $location, $modal, $http, mealService, userService) {
		/* GLOBAL DATA (In main-controller.js) START */
		$scope.placedMarkers = [];
		$scope.willBeDeletedMarkers = [];
		$scope.lastPosition = new google.maps.LatLng();
		$scope.dataBase = [];
		$scope.usersMealBuddies = [];
		$scope.selectedMarkerOldIcon = null;
		$scope.usersMealsAttending = [];
		var minZoomLevel = 13; // as far back as they can go
		$scope.currentPin = { "name": "",
							  "place": null,
							  "marker": null,
							  "rating": "",
							  "meals": [ /*{ "time": "",
							  			     "key": "",
							  			     "attendees": [] }*/
							  		   ]
							};

		$scope.mealTime = new Date();
		/* GLOBAL DATA (In main-controller.js) END */

		/* MAIN.HTML REFRESH CODE START (called on page refresh) */
		// Set the navbar to display the proper elements
		$scope.toggleLinksButton(true);
		$scope.toggleLogoutButton(true);
		$scope.toggleLoginButton(false);

		// Hide the sidebar on page load, then load the "intro" sidebar content
		$scope.toggleSidebar(false);
		$scope.setSidebarContent('intro');

		/* MAIN.HTML REFRESH CODE END */



		var mapOptions = {
			zoomControlOptions: {
        		style: google.maps.ZoomControlStyle.LARGE,
        		position: google.maps.ControlPosition.RIGHT_CENTER},
        	panControlOptions: {
        		position: google.maps.ControlPosition.RIGHT_CENTER},
        	zoom: 14,
			streetViewControl: false
        }

		// Adds a Friend
		$scope.addFriend = function(newMealBuddy) {
			$scope.newMealBuddy = "";
			userService.getMealBuddies().success(function(mealBuddies) {
				userService.addMealBuddy(newMealBuddy, mealBuddies).success(function() {
					$scope.populateMealBuddies();
				});
			});
		}

		$scope.updateMealInfo = function(place, marker) {
			$scope.currentPin.name = place.name;
			$scope.currentPin.place = place;
			$scope.currentPin.marker = marker;
			$scope.currentPin.meals = [];

			//Force minutes to start at 00
			var d = new Date();
			d.setMinutes(0);
			d.setHours(d.getHours() + 1);
			$scope.mealTime = d;

			// Populate $scope.currentPin.meals
			mealService.getMealsAtPlaceID(place.place_id).success(function(data) {
				var mealData = angular.fromJson(data);
				$scope.currentPin.meals = [];  // Reset data
				for (var i = 0; i < mealData.length; i++) {
					$scope.currentPin.meals.push({"time": "", "key": "", "attendees": []});

					/* DATE CALCULATION START */
					// Date(year, month, day, hours, minutes)
					var mealDate = new Date(mealData[i].time.substring(0, 4),
											(parseInt(mealData[i].time.substring(5, 7)) - 1),
											mealData[i].time.substring(8, 10),
											mealData[i].time.substring(11, 13),
											mealData[i].time.substring(14, 16));
					var hourOffset = Math.floor(480 / 60);
					var minuteOffset = (480 % 60);
					var hour = (((mealDate.getHours() - hourOffset) + 24) % 24);
					var minute = (((mealDate.getMinutes() - minuteOffset) + 60) % 60);
					minute = minute.toString();

					// Convert "0" into "00"
					if (minute.length == 1) {
						minute = "0" + minute;
					}

					// Set AM or PM
					var meridiem = "am";
					if (hour >= 12) {
						meridiem = "pm";
					}

					// Set 24 hour to 12 hour
					hour = (hour % 12);
					if (hour == 0) {
						hour = 12;
					}

					hour = hour.toString();
					/* DATE CALCULATION END */
					$scope.currentPin.meals[i].time = hour + ":" + minute + " " + meridiem;
					$scope.currentPin.meals[i].key = mealData[i].key;
					$scope.populateAttendees(mealData, i);
				}
			});
			$scope.setSidebarContent('meals');
		}

		$scope.populateAttendees = function(mealData, i) {
			for (var j = 0; j < mealData[i].people.length; j++) {
				userService.getUserWithID(mealData[i].people[j].key).success(function(attendee) {
					$scope.currentPin.meals[i].attendees.push(attendee[0]);
				});
			}
		}

		$scope.getUsersMealsAttending = function(){
			userService.getUserWithID(angular.fromJson(localStorage.user).key).success(function(data) {
				$scope.usersMealsAttending = data[0].mealsAttending;
			});
		}

		//Just a place holder function for whatever method of testing weither a person is allowed to join,
		//for now just updates their current meals, and sees if its greater than 1 then they can join
		$scope.isUserAllowedToJoinMeal = function(){
			// OVERRIDE
			return true;
			//update current user meals, just as a precaution
			userService.getUserWithID(angular.fromJson(localStorage.user).key).success(function(data) {
				$scope.usersMealsAttending = data[0].mealsAttending;

				//hard code limit 1
				if($scope.usersMealsAttending.length > 0){
					return false; // user cannot join
				}
				return true;  //user can join

			});
		}

		$scope.joinMeal = function(meal) {
			//Test if user can join meal
			if(!$scope.isUserAllowedToJoinMeal())
			{
				$scope.tellUser("You are already in a meal.  Please leave your other meal to join a new one.");
				return;
			}
			if ($scope.currentPin.marker.hasMeal) {
				var key = angular.fromJson(localStorage.user).key;
				mealService.addUserToMeal(meal.key, key).success(function(data) {
					$scope.currentPin.marker.setIcon('../../img/restaur_going.png');
					$scope.selectedMarkerOldIcon = '../../img/restaur_going.png';
					$scope.currentPin.marker.labelContent = parseInt($scope.currentPin.marker.labelContent) + 1;
					$scope.currentPin.marker.label.setContent();
					userService.addMealToUser(meal.key);
					userService.getUserWithID(key).success(function(data) {
						meal.attendees.push(data[0]);
					});
				})
			}
		}

		$scope.createMeal = function(mealTime) {

			//test if user can join
			if(!$scope.isUserAllowedToJoinMeal()){
				return;
			}

			var currentTime = new Date();
			var date = new Date(currentTime.getFullYear(),
								currentTime.getMonth(),
								currentTime.getDate(),
								mealTime.getHours(),
								mealTime.getMinutes(), 0, 0);
			console.log(date);
			console.log(currentTime);
			if (currentTime > date) {
				$scope.tellUser("You've tried to create a meal at a time that has already passed. You can only create meals for this day - if you're trying to create a meal for tomorrow, please try again after midnight.",
				"We have to stop living in the past!");
				return;
			}

			mealService.addNewMeal($scope.currentPin.place.place_id, 0, date, [], true).success(function(data) {
				var key = angular.fromJson(localStorage.user).key;

				mealService.addUserToMeal(data.key, key).success(function(meal) {
					$scope.currentPin.marker.setIcon('../../img/restaur_going.png');
					$scope.selectedMarkerOldIcon = '../../img/restaur_going.png';
					$scope.currentPin.marker.hasMeal = true;
					if ($scope.currentPin.marker.labelContent == "") {
						$scope.currentPin.marker.labelContent = 1;
					}
					else {
						$scope.currentPin.marker.labelContent = (parseInt($scope.currentPin.marker.labelContent) + 1 );
					}
					$scope.currentPin.marker.label.setContent();
					userService.addMealToUser(meal.key);
					$scope.updateMealInfo($scope.currentPin.place, $scope.currentPin.marker);
				})
			});
		}

		/* removeMealBuddy(mealBuddy, rejecting)
		 * mealBuddy: a key of the buddy
		 */
		$scope.removeMealBuddy = function(mealBuddy) {
			userService.deleteMealBuddy(mealBuddy[0].key).success(function(data) {
				$scope.populateMealBuddies();
			});
		}

		$scope.confirmMealBuddy = function(mealBuddyRequest) {
			userService.confirmMealBuddy(mealBuddyRequest[0].key).success(function(data) {
				$scope.populateMealBuddies();
			});
		}

		$scope.addFriendFromFacebookID = function(facebookID){
			userService.findByFacebook(facebookID).success(function(data) {
				$scope.addFriend(data[0].key);
			});
		}

		//Fills in global array of users friends
		//TODO: Do we need this method?
		$scope.getUsersMealBuddies = function() {
			userService.getMealBuddies().success(function(data){
				$scope.usersMealBuddies = data.accepted;
			});
		}

		$scope.loadSuggestions = function() {
			$scope.findingFriends = true;
			FB.api(
				"/me/friends",
				function (response) {
					if (response && !response.error) {
						/* handle the result */
						userService.getMealBuddies().success(function(mealBuddies) {
							for (var i = 0; i < response.data.length; i++) {
								var fbFriend = response.data[i];
								userService.findByFacebook(fbFriend.id).success(function(data) {
									userService.suggestMealBuddy(data[0].key, mealBuddies);
								});
							}
						});
  					}
				}
			);
			setTimeout(function() {
				$scope.populateMealBuddies();
				$scope.findingFriends = false;
			}, 1000);
		}

		// initializes the google map and populates it with food places
		$scope.initialize = function() {
			$scope.map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
			$scope.getUsersMealBuddies();
			$scope.getUsersMealsAttending();
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
				if(google.maps.geometry.spherical.computeDistanceBetween($scope.lastPosition, $scope.map.getCenter()) > 1500){
					$scope.getUsersMealBuddies();
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

			$scope.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

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
					$scope.dataBase = null;
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
				labelContent: 0,
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
						$scope.updateMealInfo(place, marker);
					}
				}
			});
		}

		createMealMarker = function(place){

			var userIsGoing = false;

			for( var i = 0; i < $scope.usersMealsAttending.length; i++){
				if($scope.usersMealsAttending[i].key.substring(0,place.place_id.length) == place.place_id){
					userIsGoing = true;
				}
			}

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

					if(searchingForBuddy){

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

				/*if( buddyWasFound && userIsGoing){
					icon = user is going and buddy
				} else*/
				if( userIsGoing){
					icon = '../../img/restaur_going.png';
				}
				else if( buddyWasFound){
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
							$scope.updateMealInfo(place, marker);
						}
					}
				});
			});
		}

		//paramater is the new selected marker,
		// function updates old marker to its old image, and update new to new image
		updateMarkerIcon = function(marker) {

			//if the old one exists, return it to normal
			if($scope.currentPin.marker != null){
				$scope.currentPin.marker.setIcon($scope.selectedMarkerOldIcon);
			}

			$scope.currentPin.marker = marker;
			$scope.selectedMarkerOldIcon = marker.icon; // saves the current image so it can be updated next time we enter here

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
				google.maps.event.clearListeners($scope.placedMarkers[i]);
				$scope.placedMarkers[i].setMap(null);
				delete $scope.placedMarkers[i];
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
		function unloadScript(){
			console.log("unload");
			google.maps.event.clearInstanceListeners(window);
			google.maps.event.clearInstanceListeners(document);
			//google.maps.event.clearInstanceListeners(mapDiv);
		}

		$(window).bind('beforeunload', function(e) {

			if (1)
			{
				console.log("unload");
				nukeAllMarkers();
				$scope.map.setMap(null);
				$scope.map = null;
				google.maps.event.clearInstanceListeners(window);
				google.maps.event.clearInstanceListeners(document);

				$scope.placedMarkers = null;
				$scope.willBeDeletedMarkers = null;
				$scope.lastPosition = null;
				$scope.dataBase = null;
				$scope.usersMealBuddies = null;
				$scope.selectedMarkerOldIcon = null;
				$scope.usersMealsAttending = null;

			}
		});
}]);
