var mongoose = require('mongoose');
var Project = mongoose.model('Project');

exports.create = function(req, res) {
	res.send('project');
};

exports.doCreate = function(req, res) {
	Project.create({
		projectName: req.body.projectName,
		modifiedOn: Date.now(),
		createdBy: req.body.createdBy,
		contributors: req.body.contributors,
		tasks: req.body.tasks
	}, function(err, user) {
		if (err) {
			console.log(err);
			if (err.code === 11000) {
				res.redirect('/#/login');
			}			
		} else {
			res.json(user);
		}
	});
};

exports.displayInfo = function(req, res) {
	Project.find({
		'contributors': req.params.id
	}).exec(function(err, project) {
		if (!err) {
			res.json(project);
		}
	});
};