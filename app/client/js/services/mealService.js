//To use this service, make sure you're adding 'mealService' to a controller, like so:
//	app.controller('mealsController', ['$scope', 'mealService', function ($scope, mealService)
//This service will provide anything necessary when interacting with the backend for meals. Viewing meals, adding meals, committing to meals, etc.

angular.module('linksupp').factory('mealService', ['$http', function($http) {
	var mealUpdate = '/api/meals/update';
	var mealCreate = '/api/meals/create';
	var mealGet = '/api/meals/get';
	var people = '/api/meals/people';
	var delMeal = '/api/meals/delete';

	var mealService = {};

	// Gets ALL the meals from the database with no filtering as an array
	mealService.getAllMeals = function() {
		return $http.post(mealGet, { });
	}

	mealService.getMealDetails = function(mealKey) {
		var request = { 'key' : mealKey };
		return $http.post(mealGet, request);
	}

	// Returns an array of the people
	mealService.getPeopleFromMeal = function(mealKey) {
		var request = { 'key' : mealKey };
		return $http.post(people, request);
	}

	// Gets all meals from the backend with the specific place ID.
	mealService.getMealsAtPlaceID =  function(placeID) {
		var request = { 'placeID' : placeID };
		return $http.post(mealGet, request);
	}

	//
	mealService.addUserToMeal = function(mealKey, ID) {
		var request = {"key":mealKey, "ID":ID};
		return $http.put(mealUpdate, request);
	}

	mealService.deleteUserFromMeal = function(mealKey, ID) {
		var request = {"key":mealKey, "ID":ID};
		return $http.put(people, request);
	}

	// Adds a new meal to the database with the key placeID-time
	mealService.addNewMeal = function(placeID, numPeople, lat, lng, time, people, active) {
		var request = {"key":placeID + "-" + time, "time":time, "numPeople":numPeople, "lat":lat, "lng":lng, "placeID":placeID, "people":people, "active":active};
		return $http.post(mealCreate, request);
	}

	mealService.deleteMeal = function(mealKey) {
		var request = { "key":mealKey };
		return $http.put(delMeal, request);
	}

	return mealService;
}]);
