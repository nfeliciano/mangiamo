//To use this service, make sure you're adding 'mealService' to a controller, like so:
//	app.controller('mealsController', ['$scope', '$resource', 'mealService', function ($scope, $resource, mealService)
//	and then, make sure that the controller uses: var Meal = $resource('/api/meals');
//This service will provide anything necessary when interacting with the backend for meals. Viewing meals, adding meals, committing to meals, etc.

app.factory('mealService', ['$http', function($http) {
	var meal = '/api/meals';
	var people = '/api/meals/people';

	var mealService = {};

	// Gets ALL the meals from the database with no filtering as an array
	mealService.getAllMeals = function() {
		return $http.get(meal);
	};

	// Returns an array of the people 
	mealService.getPeopleFromMeal = function(placeID) {
		return $http.get(people + '?placeID=' + placeID);
	};

	// Gets all meals from the backend with the specific place ID.
	mealService.getMealsAtPlaceID =  function(placeID) {
		return $http.get(meal + '?placeID=' + placeID);
	};

	// 
	mealService.addUserToMeal = function(placeID, ID) {
		var request = {"placeID":placeID, "ID":ID};
		return $http.put(meal, request);
	};

	// Adds a new meal to the database with the key placeID-time
	mealService.addNewMeal = function(placeID, numPeople, time, people, active) {
		var request = {"key":placeID + "-" + time, "time":time, "numPeople":numPeople, "placeID":placeID, "people":people, "active":active};
		return $http.post(meal, request);
	}

	return mealService;
}]);