//To use this service, make sure you're adding 'userService' to a controller, like so:
//	app.controller('mealsController', ['$scope', '$resource', 'userService', function ($scope, $resource, userService)
//	and then, make sure that the controller uses: var User = $resource('/api/users');
//This service will provide anything necessary when interacting with the backend for users. Adding, deleting, adding meal buddies, etc.

app.factory('userService', ['$resource', function($resource) {
	var User = $resource('/api/users');

	return {
		//userService.getAllUsers()
		//Gets all the users from the backend, no filtering. Can parse through them in results.
		getAllUsers: function() {
			return User.query(function(results) {
				return results;
			});
		},

		//userService.getUserWithID(str). Won't do anything for now.
		//Gets a user from the backend with the specific ID.
		getUserWithID: function(userID) {
			// return User.query({"_id":userID}, function(results) {
			// 	return results;
			// });
		},

		//userService.addNewUser(str, date(), str, str)
		//Creates a new user and adds it onto the backend using $save. Name can be null (which is an anonymous user)
		addNewUser: function(name, birthDate, description, profession) {
			var user = new User();
			user.name = name;
			user.birthDate = birthDate;
			user.description = description;
			user.profession = profession;
			user.mealBuddies = [];
			user.$save(function(result) {
				sessionStorage.userID = angular.toJson(result._id);
				localStorage.user = angular.toJson(result);
			});
			return null;
		},

		//Empty method. Used for updating a user's information.
		updateUser: function(user, name, birthDate, description, profession) {
			
		},

		//Empty method. Used to delete a user from the database. Not sure if this is needed.
		deleteUser: function(userID) {

		},

		//userService.isUserLoggedIn()
		//Returns true or false depending on whether a user is in local storage.
		isUserLoggedIn: function() {
			if (localStorage.user != 'loggedout') {
				return true;
			} else {
				return false;
			}
		},

		//userService.logoutUser()
		//DOES NOT DEAUTHENTICATE FROM FACEBOOK OR GOOGLE YET, only removes the user from localStorage
		logoutUser: function() {
			localStorage.user = 'loggedout';
		}
	};
}]);
