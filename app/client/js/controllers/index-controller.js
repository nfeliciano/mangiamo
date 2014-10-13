app.controller('indexController', ['$scope', '$resource', '$window', '$location', 'userService',
	function ($scope, $resource, $window, $location, userService) {

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
}]);