//To use this service, make sure you're adding 'mealService' to a controller, like so:
//	app.controller('mealsController', ['$scope', 'mealService', function ($scope, mealService)
//This service will provide anything necessary when interacting with the backend for meals. Viewing meals, adding meals, committing to meals, etc.

angular.module('linksupp').factory('mealService', ['$http', function($http) {
	var meal = '/api/meals';
	var people = '/api/meals/people';
	var delMeal = '/api/meals/delete';

	var mealService = {};

	// Gets ALL the meals from the database with no filtering as an array
	mealService.getAllMeals = function() {
		return $http.get(meal);
	}

	mealService.getMealDetails = function(mealKey) {
		return $http.get(meal + '?key=' + mealKey);
	}

	// Returns an array of the people
	mealService.getPeopleFromMeal = function(mealKey) {
		return $http.get(people + '?key=' + mealKey);
	}

	// Gets all meals from the backend with the specific place ID.
	mealService.getMealsAtPlaceID =  function(placeID) {
		return $http.get(meal + '?placeID=' + placeID);
	}

	//
	mealService.addUserToMeal = function(mealKey, ID) {
		var request = {"key":mealKey, "ID":ID};
		return $http.put(meal, request);
	}

	mealService.deleteUserFromMeal = function(mealKey, ID) {
		var request = {"key":mealKey, "ID":ID};
		return $http.put(people, request);
	}

	// Adds a new meal to the database with the key placeID-time
	mealService.addNewMeal = function(placeID, numPeople, time, people, active) {
		var request = {"key":placeID + "-" + time, "time":time, "numPeople":numPeople, "placeID":placeID, "people":people, "active":active};
		return $http.post(meal, request);
	}

	mealService.deleteMeal = function(mealKey) {
		var request = { "key":mealKey };
		return $http.put(delMeal, request);
	}

	return mealService;
}]);
