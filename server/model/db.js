var mongoose = require('mongoose');

var dbURI = "mongodb://localhost:27017/whereami";

mongoose.connect(dbURI);

var userSchema = new mongoose.Schema({
	name: String,
	email: { type: String, unique:true },
	createdOn: { type: Date, default: Date.now },
	modifiedOn: Date,
	lastLogin: Date
});

var projectSchema = new mongoose.Schema({
	projectName: String,
	createdOn: { type:Date, default: Date.now},
	modifiedOn: Date,
	createdBy: String,
	contributors: String,
	tasks: String
});

var gpsSchema = new mongoose.Schema({
	user: String,
	timestamp: Number,
	location: {
		test: String,
		coordinates: [Number, Number]
	}
});

mongoose.model('User', userSchema);
mongoose.model('Project', projectSchema);
mongoose.model('GPSData', gpsSchema);


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


