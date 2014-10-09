app.controller('loginController', ['$scope', '$resource', 'userService', 
	function ($scope, $resource, userService) {
		var User = $resource('/api/users');

		$scope.submitUserData = function() {
			var bdate = new Date(Number($scope.year), getMonthFromString($scope.month), Number($scope.day), 0, 0, 0, 0);
			userService.addNewUser(null, bdate, $scope.description, $scope.occupation);
		}

		getMonthFromString = function(month) {
			return new Date(Date.parse(month +" 1, 2012")).getMonth()
		}

		$scope.isUserLoggedIn = function() {
			if (userService.isUserLoggedIn()) {
				var str = "User is logged in with birthdate " + angular.fromJson(sessionStorage.user).birthDate;
				return str;
			} else {
				return "User is not logged in";
			}
		}
}]);