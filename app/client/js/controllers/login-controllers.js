app.controller('loginControllers', ['$scope', '$resource', 
	function ($scope, $resource) {
		$scope.dates = []


		$scope.submitUserData = function() {
			$scope.dates.push({ month: $scope.month,  
								day: $scope.day, 
								year: $scope.year,
								occupation: $scope.occupation,
								description: $scope.description});
		}
}]);