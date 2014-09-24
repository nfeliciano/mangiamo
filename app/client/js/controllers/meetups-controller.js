app.controller('meetupsController', ['$scope', '$resource', function ($scope, $resource) {

	var Meetup = $resource('/api/meetups');

	$scope.meetups = [
		// { name: "Mangiamo Group" },
		// { name: "CSCW Class" }
	]
	
	Meetup.query(function (results) {
		$scope.meetups = results;
	});

	$scope.createMeetup = function() {
		var meetup = new Meetup();
		meetup.name = $scope.meetupName;
		meetup.$save(function(result) {
			$scope.meetups.push(result);
			$scope.meetupName = "";
		});
	}
}])