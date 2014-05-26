var mongoose = require('mongoose');
var GPSData = mongoose.model('GPSData');

exports.getData = function(req, res) {
	GPSData.find().sort({
		timestamp: -1
	}).limit(1).exec(function(err, data) {
		if (err) {
			res.json({
				result: true,
				err: err,
				data: data
			});
		} else {
			res.json({
				result: true,
				err: err,
				data: data
			});
		}
	});
};

exports.addData = function(req, res) {
	var gpsData = {
		user: req.body.user,
		timestamp: req.body.timestamp,
		location: {
			'type': "Point",
			'coordinates': [req.body.long, req.body.lat]
		}
	};

	GPSData.create(gpsData, function(err, data) {
		if (err) {
			res.json({
				timestamp: data.timestamp,
				result: false,
				err: err
			});
		} else {
			res.json({
				timestamp: data.timestamp,
				result: true,
				err: err
			});
		}
	});
};

exports.getDataId = function(req, res) {
	var id = req.params.id;

	GPSData.find({
		user: id
	}, function(err, data) {
		if (err) {
			res.json({
				result: false,
				err: err,
				data: data
			});
		} else {
			res.json({
				result: true,
				err: err,
				data: data
			});
		}
	});
};