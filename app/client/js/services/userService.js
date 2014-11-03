//To use this service, make sure you're adding 'userService' to a controller, like so:
//	app.controller('mealsController', ['$scope', '$resource', 'userService', function ($scope, $resource, userService)
//	and then, make sure that the controller uses: var User = $resource('/api/users');
//This service will provide anything necessary when interacting with the backend for users. Adding, deleting, adding meal buddies, etc.

app.factory('userService', ['$http', function($http, $resource) {
	var user = '/api/users';
	var userBuddies = '/api/users/buddies';
	var deleteBuddies = '/api/users/buddies/delete';
	var facebookLogin = '/api/users/facebook';
	var googleLogin = '/api/users/google';

	var userService = {};

	// Gets all the users from the backend, no filtering. Can parse through them in results.
	userService.getAllUsers = function() {
		return $http.get(user);
	};

	// Gets a user from the backend with the specific ID.
	userService.getUserWithID = function(key) {
		return $http.get(user + '?key=' + key);
	};

	// Creates a new user and adds it onto the backend. Name can be null (which is an anonymous user)
	userService.addNewUser = function(name, facebookID, googleID, ageRange, description, profession) {
		var userKey = generateUniqueKey();
		var request = { 'key':userKey, 'name':name, 'facebookID':facebookID, 'googleID':googleID, 'ageRange':ageRange, 'description':description, 'profession':profession, 'mealBuddies':[] };
		var res =  $http.post(user, request);
		res.success(function(result) {
			if (result != 'error') {
				localStorage.user = angular.toJson(result);
			} else {
				userService.addNewUser(name, ageRange, description, profession);
			}
		});
		return res;
	};

	userService.addIDToUser = function(service, id, name) {
		var user = angular.fromJson(localStorage.user);
		if (service == 'fb') {
			userService.updateUser(user.key, name, id, null, user.ageRange, user.description, user.profession, user.mealBuddies);
		}
		else if (service == 'gg') {
			userService.updateUser(user.key, name, null, id, user.ageRange, user.description, user.profession, user.mealBuddies);
		}
	};

	// Empty method. Will be used for updating a user's information.
	userService.updateUser = function(userKey, name, facebookID, googleID, ageRange, description, profession, mealBuddies) {
		var request = { 'key':userKey, 'name':name, 'facebookID':facebookID, 'googleID':googleID, 'ageRange':ageRange, 'description':description, 'profession':profession, 'mealBuddies':mealBuddies };
		return $http.put(user, request);
	};

	// Empty method. Will be used to delete a user from the database. Not sure if this is needed.
	userService.deleteUser = function(userID) {

	};

	userService.findByFacebook = function(facebookID){
		return $http.get(facebookLogin + '?facebookID=' + facebookID);
	};

	userService.findByGoogle = function(googleID){
		return $http.get(googleLogin + '?googleID=' + googleID);
	};

	//Adds new meal buddy for a user. Three states:
	//- If it's just a 5 letter string, they are confirmed meal buddies
	//- If it's a 5 letter string preceded by a '?', that means someone else is waiting for this user's confirmation
	//- If it's a 5 letter string preceded by a '!', that means this user is waiting for someone else to confirm
	//- If it's a 5 letter string preceded by a '+', that signifies a suggested friend
	//- If it's a 5 letter string preceded by a '*', that signifies an ignored person
	//This probably needs to be cleaned up.
	userService.addMealBuddy = function(buddyKey) {
		var buddyKeyString = buddyKey.replace(/[*]|[+]/g,'');
		userService.getUserWithID(buddyKeyString).success(function(res) {
			if (res.length > 0) {
				//gets this user's meal buddies as an array
				$http.get(userBuddies + '?key=' + angular.fromJson(localStorage.user).key).success(function(results) {
					//check array results to see if meal buddies contains the buddy key
					var alreadyAdded = false;
					var buddyPending = '';
					for (buddy of results) {
						var keyString = buddy.key.replace(/[!]|[?]|[+]|[*]/g,'');

						//here we do a check to see if this buddy is already in this user's mealBuddies
						if (keyString == buddyKeyString) {
							alreadyAdded = true;
							if (buddy.key.substring(0,1) == '?') {
								buddyPending = '?' + keyString;
							} else if (buddy.key.substring(0,1) == '+') {
								if (buddyKey.substring(0,1) != '+') {
									buddyPending = '+' + keyString;
								}
							}
						}
					}
					if (!alreadyAdded) {
						//the buddy cannot already be added when we're putting them into a user's suggested friends list
						if (buddyKey.substring(0,1) == '+') {
							var request = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': '+'+buddyKeyString };
							$http.put(userBuddies, request);
							var buddyRequest = { 'userKey': buddyKeyString, 'buddyKey': '+'+angular.fromJson(localStorage.user).key };
							$http.put(userBuddies, buddyRequest);
						} else {
							var request = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': '!'+buddyKeyString };
							$http.put(userBuddies, request);
							var buddyRequest = { 'userKey': buddyKeyString, 'buddyKey': '?'+angular.fromJson(localStorage.user).key };
							$http.put(userBuddies, buddyRequest);
						}
					}
					else {
						if (buddyPending.length > 0) {
							if (buddyPending.substring(0,1) == '?') {
								userService.confirmMealBuddy(buddyPending);
							}
							//in this instance, the user added a suggested buddy
							else if (buddyPending.substring(0,1) == '+') {
								//first remove the + and whatnot
								var deleteRequest = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': '+'+buddyKeyString };
								$http.put(deleteBuddies, deleteRequest);
								var buddyDeleteRequest = { 'userKey': buddyKeyString, 'buddyKey': '+'+angular.fromJson(localStorage.user).key };
								$http.put(deleteBuddies, buddyDeleteRequest);

								//then add the actual user
								var request = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': '!'+buddyKeyString };
								$http.put(userBuddies, request);
								var buddyRequest = { 'userKey': buddyKeyString, 'buddyKey': '?'+angular.fromJson(localStorage.user).key };
								$http.put(userBuddies, buddyRequest);
							}
						} else {
							//the buddy must be already in a user's suggested friends list to be ignored
							//this has not been tested yet.
							if (buddyKey.substring(0,1) == '*') {
								var request = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': '*'+buddyKeyString };
								$http.put(userBuddies, request);
								console.log('ignore this user');
							}
							else {
								console.log('already added');
							}
						}
					}
				})
			}
			else {
				console.log('no such user for this buddy');
			}
		});
	};

	// Returns an array of meal buddies. Empty array if no meal buddies exist.
	userService.getMealBuddies = function() {
		return $http.get(userBuddies + '?key=' + angular.fromJson(localStorage.user).key);
	};

	// Confirms a meal buddy that has a pending request to the user.
	userService.confirmMealBuddy = function(buddyKey) {
		$http.get(userBuddies + '?key=' + angular.fromJson(localStorage.user).key).success(function(results) {
			//check array results to see if meal buddies contains the buddy key with a '?'
			var requestPending = false;
			for (buddy of results) {
				var keyString = '?'+ buddyKey;
				if (keyString == buddy.key) {
					requestPending = true;
				}
			}
			if (requestPending) {
				var deleteRequest = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': '?'+buddyKey };
				$http.put(deleteBuddies, deleteRequest);
				var buddyDeleteRequest = { 'userKey': buddyKey, 'buddyKey': '!'+angular.fromJson(localStorage.user).key };
				$http.put(deleteBuddies, buddyDeleteRequest);

				var request = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': buddyKey };
				$http.put(userBuddies, request);
				var buddyRequest = { 'userKey': buddyKey, 'buddyKey': angular.fromJson(localStorage.user).key };
				$http.put(userBuddies, buddyRequest);
			}
			else {
				console.log('user does not have a pending request');
			}
		})
	};

	// Deletes or rejects a meal buddy. Up to client, if you're rejecting a request, pass in 'true' to reject.
	userService.deleteMealBuddy = function(buddyKey, reject) {
		//reject or delete
		$http.get(userBuddies + '?key=' + angular.fromJson(localStorage.user).key).success(function(results) {
			if (reject) {
				var deleteRequest = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': '?'+buddyKey };
				$http.put(deleteBuddies, deleteRequest);
				var buddyDeleteRequest = { 'userKey': buddyKey, 'buddyKey': '!'+angular.fromJson(localStorage.user).key };
				$http.put(deleteBuddies, buddyDeleteRequest);
			} 
			else {				//delete a user already a friend
				var deleteRequest = { 'userKey': angular.fromJson(localStorage.user).key, 'buddyKey': buddyKey };
				$http.put(deleteBuddies, deleteRequest);
				var buddyDeleteRequest = { 'userKey': buddyKey, 'buddyKey': angular.fromJson(localStorage.user).key };
				$http.put(deleteBuddies, buddyDeleteRequest);
			}
		})
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
		sessionStorage.name = null;
		sessionStorage.facebookID = null;
		sessionStorage.googleID = null;
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
