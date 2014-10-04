app.controller('mealsController', ['$scope', '$resource', 'mealService', function ($scope, $resource, mealService) {

	var Meal = $resource('/api/meals');

	$scope.meals = [
	
	]
	
	Meal.query(function (results) {
		$scope.meals = results;
	});

	$scope.createMeal = function() {
		//for now, this will not work. this is because a 'meal' needs a bunch of details, e.g. place ID, time, etc. 
		//and especially a unique key to actually push
		// var meal = new Meal();
		// meal.$save(function(result) {
		// 	$scope.meals.push(result);
		// 	$scope.mealName = "";
		// });
		mealService.addNewMeal("ChIJs8FQZ3V0j1QRYwgN-UfyxVQ", 1, new Date(), [], true);
	}
}])