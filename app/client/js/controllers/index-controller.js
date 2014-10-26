app.controller('indexController', ['$scope', '$location', 'userService',
	function ($scope, $location, userService) {
		$scope.mapClass = 'col-sm-12';
		$scope.hideMealBuddies = true;

		$scope.mealBuddyRequests = [];
		$scope.mealBuddies = [];

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

		// Populate MealBuddies, and MealBuddyRequests to be displayed in the Meal Buddies SideBar
		$scope.populateMealBuddies = function() {
			$scope.UID = angular.fromJson(localStorage.user).key;
			$scope.mealBuddyRequests = [];
			$scope.mealBuddies = [];
			// Grab the users MealBuddies from the database
			userService.getMealBuddies().success( function(data1) {
				// Sort through MealBuddies: requests vs actual Meal Buddies
				for (mealBuddy of data1) {
					if (mealBuddy.key.substring(0, 1) == '!') {  // User has sent request to someone else
						// Pending Request, do nothing
					}
					else if (mealBuddy.key.substring(0, 1) == '?') {  // User has a request from someone else
						userService.getUserWithID(mealBuddy.key.substring(1, 6)).success(function(data2) {
							$scope.mealBuddyRequests.push(data2);
						});
					}
					else {  // Current Meal Buddies
						userService.getUserWithID(mealBuddy.key).success(function(data2) {
							$scope.mealBuddies.push(data2);
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