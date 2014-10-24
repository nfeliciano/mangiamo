var mongoose = require('mongoose'), Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	key: { type: "string", unique: true },
	birthDate: Date,
	description: String,
	profession: String,
	mealBuddies: Array
});

//Model is named 'User'
var User = mongoose.model('User', UserSchema);
module.exports = User;