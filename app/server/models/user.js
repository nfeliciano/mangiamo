var mongoose = require('mongoose'), Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	key: { type: "string", unique: true },
	facebookID: String,
	googleID: String,
	ageRange: String,
	description: String,
	profession: String,
	mealBuddies: {
		accepted: [{ key: { type: "string", unique: true }, }],
		pending: [{ key: { type: "string", unique: true }, }],
		requested: [{ key: { type: "string", unique: true }, }],
		suggested: [{ key: { type: "string", unique: true }, }],
		stopSuggesting: [{ key: { type: "string", unique: true }, }],
		ignored: [{ key: { type: "string", unique: true }, }]
	}
});

//Model is named 'User'
var User = mongoose.model('User', UserSchema);
module.exports = User;