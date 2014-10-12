app.controller('indexController', ['$scope', '$resource', 'mealService', 
	function ($scope, $resource, mealService) {
		var Meal = $resource('/api/meals');
		
}]);