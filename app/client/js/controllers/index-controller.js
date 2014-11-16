app.controller('indexController', ['$scope', '$location', 'userService',
	function ($scope, $location, userService) {
		/* GLOBAL DATA START */
		$scope.startEating = true;

		$scope.mealBuddyRequests = [];
		$scope.mealBuddies = [];
		$scope.mealBuddySuggestions = [];

		$scope.loginButtonVisible;
		$scope.logoutButtonVisible;
		$scope.linksButtonVisible;

		$scope.sidebarVisible = false;
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
				$scope.introVisible = true;
				$scope.sidebarVisible = true;
			}
			else { // (show == false)
				$scope.sidebarVisible = false;
				$scope.linksVisible = false;
				$scope.mealsVisible = false;
				$scope.introVisible = false;
			}
		}

		$scope.setSidebarContent = function(content) {
			if (content == "links") {
				if ($scope.linksVisible == true) {
					$scope.sidebarVisible = false;
					$scope.linksVisible = false;
				}
				else {
					$scope.populateMealBuddies();
					$scope.mealsVisible = false;
					$scope.introVisible = false;
					$scope.linksVisible = true;
					$scope.sidebarVisible = true;
				}
			}
			else if (content == "intro") {
				if ($scope.introVisible == true) {
					$scope.sidebarVisible = false;
					$scope.linksVisible = false;
					$scope.mealsVisible = false;
					$scope.introVisible = false;
					
				}
				else
				{
					$scope.linksVisible = false;
					$scope.mealsVisible = false;
					$scope.introVisible = true;
					$scope.sidebarVisible = true;
				}
			}
			else  // (content == "meals")
			{
				$scope.linksVisible = false;
				$scope.introVisible = false;
				$scope.mealsVisible = true;
				$scope.sidebarVisible = true;
			}
		}

		$scope.toggleLinksButton = function(show) {
			$scope.linksButtonVisible = show;
		}

		$scope.toggleLoginButton = function(show) {
			$scope.loginButtonVisible = show;
		}

		$scope.toggleLogoutButton = function(show) {
			$scope.logoutButtonVisible = show;
		}
		/* GLOBAL ACESS FUNCTIONS END */

		// This allows the initial redirect when they come to the
		// page based on whether or not they are logged in
		$scope.init = function() {
			if ($scope.user == null) {
				$location.path('login').replace();
			}
			else {
				$location.path('main').replace();
			}
		}
		$scope.init();

		$scope.declareUser = function(user) {
			$scope.user = angular.toJson(user);
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
			sessionStorage.googleID = null;
			$location.path('login').replace();
			FB.api('/me/permissions', 'delete', function(response) {});
			gapi.auth.signOut();

			$scope.toggleLoginButton(true);
			$scope.toggleLogoutButton(false);
			$scope.startEating = true;
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
				for (mealBuddy of data1.accepted) {
					userService.getUserWithID(mealBuddy.key).success(function(data2) {
						$scope.mealBuddies.push(data2);
					});
				}
				for (mealBuddy of data1.pending) {
					userService.getUserWithID(mealBuddy.key).success(function(data2) {
						$scope.mealBuddyRequests.push(data2);
					});
				}
				for (mealBuddy of data1.suggested) {
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
				FB.api('/me', {fields: 'name'}, function(response) {
					sessionStorage.facebookID = response.id;
					sessionStorage.name  =response.name;

					userService.findByFacebook(response.id).success(function(data) {

						if (data.length > 0) {
							var user = data[0];
							$scope.user = angular.toJson(user);
							$location.path('main').replace();
						} else {
							if ($location.path() == '/login') {
								if ($scope.user == null) {
									$scope.toggleLogoutButton(true);
									$scope.toggleLoginButton(false);
								}
								$scope.startEating = false;
							} else {
								$location.path('login').replace();
								$scope.startEating = false;
								$scope.toggleLogoutButton(true);
								$scope.toggleLoginButton(false);
							}
						}
					});
				});

				// Logged into your app and Facebook.
				// This is where the code goes on successfull login,
				// ie. change the page to the map.
			}
			else if (response.status === 'not_authorized') {
				// The person is logged into Facebook, but not your app.
			}
			else {
				// The person is not logged into Facebook, so we're not sure if
				// they are logged into this app or not.
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


		/* Google Integration Stuff */
		(function() {
			var po = document.createElement('script');
			po.type = 'text/javascript';
			po.async = true;
			po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(po, s);
		})();

		/* Executed when the APIs finish loading */
		render = function() {
			// Additional params
			var additionalParams = {
				'theme' : 'dark'
			};
			gapi.signin.render('googleLogin', additionalParams);
		}

		getUserInfo = function() {
			// Step 4: Load the Google+ API
			gapi.client.load('plus', 'v1').then(function() {
				// Step 5: Assemble the API request
				var request = gapi.client.plus.people.get({
					'userId': 'me'
				});
				// Step 6: Execute the API request
				request.then(function(resp) {
					sessionStorage.googleID = resp.result.id;
					sessionStorage.name = resp.result.displayName;

					userService.findByGoogle(resp.result.id).success(function(data) {
						if (data.length) {
							var user = data[0];
							$scope.user = angular.toJson(user);
							$location.path('main').replace();
						} else {
							if ($location.path() == '/login') {
								if ($scope.user == null) {
									$scope.toggleLogoutButton(true);
									$scope.toggleLoginButton(false);
								}
								$scope.startEating = false;
							} else {
								$location.path('login').replace();
								$scope.startEating = false;
								$scope.toggleLogoutButton(true);
								$scope.toggleLoginButton(false);
							}
						}
					});
				},
				function(reason) {
					console.log('Error: ' + reason.result.error.message);
				});
			});
		}


		signinCallback = function(authResult) {
			if (authResult['status']['signed_in']) {
				// Update the app to reflect a signed in user
				if(authResult['status']['method'] == 'PROMPT'){
					getUserInfo();
				}
		    }
		    else {
		    	// Update the app to reflect a signed out user
		    	// Possible error values:
		    	//   "user_signed_out" - User is signed-out
		    	//   "access_denied" - User denied access to your app
		    	//   "immediate_failed" - Could not automatically log in the user
		    	// console.log('Sign-in state: ' + authResult['error']);
		    }
		}
}]);
