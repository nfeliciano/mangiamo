// Allows for redirects
app.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});

app.controller('loginController', ['$scope', '$resource', '$location', 'userService',
	function ($scope, $resource, $location, userService) {
		var User = $resource('/api/users');
		$scope.dates = [];
		$scope.hideStartEating = false;
		$scope.hideUserInfo = true;

		$scope.submitUserData = function() {
			if (userService.isUserLoggedIn()) {
				$location.path('/index');
			}
			else {
				var bdate = new Date(Number($scope.year), getMonthFromString($scope.month), Number($scope.day), 0, 0, 0, 0);
				userService.addNewUser(null, bdate, $scope.description, $scope.occupation);
			}
		}

		getMonthFromString = function(month) {
			return new Date(Date.parse(month +" 1, 2012")).getMonth()
		}

		$scope.isUserLoggedIn = function() {
			if (userService.isUserLoggedIn()) {
				var str = "User is logged in with birthdate " + angular.fromJson(localStorage.user).birthDate;
				return str;
			} 
			else {
				return "User is not logged in";
			}
		}

		$scope.switchDivs = function() {
			$scope.hideStartEating = !$scope.hideStartEating
			$scope.hideUserInfo = !$scope.hideUserInfo
		}
}]);