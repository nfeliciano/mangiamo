var mongoose = require('mongoose'), Schema = mongoose.Schema;

var MealSchema = new Schema({
	key: { type: "string", unique: true },
	placeID: String,
	numPeople: Number,
	time: Date,
	people: [{ id: String }],
	active: { type: Boolean, default: true }
});

//Model is named 'Meal'
module.exports = mongoose.model('Meal', MealSchema);