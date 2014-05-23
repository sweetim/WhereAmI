var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.index = function(req, res) {
	
};

exports.create = function(req, res) {
	res.send('here');
};

exports.doCreate = function(req, res) {
	User.create({
		name: req.body.fullName,
		email: req.body.email,
		modifiedOn: Date.now(),
		lastLogin: Date.now()
	}, function(err, user) {
		if (err) {
			console.log(err);
			if (err.code === 11000) {
				res.redirect('/#/login');
			}
		} else {
			console.log('User created ' + user);
		}
	});
};