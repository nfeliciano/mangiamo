app.controller('loginController', ['$scope', '$resource', 
	function ($scope, $resource) {
		$scope.dates = []
		$scope.hideStartEating = false
		$scope.hideUserInfo = true

		$scope.submitUserData = function() {
			$scope.dates.push({ month: $scope.month,  
								day: $scope.day, 
								year: $scope.year,
								occupation: $scope.occupation,
								description: $scope.description});
		}

		$scope.switchDivs = function() {
			$scope.hideStartEating = !$scope.hideStartEating
			$scope.hideUserInfo = !$scope.hideUserInfo
		}
}]);