app.controller('loginController', ['$scope', '$location', '$http', 'userService',
	function ($scope, $location, $http, userService) {
		$scope.startEating = true;

		// initForm populates local variables from local JSON files.  This speparates 
		// a lot of data from html and Angular into appropriate JSON files.  The
		// following "gets" allow angular to access these local JSON files
		$scope.initForm = function() {
			$http.get('/json/occupations.json').success( function(data) {
				$scope.occupations = data.occupations;
			});
			$http.get('/json/dateRanges.json').success( function(data) {
				$scope.dateRanges = data.dateRanges;
			});
			$http.get('/json/meFactors.json').success( function(data) {
				$scope.meFactorAdjs = data.meFactorAdjs;
				$scope.meFactorVerbs = data.meFactorVerbs;
				$scope.meFactorNouns = data.meFactorNouns;
			});
		};

		// Generates a random integer between 1 and n
		$scope.getRandomSpan = function(n){
			return Math.floor((Math.random()*n)+1);
		}

		// This function submits the user data to the database, and redirects the user
		$scope.submitUserData = function() {
			var name = null;
			var facebookKey = null;
			var googleKey = null;
			if (sessionStorage.name) {
				name = sessionStorage.name;
				if (sessionStorage.facebookID) {
					facebookKey = sessionStorage.facebookID;
					googleKey = null;
				}
				if (sessionStorage.googleID) {
					googleKey = sessionStorage.googleID;
				}

			}
			var bdate = new Date(Number($scope.year), getMonthFromString($scope.month), Number($scope.day), 0, 0, 0, 0);
			var description = getDescriptionFromStrings($scope.description1, $scope.description2, $scope.description3);

			userService.addNewUser(name, facebookKey, googleKey, bdate, description, $scope.occupation);

			$location.path('main').replace();
		}

		getDescriptionFromStrings = function(stringOne, stringTwo, stringThree) {
			return stringOne.replace(/\s+/g, '') + " " + stringTwo.replace(/\s+/g, '') + " " + stringThree.replace(/\s+/g, '');
		}

		getMonthFromString = function(month) {
			return new Date(Date.parse(month +" 1, 2012")).getMonth()
		}

		// Switches the divs in the login screen when the user has clicked 'start eating'
		$scope.switchDivs = function() {
			$scope.hideStartEating = !$scope.hideStartEating
			$scope.hideUserInfo = !$scope.hideUserInfo
		}

		$scope.$on('showUserInfo', function(event, args) {
			$scope.hideStartEating = !$scope.hideStartEating
			$scope.hideUserInfo = !$scope.hideUserInfo
		});

		// This redirects back to main if the user tries to navigate here and they are already logged in
		$scope.init = function() {
			if (userService.isUserLoggedIn()) {
				$location.path('main').replace();
			}
		}
		$scope.init();

		/* Facebook Integration Stuff */
		// This is called with the results from from FB.getLoginStatus().
		statusChangeCallback = function(response) {
			//console.log('statusChangeCallback');
			//console.log(response);
			// The response object is returned with a status field that lets the
			// app know the current login status of the person.
			// Full docs on the response object can be found in the documentation
			// for FB.getLoginStatus().
			if (response.status === 'connected') {
				FB.api('/me', {fields: 'name'}, function(response) {
					console.log(response.id);
					console.log(response.name);
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
		$scope.checkLoginState = function() {
			console.log('CHECKING');
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
					console.log(resp.result.id);
					console.log(resp.result.displayName);
				}, 
				function(reason) {
					console.log('Error: ' + reason.result.error.message);
				});
			});
		}


		signinCallback = function(authResult) {
			if (authResult['status']['signed_in']) {
				// Update the app to reflect a signed in user
				getUserInfo();

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
