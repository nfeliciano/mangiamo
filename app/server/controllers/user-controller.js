var User = require('../models/user');

// Creates a new user and adds it to the database
module.exports.create = function (req,res) {
	var user = new User({
		name: req.body.name,
		key: req.body.key,
		birthDate: req.body.birthDate,
		description: req.body.description,
		profession: req.body.profession,
		mealBuddies: req.body.mealBuddies,
	});
	
	user.save(function (err, result) {
		if (!err) {
			res.json(result);
		} else
		{
			res.format({ 
				text:function() {
					res.send('error');
				}
			});
		}
	});
}

// Returns an array of meal buddies. Empty array if no meal buddies.
module.exports.getMealBuddies = function (req,res) {
	if (req.query.key != null) {
		User.find({ key:req.query.key}, function(err, results) {
			if (results.length == 0) {
				res.json(results);
			}
			else {
				res.json(results[0].mealBuddies);
			}
		});
	}
}

// Adds a new meal buddy to the meal buddies array. Or accepts a pending request.
module.exports.addNewBuddy = function (req,res) {
	var query = { key: req.body.userKey };
	var update = { mealBuddies: { "key" : req.body.buddyKey } };

	User.findOneAndUpdate(query, { $push : update }, function(err, results) {
		res.json(results);
	});
}

// Deletes a meal buddy or rejects a pending request.
module.exports.deleteBuddy = function (req,res) {
	var query = { key: req.body.userKey };
	var update = { mealBuddies: { "key" : req.body.buddyKey } };

	User.findOneAndUpdate(query, { $pull : update }, function(err, results) {
		res.json(results);
	});
}

// Returns an array of users. Either all users, or users with a specific userID.
module.exports.list = function (req,res) {
	if(req.query.key != null){
		User.find({key:req.query.key}, function (err, results) {
			res.json(results);
		});
	}
	else {
		User.find({}, function (err, results) {
			res.json(results);
		});
	}
}