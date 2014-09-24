var mongoose = require('mongoose');

//Model is named 'Meetup'
module.exports = mongoose.model('Meetup', {
	name: String
});