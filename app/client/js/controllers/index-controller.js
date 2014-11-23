angular.module('linksupp').controller('indexController', ['$scope', '$location', 'userService', '$rootScope',
	function ($scope, $location, userService, $rootScope) {
		/* GLOBAL DATA START */

		$scope.mealBuddyRequests = [];
		$scope.mealBuddies = [];
		$scope.mealBuddySuggestions = [];

		$scope.utilityButtonsVisible;
		$scope.loginButtonVisible;
		$scope.logoutButtonVisible;

		$scope.sidebarVisible = false;
		$scope.recomVisible = true;
		$scope.linksVisible = false;
		$scope.mealsVisible = false;
		$scope.introVisible = false;

		$scope.tellUserTitle = "";
		$scope.tellUserMessage = "";

		$scope.user = null;
		/* GLOBAL DATA END */

		// REMOVE THIS
		$scope.UID = '';

		/* GLOBAL ACCESS FUNCTIONS START */
		$scope.toggleSidebar = function(show) {
			if (show == true) {
				$scope.linksVisible = false;
				$scope.mealsVisible = false;
				$scope.introVisible = false;
				$scope.recomVisible = true;
				$scope.sidebarVisible = true;
			}
			else { // (show == false)
				$scope.sidebarVisible = false;
				$scope.recomVisible = false;
				$scope.linksVisible = false;
				$scope.mealsVisible = false;
				$scope.introVisible = false;
			}
		}

		// if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

		// }

		$scope.setSidebarContent = function(content) {
			if (content == "links" && $scope.linksVisible == false) {
				$scope.populateMealBuddies();
				$scope.mealsVisible = false;
				$scope.introVisible = false;
				$scope.recomVisible = false;
				$scope.linksVisible = true;
				$scope.sidebarVisible = true;
			}
			else if (content == "intro" && $scope.introVisible == false) {
				$scope.linksVisible = false;
				$scope.mealsVisible = false;
				$scope.recomVisible = false;
				$scope.introVisible = true;
				$scope.sidebarVisible = true;
			}
			else if (content == "meals") {
				$scope.linksVisible = false;
				$scope.introVisible = false;
				$scope.recomVisible = false;
				$scope.mealsVisible = true;
				$scope.sidebarVisible = true;
			}
			else {  // (content == "recom")
				$scope.linksVisible = false;
				$scope.mealsVisible = false;
				$scope.introVisible = false;
				$scope.recomVisible = true;
				$scope.sidebarVisible = true;
			}
		}

		$scope.toggleUtilityButtons = function(show) {
			$scope.utilityButtonsVisible = show;
		}

		$scope.toggleLoginButton = function(show) {
			$scope.loginButtonVisible = show;
		}

		$scope.toggleLogoutButton = function(show) {
			$scope.logoutButtonVisible = show;
		}

		// This allows the initial redirect when they come to the
		// page based on whether or not they are logged in
		$scope.init = function() {
			setTimeout(function() {
				if ($location.path() == '/login' || $location.path() == '/main') {
					return;
				}
				$rootScope.$apply(function() {
					$location.path('login').replace();
				});
			}, 2500);
		}
		$scope.init();

		/* GLOBAL ACESS FUNCTIONS END */

		$scope.declareUser = function(userData) {
			$scope.user = angular.toJson(userData);
		}

		// Pass this function the title and message to be displayed to the user as an error message
		$scope.tellUser = function(message, title) {
			$scope.tellUserTitle = typeof(title) !== 'undefined' ? title : "Oops! We've Encountered a Problem.";
			$scope.tellUserMessage = message;
			$('#errorModal').modal();
		}

		$scope.contact = function() {
			$scope.contactMessage = "";
			$scope.contactEmail = "";
			$('#contactModal').modal();
		}

		$scope.sendMessage = function() {
			$('#contactModal').modal('hide');
			if ($scope.contactMessage == null) {
				$scope.tellUser('Sorry! You need to actually enter some text!', 'We need more information');
				return;
			}
			if ($scope.contactMessage.length > 5) {
				userService.contactDevs($scope.contactMessage, $scope.contactEmail);
				$scope.contactMessage = "";
				$scope.contactEmail = "";
			} else {
				$scope.tellUser('Sorry! We\'d like to hear more than a couple of letters!', 'We need more information');
			}
		}

		$scope.logout = function() {
			$scope.user = null;
			sessionStorage.name = null;
			sessionStorage.facebookID = null;
			$location.path('login').replace();
			FB.api('/me/permissions', 'delete', function(response) {});

			// Clear all local data
			$scope.mealBuddyRequests = [];
			$scope.mealBuddies = [];
			$scope.mealBuddySuggestions = [];
		}

		// Populate MealBuddies, and MealBuddyRequests to be displayed in the Meal Buddies SideBar
		$scope.populateMealBuddies = function() {
			if ($scope.user == null) {
				return;
			}
			$scope.UID = angular.fromJson($scope.user).key;
			// Grab the users MealBuddies from the database
			userService.getMealBuddies($scope.UID).success( function(data1) {
				$scope.mealBuddyRequests = [];
				$scope.mealBuddies = [];
				$scope.mealBuddySuggestions = [];
				
		
				for (var i = 0; i < data1.accepted.length; i++) {
					var mealBuddy = data1.accepted[i];
					userService.getUserWithID(mealBuddy.key).success(function(data2) {			
						$scope.mealBuddies.push(data2);
					});
				}
				for (var i = 0; i < data1.pending.length; i++) {
					var mealBuddy = data1.pending[i];
					userService.getUserWithID(mealBuddy.key).success(function(data2) {
						$scope.mealBuddyRequests.push(data2);
					});
				}
				for (var i = 0; i < data1.suggested.length; i++) {
					var mealBuddy = data1.suggested[i];
					userService.getUserWithID(mealBuddy.key).success(function(data2) {
						$scope.mealBuddySuggestions.push(data2);
					});
				}
			});
		}

		/* Facebook Integration Stuff */
		// This is called with the results from from FB.getLoginStatus().
		statusChangeCallback = function(response) {
			// The response object is returned with a status field that lets the
			// app know the current login status of the person.
			// Full docs on the response object can be found in the documentation
			// for FB.getLoginStatus().
			if (response.status === 'connected') {
				FB.api('/me', {}, function(response) {
					sessionStorage.facebookID = response.id;
					sessionStorage.name  = response.name;
					sessionStorage.email = response.email;

					userService.findByFacebook(response.id).success(function(data) {
						if (data.length > 0) {  // Returning user who has already logged in with facebook
							var userData = data[0];
							$scope.user = angular.toJson(userData);
							$location.path('main').replace();
						}
						else {  // User is logging in to facebook for the first time
							// MODAL CALL
							$('#userInformationModal').modal();
						}
						if ($location.path() == '/login') {
							$location.path('main').replace();
						}
						$scope.toggleLogoutButton(true);
						$scope.toggleLoginButton(false);
						$scope.populateMealBuddies();
					});
				});

				// Logged into your app and Facebook.
				// This is where the code goes on successfull login,
				// ie. change the page to the map.
			}
			else if (response.status === 'not_authorized') {
				// The person is logged into Facebook, but not your app
				$rootScope.$apply(function() {
					$location.path('login').replace();
				});
			}
			else {
				// The person is not logged into Facebook, so we're not sure if
				// they are logged into this app or not.
				$rootScope.$apply(function() {
					$location.path('login').replace();
				});
			}
		}

		// This function is called when someone finishes with the Login
		// Button.  See the onlogin handler attached to it in the code below.
		checkLoginState = function() {
			FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
			});
		}

		window.fbAsyncInit = function() {
			FB.init({
				appId      : '283325225209622',
				cookie     : true,  // enable cookies to allow the server to access the session
				xfbml      : true,  // parse social plugins on this page
				version    : 'v2.1' // use version 2.1
			});

			// Now that we've initialized the JavaScript SDK, we call
			// FB.getLoginStatus().  This function gets the state of the
			// person visiting this page and can return one of three states to
			// the callback.  They can be:
			//
			// 1. Logged into your app ('connected')
			// 2. Logged into Facebook, but not your app ('not_authorized')
			// 3. Not logged into Facebook and can't tell if they are logged into
			//    your app or not.
			//
			// These three cases are handled in the callback function.

			FB.getLoginStatus(function(response) {
				statusChangeCallback(response);
			});
		};

		// Load the SDK asynchronously
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
}]);
