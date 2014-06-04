var User2Model = require('../model/user2').User2Model;

exports.login = function(req, res) {
	var login = {};
	login.userName = req.body.userName;
	login.password = req.body.password;

	res.send(User2Model.encryptPassword(login.password));
};

exports.register = function(req, res) {
	var user = {};
	user.userName = req.body.userName;
	user.firstname = req.body.firstName;
	user.lastname = req.body.lastName;
	user.email = req.body.email;	
	user.password = req.body.password;
	user.password2 = req.body.password2;
	
	if (user.password.localeCompare(user.password2) == 0) {

	};

	res.send(req.body);
};