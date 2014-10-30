app.controller('loginController', ['$scope', '$location', 'userService',
	function ($scope, $location, userService) {
		$scope.hideStartEating = false;
		$scope.hideUserInfo = true;

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
}]);
