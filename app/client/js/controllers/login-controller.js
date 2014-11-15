app.controller('loginController', ['$scope', '$location', '$http', 'userService',
	function ($scope, $location, $http, userService) {
		$scope.startEating = function() {
			$location.path('main').replace();
		};

		// Set the navbar to display the proper elements
		$scope.toggleLinksButton(false);
		$scope.toggleLogoutButton(false);
		$scope.toggleLoginButton(true);

		// initForm populates local variables from local JSON files.  This speparates
		// a lot of data from html and Angular into appropriate JSON files.  The
		// following "gets" allow angular to access these local JSON files
		$scope.initLoginForm = function() {
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
			var description = getDescriptionFromStrings($scope.description1, $scope.description2, $scope.description3);

			userService.addNewUser(name, facebookKey, googleKey, $scope.dateRange, description, $scope.occupation, 0).success( function() {
				$location.path('main').replace();
			});
		}

		getDescriptionFromStrings = function(stringOne, stringTwo, stringThree) {
			return stringOne.replace(/\s+/g, '') + " " + stringTwo.replace(/\s+/g, '') + " " + stringThree.replace(/\s+/g, '');
		}

		getMonthFromString = function(month) {
			return new Date(Date.parse(month +" 1, 2012")).getMonth()
		}

		// This redirects back to main if the user tries to navigate here and they are already logged in
		$scope.initLogin = function() {
			if (userService.isUserLoggedIn()) {
				$location.path('main').replace();
			}
		}
		$scope.initLogin();
}]);
