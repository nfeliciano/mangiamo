var mongoose = require('mongoose'), Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	key: { type: "string", unique: true },
	facebookID: String,
	googleID: String,
	ageRange: String,
	description: String,
	profession: String,
	mealBuddies: [{ key: String }]
});

//Model is named 'User'
var User = mongoose.model('User', UserSchema);
module.exports = User;