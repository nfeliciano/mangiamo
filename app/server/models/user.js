var mongoose = require('mongoose');

//Model is named 'User'
module.exports = mongoose.model('User', {
	key: { type: "string", unique: true },
	name: String,
	birthDate: Date,
	description: String,
	profession: String,
	mealBuddies: Array
});

//example user: 
// var user = new User();
// 		user.key = 2;
// 		user.name = $scope.meetupName;
// 		user.birthDate = new Date();
// 		user.description = "Outgoing";
// 		user.profession = "Adventurer";
// 		user.mealBuddies = [];
// 		user.$save(function(result) {