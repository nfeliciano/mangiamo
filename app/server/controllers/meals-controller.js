var Meal = require('../models/meal');

// Creates a new meal
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

// Adds a user to a meal (when the user commits) and increments numPeople
module.exports.update = function (req,res) {
	var query = { key: req.body.key };
	var update = { people: { "key" : req.body.ID } };
	var increment = { numPeople : 1 };

	Meal.findOneAndUpdate(query, { $push : update, $inc: increment }, function(err, results) {
		res.json(results);
	});
}


// Deletes a user from a meal
module.exports.deletePeople = function (req,res) {
	var query = { key: req.body.key };
	var update = { people: { "key" : req.body.ID } };
	var decrement = { numPeople : -1 };

	Meal.findOneAndUpdate(query, { $pull : update, $inc: decrement }, function(err, results) {
		res.json(results);
	});
}

// Returns an array of the people attending a meal
module.exports.getPeople = function (req,res) {
	if (req.query.key != null) {
		Meal.find({key:req.query.key}, function(err, results) {
			if(results.length == 0){
				res.json(results);
			}
			else {
				res.json(results[0].people);
			}
		});
	}
}

// Returns an array of meals. If we're not seeking a specific placeID, it returns all meals. 
// If we pass in a placeID, it returns all meals in that location
// If we pass in a key, it returns the only meal in that key
module.exports.list = function (req,res) {
	if (req.query.placeID != null) {
		Meal.find({placeID:req.query.placeID}, function(err, results) {
			res.json(results);
		});
	}
	else if (req.query.key != null) {
		Meal.findOne({key:req.query.key}, function(err, results) {
			res.json(results);
		});
	}
	else {
		Meal.find({}, function (err, results) {
			res.json(results);
		});
	}
}