var mongoose = require('mongoose');

var dbURI = "mongodb://localhost:27017";

mongoose.connect(dbURI);
console.log(dbURI);

mongoose.connection.on('connected', function() {
	console.log('mongoose connected ' + dbURI);
});

mongoose.connection.on('error', function() {
	console.log('mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('mongoose disconnected');
});

process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected from app termination');
		process.exit(0);		
	});
});