app.controller('indexController', ['$scope', '$resource', '$window', 'userService',
	function ($scope, $resource, $window, userService) {

		// This allows the initial redirect when they come to the 
		// page based on whether or not they are logged in
		$scope.init = function() {
			if (userService.isUserLoggedIn()) {
				$window.location.href="http://localhost:3000/#/main";
			}
			else {
				$window.location.href="http://localhost:3000/#/login";
			}
		}
		$scope.init();
}]);