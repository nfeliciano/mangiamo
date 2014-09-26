//change this to 'meal' when you can work on the client
var Meal = require('../models/meal');

module.exports.create = function (req,res) {
	// console.log(req.body);
	var meal = new Meal(req.body);
	meal.save(function (err, result) {
		//sends result back to client
		res.json(result);
	});
}

module.exports.list = function (req,res) {
	Meal.find({}, function (err, results) {
		res.json(results);
	});
}