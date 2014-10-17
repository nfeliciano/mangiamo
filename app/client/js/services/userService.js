//To use this service, make sure you're adding 'userService' to a controller, like so:
//	app.controller('mealsController', ['$scope', '$resource', 'userService', function ($scope, $resource, userService)
//	and then, make sure that the controller uses: var User = $resource('/api/users');
//This service will provide anything necessary when interacting with the backend for users. Adding, deleting, adding meal buddies, etc.

app.factory('userService', ['$http', '$resource', function($http, $resource) {
	var User = '/api/users';

	var userService = {};

	//userService.getAllUsers()
	//Gets all the users from the backend, no filtering. Can parse through them in results.
	userService.getAllUsers = function() {
		return $http.get(User);
	};

	//userService.getUserWithID(str). Won't do anything for now.
	//Gets a user from the backend with the specific ID.
	userService.getUserWithID = function(userID) {
		return $http.get(User + '?_id=' + userID);
	};

	//Creates a new user and adds it onto the backend. Name can be null (which is an anonymous user)
	userService.addNewUser = function(name, birthDate, description, profession) {
		var request = {"name":name, "birthDate":birthDate, "description":description, "profession":profession, "mealBuddies":[]};
		var res =  $http.post(User, request);
		res.success(function(result){
			sessionStorage.userID = angular.toJson(result._id);
			localStorage.user = angular.toJson(result);
		})
		return res;
	};

	//Empty method. Used for updating a user's information.
	userService.updateUser = function(user, name, birthDate, description, profession) {
			
	};

	//Empty method. Used to delete a user from the database. Not sure if this is needed.
	userService.deleteUser = function(userID) {

	};

	//userService.isUserLoggedIn()
	//Returns true or false depending on whether a user is in local storage.
	userService.isUserLoggedIn = function() {
		if (localStorage.user != 'loggedout') {
			return true;
		} else {
			return false;
		}
	};

	//userService.logoutUser()
	//DOES NOT DEAUTHENTICATE FROM FACEBOOK OR GOOGLE YET, only removes the user from localStorage
	userService.logoutUser = function() {
		localStorage.user = 'loggedout';
	}

	return userService;

}]);
