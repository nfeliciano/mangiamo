var mongoose = require('mongoose');

//Model is named 'Meal'
module.exports = mongoose.model('Meal', {
	key: { type: "string", unique: true },
	placeID: String,
	numPeople: Number,
	time: Date,
	people: Array,
	active: { type: Boolean, default: true }
});