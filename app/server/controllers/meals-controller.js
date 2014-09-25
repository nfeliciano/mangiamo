//change this to 'meal' when you can work on the client
var Meetup = require('../models/meal');

module.exports.create = function (req,res) {
	// console.log(req.body);
	var meetup = new Meetup(req.body);
	meetup.save(function (err, result) {
		//sends result back to client
		res.json(result);
	});
}

module.exports.list = function (req,res) {
	//change to 'meal' when you can work on client
	Meetup.find({}, function (err, results) {
		res.json(results);
	});
}