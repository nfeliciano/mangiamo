//To use this service, make sure you're adding 'mealService' to a controller, like so:
//	app.controller('mealsController', ['$scope', '$resource', 'mealService', function ($scope, $resource, mealService)
//	and then, make sure that the controller uses: var Meal = $resource('/api/meals');
//This service will provide anything necessary when interacting with the backend for meals. Viewing meals, adding meals, committing to meals, etc.

app.factory('mealService', ['$resource', function($resource) {
	var Meal = $resource('/api/meals');
	var mealUpdate = $resource('/api/meals/update')

	return {
		//mealService.getAllMeals()
		//Gets ALL the meals from the database with no filtering
		getAllMeals: function() {
			return Meal.query(function(results) {});
		},

		//mealService.getMealsAtPlaceID(str)
		//Gets all meals from the backend with the specific place ID.
		getMealsAtPlaceID: function(placeID) {
			return Meal.query({ "placeID":placeID}, function(results) {
				return results;
			});
		},

		getUsersAtMealByPlaceID: function(placeID) {
			var SortedArray = [];
			Meal.query({ "placeID":placeID}, function(results) {
				var Count = 0;
				for (e in results){
					Count++;
				}
				for (i=0; i<Count; i++) {
					SortedArray.push(results[i.toString()]);
				}
				console.log(SortedArray[0]);
				return SortedArray[0];
			});
			console.log(SortedArray);
			return SortedArray;
		},

		addUserToMeal: function(key, ID) {
			return mealUpdate.query({ "key":key, "ID": ID }, function(results) {
				return results;
			});
		},

		//mealService.addNewMeal(str, int, date(), [], bool)
		//Adds a new meal to the database with the key placeID-time
		addNewMeal: function(placeID, numPeople, time, people, active) {
			var meal = new Meal();
			meal.key = placeID + "-" + time;
			meal.time = time; 					//make sure time is limited to year-month-day-hh-mm
			meal.numPeople = numPeople;
			meal.placeID = placeID;
			meal.people = [];
			meal.active = true;
			meal.$save(function(result) {
				console.log(result);
			})
			return null;
		}
	};
}]);