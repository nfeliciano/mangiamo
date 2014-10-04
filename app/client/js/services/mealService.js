app.factory('mealService', ['$resource', function($resource) {
	var Meal = $resource('/api/meals');

	return {
		getAllMeals: function() {
			return Meal.query(function(results) {});
		},

		addNewMeal: function(placeID, numPeople, time, people, active) {
			var meal = new Meal();
			meal.key = placeID + "-" + time;
			meal.time = time; //make sure time is limited to year-month-day-hh-mm
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