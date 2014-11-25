angular.module('linksupp').controller('loginController', ['$scope', '$location', '$http', 'userService',
	function ($scope, $location, $http, userService) {
		// Set the navbar to display the proper elements
		$scope.toggleUtilityButtons(false);
		$scope.toggleLogoutButton(false);
		$scope.toggleLoginButton(true);

		$scope.tryApp = function() {
			$location.path('main').replace();
		}

		// Generates a random integer between 1 and n
		$scope.getRandomSpan = function(n){
			return Math.floor((Math.random()*n)+1);
		}

		getDescriptionFromStrings = function(stringOne, stringTwo, stringThree) {
			if (!stringOne || !stringTwo || !stringThree) {
				return 'badUserForm';
			}
			return stringOne.replace(/\s+/g, '') + " " + stringTwo.replace(/\s+/g, '') + " " + stringThree.replace(/\s+/g, '');
		}

		getMonthFromString = function(month) {
			return new Date(Date.parse(month +" 1, 2012")).getMonth()
		}

		// This redirects back to main if the user tries to navigate here and they are already logged in
		$scope.initLogin = function() {
			if ($scope.user != null) {
				$location.path('main').replace();
			}
		}
		$scope.initLogin();
}]);
