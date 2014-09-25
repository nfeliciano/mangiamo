var mongoose = require('mongoose');

//Model is named 'Meal'
module.exports = mongoose.model('Meal', {
	name: String
});