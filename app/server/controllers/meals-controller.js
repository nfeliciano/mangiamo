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
	var query = { placeID: req.body.placeID };
	var update = { people: { "id" : req.body.ID } };
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