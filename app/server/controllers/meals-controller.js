//change this to 'meal' when you can work on the client
var Meal = require('../models/meal');

module.exports.create = function (req,res) {
	// console.log(req.body);
	var meal = new Meal({
		key: req.body.key,
		placeID: req.body.placeID,
		time: req.body.time,
		numPeople: req.body.numPeople,
		people: req.body.people,
		active: req.body.active,
	});
	meal.save(function (err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return console.log(err);
		}
	});
}

module.exports.list = function (req,res) {
	Meal.find({}, function (err, results) {
		res.json(results);
	});
}