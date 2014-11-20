var mongoose = require('mongoose'), Schema = mongoose.Schema;

var MealSchema = new Schema({
	key: { type: "string", unique: true },
	placeID: String,
	numPeople: Number,
	lat: Number,
	lng: Number,
	time: Date,
	people: [{ key: String }],
	active: { type: Boolean, default: true }
});

//Model is named 'Meal'
module.exports = mongoose.model('Meal', MealSchema);