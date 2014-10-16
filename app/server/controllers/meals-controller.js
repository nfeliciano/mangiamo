var Meal = require('../models/meal');

module.exports.create = function (req,res) {
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
		}
		else {
			return console.log(err);
		}
	});
}

module.exports.update = function (req,res) { // Some issue of adding to the array, maybe the way the model was declared. Changed it.

	var query = { key: req.query.key };
	var str = req.query.ID.replace(/['"]+/g, '')
	var update = { people: { "id" : str } };
	var increment = { numPeople : 1 };

	Meal.findOneAndUpdate(query, { $push : update, $inc: increment }, function(err, results) {
	});
}

module.exports.list = function (req,res) {
	if (req.query.placeID != null) {
		Meal.find({placeID:req.query.placeID}, function(err, results) {
			res.json(results);
		});
	}
	else {
		Meal.find({}, function (err, results) {
			res.json(results);
		});
	}
}