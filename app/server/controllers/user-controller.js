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
			return res.json(result);
		} else
		{
			return res.format({ 
				text:function() {
					res.send('error');
				}
			});
		}
	});
}

// Returns an array of users. Either all users, or users with a specific userID.
module.exports.list = function (req,res) {
	if(req.query._id != null){
		User.find({_id:req.query._id}, function (err, results) {
			res.json(results);
		});
	}
	else {
		User.find({}, function (err, results) {
			res.json(results);
		});
	}
}