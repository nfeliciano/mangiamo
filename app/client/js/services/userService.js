//To use this service, make sure you're adding 'userService' to a controller, like so:
//	app.controller('mealsController', ['$scope', '$resource', 'userService', function ($scope, $resource, userService)
//	and then, make sure that the controller uses: var User = $resource('/api/users');
//This service will provide anything necessary when interacting with the backend for users. Adding, deleting, adding meal buddies, etc.

app.factory('userService', ['$http', function($http, $resource) {
	var user = '/api/users';
	var userBuddies = '/api/users/buddies';
	var facebookLogin = '/api/users/facebook';
	var userMeals = '/api/users/meals';
	var userDeleteMeals = '/api/users/deleteMeals';

	//the new stuff
	var userRequest = '/api/users/buddies/request';
	var userConfirm = '/api/users/buddies/confirm';
	var userSuggest = '/api/users/buddies/suggest';
	var userNoSuggest = '/api/users/buddies/suggest/stop';
	var userRemove = '/api/users/buddies/remove';
	var userIgnore = '/api/users/buddies/ignore';

	var userService = {};

	// Gets all the users from the backend, no filtering. Can parse through them in results.
	userService.getAllUsers = function() {
		return $http.get(user);
	}

	// Gets a user from the backend with the specific ID.
	userService.getUserWithID = function(key) {
		return $http.get(user + '?key=' + key);
	}

	userService.addMealToUser = function(mealKey, userKey) {
		var request = { "key" : userKey, "mealkey" : mealKey };
		return $http.put(userMeals, request);
	}

	userService.deleteMealFromUser = function(mealKey, key) {
		var request = { "key" : key, "mealkey" : mealKey };
		return $http.put(userDeleteMeals, request);
	}

	// Creates a new user and adds it onto the backend. Name can be null (which is an anonymous user)
	userService.addNewUser = function(name, facebookID, ageRange, description, profession, counter) {
		var userKey = generateUniqueKey();
		var request = { 'key':userKey, 'name':name, 'facebookID':facebookID, 'ageRange':ageRange, 'description':description, 'profession':profession, 'mealBuddies':null };
		var res =  $http.post(user, request);
		if (counter++ == 10) {
			alert("The Database is currently down.  Please try again later.");
			return;
		}
		res.success(function(result) {
			if (result != 'error') {
				return result;
			} else {
				userService.addNewUser(name, facebookID, ageRange, description, profession, counter);
			}
		});
		return res;
	}

	// Empty method. Will be used for updating a user's information.
	userService.updateUser = function(userKey, name, facebookID, ageRange, description, profession, mealBuddies) {
		var request = { 'key':userKey, 'name':name, 'facebookID':facebookID, 'ageRange':ageRange, 'description':description, 'profession':profession, 'mealBuddies':mealBuddies };
		return $http.put(user, request);
	}

	// Empty method. Will be used to delete a user from the database. Not sure if this is needed.
	userService.deleteUser = function(userID) {

	}

	userService.findByFacebook = function(facebookID){
		return $http.get(facebookLogin + '?facebookID=' + facebookID);
	}

	userService.addMealBuddy = function(buddyKey, mealBuddies, userKey) {
		//check if buddy is already a buddy
		return userService.getUserWithID(buddyKey).success(function(data2) {
			if (data2.length == 0) {
				return $http.get('');
			}
			if (isKeyInArray(mealBuddies.accepted, buddyKey) ||
				isKeyInArray(mealBuddies.requested, buddyKey)) {
				return $http.get('');
			}

			//check if user is already being added by buddy
			if (isKeyInArray(mealBuddies.pending, buddyKey)) {
				var request = { 'userKey': userKey, 'buddyKey': buddyKey };
				return $http.put(userConfirm, request);
			}
			else {
				var request = { 'userKey': userKey, 'buddyKey': buddyKey };
				return $http.put(userRequest, request);
			}
		});
	}

	// Returns an array of meal buddies. Empty array if no meal buddies exist.
	userService.getMealBuddies = function(userKey) {
		return $http.get(userBuddies + '?key=' + userKey);
	}

	// Confirms a meal buddy that has a pending request to the user.
	userService.confirmMealBuddy = function(buddyKey, userKey) {
		var request = { 'userKey': userKey, 'buddyKey': buddyKey };
		return $http.put(userConfirm, request);
	}

	// Deletes or rejects a meal buddy. Up to client
	userService.deleteMealBuddy = function(buddyKey, userKey) {
		var request = { 'userKey': userKey, 'buddyKey': buddyKey };
		return $http.put(userRemove, request);
	}

	userService.suggestMealBuddy = function(buddyKey, mealBuddies, userKey) {
		var accepted = mealBuddies.accepted;
		var suggested = mealBuddies.suggested;
		if (isKeyInArray(mealBuddies.accepted, buddyKey) ||
			isKeyInArray(mealBuddies.suggested, buddyKey) ||
			isKeyInArray(mealBuddies.requested, buddyKey) ||
			isKeyInArray(mealBuddies.pending, buddyKey)) {
			return $http.get('');
		}
		else {
			var request = { 'userKey': userKey, 'buddyKey': buddyKey };
			return $http.put(userSuggest, request);
		}
	}

	userService.contactDevs = function(message, email) {
		var request = { 'message' : message, 'email' : email };
		console.log(request);
		$http.post('/contact', request);
	}

	generateUniqueKey = function() {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}

	isKeyInArray = function(array, key) {
		var filtered = array.filter(function(object) {
			return (object.key == key);
		});
		if (filtered.length > 0) {
			return true;
		}
		else {
			return false;
		}
	}

	return userService;

}]);
