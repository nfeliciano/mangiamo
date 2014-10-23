app.controller('loginController', ['$scope', '$location', 'userService',
	function ($scope, $location, userService) {
		$scope.hideStartEating = false;
		$scope.hideUserInfo = true;

		// This function submits the user data to the database, and redirects the user
		$scope.submitUserData = function() {
			var bdate = new Date(Number($scope.year), getMonthFromString($scope.month), Number($scope.day), 0, 0, 0, 0);
			var description = getDescriptionFromStrings($scope.description1, $scope.description2, $scope.description3);
			userService.addNewUser(null, bdate, description, $scope.occupation);
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
			console.log('statusChangeCallback');
			console.log(response);
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
}]);