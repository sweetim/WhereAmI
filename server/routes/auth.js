var user = require('../model/user2.js');

var mongoose = require('mongoose');
var User2 = mongoose.model('User2');

exports.login = function(req, res) {
	var login = {};
	login.userName = req.body.userName;
	login.password = req.body.password;

	//res.send(login);

	var test = new User2({
		password: 'hello'
	});

	res.send(test.id);
};

exports.register = function(req, res) {
	//Need to sanitazie input
	if (req.body.password.localeCompare(req.body.password2) == 0) {
		var newUser = new User2({
			userName: req.body.userName,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password
		});

		console.log(newUser.hashPassword);

		newUser.save(function(err, user) {
			if(!err)  {
				res.json({
					status: true,
					tokenID: 1,
					err: null
				});
			} else {
				res.json({
					status: false,
					tokenID: null,
					err: err
				});
			}
		});
	} else {
		res.send('password faileed');
	}
};	
