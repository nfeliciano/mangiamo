var mongoose = require('mongoose'), Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	key: { type: "string", unique: true },
	facebookID: String,
	ageRange: String,
	description: String,
	profession: String,
	mealsAttending: [ { key: { type: "string" } } ],
	mealBuddies: {
		accepted: [{ key: { type: "string" } }],
		pending: [{ key: { type: "string" } }],
		requested: [{ key: { type: "string" } }],
		suggested: [{ key: { type: "string" } }],
		stopSuggesting: [{ key: { type: "string" } }],
		ignored: [{ key: { type: "string" } }]
	}
});

//Model is named 'User'
var User = mongoose.model('User', UserSchema);
module.exports = User;