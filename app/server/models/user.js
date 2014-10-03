var mongoose = require('mongoose'), Schema = mongoose.Schema;

var UserSchema = new Schema({
	key: { type: "string", unique: true },
	name: String,
	birthDate: Date,
	description: String,
	profession: String,
	mealBuddies: Array
});

//Model is named 'User'
module.exports = mongoose.model('User', UserSchema);