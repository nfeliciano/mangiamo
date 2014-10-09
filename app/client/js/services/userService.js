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
			return User.query(function (results) {
				// console.log(results);
			});
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
				console.log(result._id);
			});
			return null;
		},

		//Empty method. Used for updating a user's information.
		updateUser: function(user, name, birthDate, description, profession) {
			
		},

		//Empty method. Used to delete a user from the database. Not sure if this is needed.
		deleteUser: function(userID) {

		},

		isUserLoggedIn: function() {
			var userID = sessionStorage.userID.replace(/"/g,"");
			// if (userID.length > 0) {
			// 	var users = User.query(function (results) {});
			// 	console.log(users);
			// 	//this is extremely hacky, but is a temporary solution. traverses through all the users and then returns one that matches the stored id
			// 	for (var i = 0; i < users.length; i++) {
			// 		user = users[i];
			// 		console.log(user);
			// 		if (user._id === userID) {
			// 			// console.log(user._id);
			// 			return user;
			// 		}
			// 	}
			// 	return null; 
			// }
		}
	};
}]);
