app.controller('indexController', ['$scope', '$location', 'userService',
	function ($scope, $location, userService) {
		$scope.mapClass = 'col-sm-12';
		$scope.hideMealBuddies = true;

		$scope.mealBuddyRequests = [];

		$scope.UID = '';

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

		$scope.populateMealBuddies = function() {
			$scope.UID = angular.fromJson(localStorage.user).key;
			userService.getMealBuddies().success( function(data1) {
				for (mealBuddy of data1) {
					if (mealBuddy.key.substring(0, 1) == '!') {
						// Pending Request, do nothing
					}
					else if (mealBuddy.key.substring(0, 1) == '?') {
						userService.getUserWithID(mealBuddy.key.substring(1, 5)).success( function(data2) {
							console.log(data2);
						});
						
					}

				}
			});
		}

		$scope.toggleMealBuddies = function() {
			$scope.populateMealBuddies();
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