//To use this service, make sure you're adding 'userService' to a controller, like so:
//	app.controller('mealsController', ['$scope', '$resource', 'userService', function ($scope, $resource, userService)
//This service will provide anything necessary when interacting with the backend for users. Adding, deleting, adding meal buddies, etc.

app.factory('userService', ['$resource', function($resource) {
	var User = $resource('/api/users');

	return {
		//Gets all the users from the backend. Can parse through them in results.
		getAllUsers: function() {
			return User.query(function (results) {});
		},

		//Creates a new user and adds it onto the backend using $save.
		addNewUser: function(name, birthDate, description, profession) {
			//fill these in with actual values later; this won't work more than once because of the key
			var user = new User();
			user.name = name;
			user.birthDate = birthDate;
			user.description = description;
			user.profession = profession;
			user.mealBuddies = [];
			user.$save(function(result) {
				console.log(result);
			});
			return null;
		},

		updateUser: function(user, name, birthDate, description, profession) {
			
		},

		deleteUser: function(userID) {

		}
	};
}]);
