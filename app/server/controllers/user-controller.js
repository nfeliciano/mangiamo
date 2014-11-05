var User = require('../models/user');

// Creates a new user and adds it to the database
module.exports.create = function (req,res) {
	var user = new User({
		key: req.body.key,
		facebookID: req.body.facebookID,
		googleID: req.body.googleID,
		name: req.body.name,
		ageRange: req.body.ageRange,
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

module.exports.update = function(req,res) {
	var query = { key: req.body.key };
	var update = { 	name: req.body.name,
					facebookID: req.body.facebookID, 
					googleID: req.body.googleID,
					ageRange: req.body.ageRange,
					description: req.body.description,
					profession: req.body.profession,
					mealBuddies: req.body.mealBuddies,
				};
	User.findOneAndUpdate(query, { $set : update }, function(err, results) {
		res.json(results);
	});
}

module.exports.findByFacebook = function (req,res) {
	User.find({facebookID:req.query.facebookID}, function (err, results) {
		res.json(results);
	});
}

module.exports.findByGoogle = function (req,res) {
	User.find({googleID:req.query.googleID}, function (err, results) {
		res.json(results);
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

// We will now need some more methods
// Cases: adds a buddy by key, adds a suggested buddy
module.exports.requestBuddy = function(req,res) {
	// remove from suggested, ignored
	// add onto requested
	// add onto pending for the requested user
	var query = { key: req.body.userKey };
	var buddyQuery = { key: req.body.buddyKey };
	var removeSuggested = { 'mealBuddies.suggested' : buddyQuery };
	var removeIgnored = { 'mealBuddies.ignored' : buddyQuery };
	var removeStopSuggesting = { 'mealBuddies.stopSuggesting' : buddyQuery };

	User.findOneAndUpdate(query, { $pull : removeSuggested }, function(err, results) {});
	User.findOneAndUpdate(query, { $pull : removeIgnored }, function(err, results) {});
	User.findOneAndUpdate(query, { $pull : removeStopSuggesting }, function(err, results) {});

	var update = { 'mealBuddies.requested' : buddyQuery };
	User.findOneAndUpdate(query, { $push : update }, function(err, results) {});

	var updateBuddy = { 'mealBuddies.pending' : query };
	User.findOneAndUpdate(buddyQuery, { $push : updateBuddy }, function(err, results) {
		res.json(results);
	});
}

// Cases: confirms a buddy request
module.exports.confirmBuddy = function(req,res) {
	// remove from pending
	// remove from other user's requested
	// add onto accepted
	var query = { key: req.body.userKey };
	var buddyQuery = { key: req.body.buddyKey };

	var removePending = { 'mealBuddies.pending' : buddyQuery };
	var removeBuddyRequested = { 'mealBuddies.requested' : query };
	User.findOneAndUpdate(query, { $pull : removePending }, function(err, results) {});
	User.findOneAndUpdate(buddyQuery, { $pull : removeBuddyRequested }, function(err, results) {});

	var addBuddy = { 'mealBuddies.accepted' : buddyQuery };
	var buddyAdd = { 'mealBuddies.accepted' : query };
	User.findOneAndUpdate(query, { $push : addBuddy }, function(err, results) {});
	User.findOneAndUpdate(buddyQuery, { $push : buddyAdd }, function(err, results) {
		res.json(results);
	});
}

// Cases: pulls friends from Facebook
module.exports.suggestBuddy = function(req,res) {
	// add onto suggested
	var query = { key: req.body.userKey };
	var buddyQuery = { key: req.body.buddyKey };
	var update = { 'mealBuddies.suggested' : buddyQuery };
	User.findOneAndUpdate(query, { $push : update }, function(err, results) {});
}

// Cases: user no longer wants to see this person suggested
module.exports.stopSuggesting = function(req,res) {
	// remove from suggested
	// add to stop suggested
	var query = { key: req.body.userKey };
	var buddyQuery = { key: req.body.buddyKey };

	var removeSuggested = { 'mealBuddies.suggested' : buddyQuery };
	User.findOneAndUpdate(query, { $pull : removeSuggested }, function(err, results) {});

	var stopSuggesting = { 'mealBuddies.stopSuggesting' : buddyQuery };
	User.findOneAndUpdate(query, { $push : stopSuggesting }, function(err, results) {});
}

// Cases: rejects a buddy request, deletes a buddy
module.exports.removeBuddy = function(req,res) {
	// remove from all lists except ignored
	// remove from buddy's accepted list
	var query = { key: req.body.userKey };
	var buddyQuery = { key: req.body.buddyKey };

	var removeBuddy = { 'mealBuddies.accepted' : buddyQuery };
	var removeSuggested = { 'mealBuddies.suggested' : buddyQuery };
	var removeStopSuggesting = { 'mealBuddies.stopSuggesting' : buddyQuery };
	var removeRequested = { 'mealBuddies.requested' : buddyQuery };
	var removePending = { 'mealBuddies.pending' : buddyQuery };

	User.findOneAndUpdate(query, { $pull : removeBuddy }, function(err, results) {});
	User.findOneAndUpdate(query, { $pull : removeSuggested }, function(err, results) {});
	User.findOneAndUpdate(query, { $pull : removeStopSuggesting }, function(err, results) {});
	User.findOneAndUpdate(query, { $pull : removeRequested }, function(err, results) {});
	User.findOneAndUpdate(query, { $pull : removePending }, function(err, results) {});

	var buddyRemove = { 'mealBuddies.accepted' : query };
	User.findOneAndUpdate(buddyQuery, { $pull : buddyRemove }, function(err, results) {});
}

// Ignores a user who has added them
module.exports.ignoreBuddy = function(req,res) {
	// remove from all lists
	// add to ignored
}