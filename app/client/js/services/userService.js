app.factory('userService', ['$resource', function($resource) {
	var User = $resource('/api/users');

	
	return {
		getAllUsers: function() {
			return User.query(function (results) {});
		}
	};
}]);


//example user: 
// var user = new User();
// 		user.key = 2;
// 		user.name = $scope.mealName;
// 		user.birthDate = new Date();
// 		user.description = "Outgoing";
// 		user.profession = "Adventurer";
// 		user.mealBuddies = [];