app.controller('indexController', ['$scope', '$location', 'userService',
	function ($scope, $location, userService) {

		$scope.mapClass = 'col-sm-12';
		$scope.hideMealBuddies = true;

		// This allows the initial redirect when they come to the 
		// page based on whether or not they are logged in
		$scope.init = function() {
			if (userService.isUserLoggedIn()) {
				$location.path('main').replace();
			}
			else {
				$location.path('login').replace();
			}
		}
		$scope.init();

		$scope.logout = function() {
			userService.logoutUser();
			$location.path('login').replace();
		}

		$scope.toggleMealBuddies = function() {
			if ($scope.mapClass == 'col-sm-12') {
				$scope.hideMealBuddies = false;
				$scope.mapClass = 'col-sm-9';
			}
			else {
				$scope.hideMealBuddies = true;
				$scope.mapClass = 'col-sm-12';
			}

		}
}]);