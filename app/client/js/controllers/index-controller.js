app.controller('indexController', ['$scope', '$location', 'userService',
	function ($scope, $location, userService) {
		$scope.showFriendsSidebar = false;
		$scope.showMealBuddiesButton = false;
		$scope.showingLoginButton = true;
		$scope.showingLogoutButton = false;
		$scope.showMealInfo = false;
		$scope.showMealSidebar = true;
		$scope.mealBuddyRequests = [];
		$scope.mealBuddies = [];
		$scope.mealBuddySuggestions = [];

		$scope.UID = '';

		$scope.authenticated = false;

		$scope.toggleMealInfo = function(show) {
			$scope.showMealInfo = show;
		}

		$scope.toggleMealSidebar = function(show) {
			$scope.showMealSidebar = show;
		}

		$scope.showFriendsSidebar2 = function(show){
			$scope.showFriendsSidebar = show;
		}

		$scope.toggleMealBuddies = function() {
			$scope.showFriendsSidebar = !$scope.showFriendsSidebar;
			if($scope.showFriendsSidebar) {
				$scope.showMealSidebar = false;
			}
			else {
				$scope.showMealSidebar = true;				
			}
			$scope.populateMealBuddies();
		}

		// Call this to show or hide the supp buddies (friends) button
		$scope.showSuppBuddiesButton = function() {
			$scope.showMealBuddiesButton = true;
		}

		$scope.hideSuppBuddiesButton = function() {
			$scope.showMealBuddiesButton = false;
		}

		// Call this to show or hide the login button
		$scope.showLoginButton = function() {
			$scope.showingLoginButton = true;
		}

		$scope.hideLoginButton = function() {
			$scope.showingLoginButton = false;
		}

		// Call this to show or hide the login button
		$scope.showLogoutButton = function() {
			$scope.showingLogoutButton = true;
		}

		$scope.hideLogoutButton = function() {
			$scope.showingLogoutButton = false;
		}

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

			$scope.authenticated = false;
			$scope.showingLoginButton = true;
			$scope.showingLogoutButton = false;
		}

		// Populate MealBuddies, and MealBuddyRequests to be displayed in the Meal Buddies SideBar
		$scope.populateMealBuddies = function() {
			$scope.UID = angular.fromJson(localStorage.user).key;
			// Grab the users MealBuddies from the database
			userService.getMealBuddies().success( function(data1) {
				$scope.mealBuddyRequests = [];
				$scope.mealBuddies = [];
				$scope.mealBuddySuggestions = [];
				for (mealBuddy of data1.accepted) {
					userService.getUserWithID(mealBuddy.key).success(function(data2) {
						$scope.mealBuddies.push(data2);
					});
				}
				for (mealBuddy of data1.pending) {
					userService.getUserWithID(mealBuddy.key).success(function(data2) {
						$scope.mealBuddyRequests.push(data2);
					});
				}
				for (mealBuddy of data1.suggested) {
					userService.getUserWithID(mealBuddy.key).success(function(data2) {
						$scope.mealBuddySuggestions.push(data2);
					});
				}
			});
		}
}]);