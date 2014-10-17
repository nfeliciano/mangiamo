app.controller('loginController', ['$scope', '$resource', '$location', 'userService', 'mealService',
	function ($scope, $resource, $location, userService, mealService) {
		var User = $resource('/api/users');
		$scope.dates = [];
		$scope.hideStartEating = false;
		$scope.hideUserInfo = true;

		// This function provides a redirect
		$scope.submitUserData = function() {
			var bdate = new Date(Number($scope.year), getMonthFromString($scope.month), Number($scope.day), 0, 0, 0, 0);
			userService.addNewUser(null, bdate, $scope.description, $scope.occupation);		
			$location.path('main').replace();
			// mealService.addNewMeal("ChIJs8FQZ3V0j1QRYwgN-UfyxVQ", 0, new Date(), [], true).success(function(data) {
			// 	console.log(data);
			// }).error(function(error) {
			// 	console.log(error);
			// });
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

		// This redirects back to main if the user tries to navigate here and they are already logged in
		$scope.init = function() {
			if (userService.isUserLoggedIn()) {
				$location.path('main').replace();
			}
		}
		$scope.init();
}]);