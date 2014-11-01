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

		$scope.$on('showUserInfo', function(event, args) {
			$scope.startEating = false;
		});

		// This redirects back to main if the user tries to navigate here and they are already logged in
		$scope.init = function() {
			if (userService.isUserLoggedIn()) {
				$location.path('main').replace();
			}
		}
		$scope.init();
}]);
