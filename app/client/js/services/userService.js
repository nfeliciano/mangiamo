//To use this service, make sure you're adding 'userService' to a controller, like so:
//	app.controller('mealsController', ['$scope', '$resource', 'userService', function ($scope, $resource, userService)
//	and then, make sure that the controller uses: var User = $resource('/api/users');
//This service will provide anything necessary when interacting with the backend for users. Adding, deleting, adding meal buddies, etc.

app.factory('userService', ['$http', function($http, $resource) {
	var User = '/api/users';

	var userService = {};

	// Gets all the users from the backend, no filtering. Can parse through them in results.
	userService.getAllUsers = function() {
		return $http.get(User);
	};

	// Gets a user from the backend with the specific ID.
	userService.getUserWithID = function(userID) {
		return $http.get(User + '?_id=' + userID);
	};

	// Creates a new user and adds it onto the backend. Name can be null (which is an anonymous user)
	userService.addNewUser = function(name, birthDate, description, profession) {
		var userKey = generateUniqueKey();
		var request = { "name":name, "key":userKey, "birthDate":birthDate, "description":description, "profession":profession, "mealBuddies":[] };
		var res =  $http.post(User, request);
		res.success(function(result) {
			if (result != 'error') {
				sessionStorage.userID = angular.toJson(result._id);
				localStorage.user = angular.toJson(result);
			} else {
				userService.addNewUser(name, birthDate, description, profession);
			}
		});
		return res;
	};

	// Empty method. Will be used for updating a user's information.
	userService.updateUser = function(user, name, birthDate, description, profession) {
			
	};

	// Empty method. Will be used to delete a user from the database. Not sure if this is needed.
	userService.deleteUser = function(userID) {

	};

	userService.addMealBuddy = function() {

	};

	// Returns true or false depending on whether a user is in local storage.
	userService.isUserLoggedIn = function() {
		if (localStorage.user != 'loggedout') {
			return true;
		} else {
			return false;
		}
	};

	// Removes the user from localStorage
	userService.logoutUser = function() {
		localStorage.user = 'loggedout';
	}

	generateUniqueKey = function() {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}

	return userService;

}]);
