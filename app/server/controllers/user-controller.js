var User = require('../models/user');

module.exports.create = function (req,res) {
	var user = new User({
		name: req.body.name,
		birthDate: req.body.birthDate,
		description: req.body.description,
		profession: req.body.profession,
		mealBuddies: req.body.mealBuddies,
	});
	
	user.save(function (err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return console.log(err);
		}
	});
}

module.exports.list = function (req,res) {
	User.find({}, function (err, results) {
		res.json(results);
	});
}