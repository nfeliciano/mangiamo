var User = require('../models/user');

module.exports.create = function (req,res) {
	var user = new User(req.body);
	user.save(function (err, result) {
		//sends result back to client
		res.json(result);
	});
	// console.log(req.body);
}

module.exports.list = function (req,res) {
	
}