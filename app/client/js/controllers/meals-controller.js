app.controller('mealsController', ['$scope', '$resource', 'userService', function ($scope, $resource, userService) {

	var Meal = $resource('/api/meals');

	$scope.meals = [
	
	]
	
	Meal.query(function (results) {
		$scope.meals = results;
		console.log(userService.getAllUsers());
	});

	$scope.createMeal = function() {
		//for now, this will not work. this is because a 'meal' needs a bunch of details, e.g. place ID, time, etc. 
		//and especially a unique key to actually push
		var meal = new Meal();
		meal.$save(function(result) {
			$scope.meals.push(result);
			$scope.mealName = "";
		});
	}
}])