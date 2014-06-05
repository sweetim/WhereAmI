var mongoose = require('mongoose');
var crypto = require('crypto');

var User2Schema = new mongoose.Schema({
	userName: {
		type: String,
		unique: true,
		required: true
	},
	hashPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

User2Schema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

User2Schema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword;
};

User2Schema.virtual('password')
	.set(function(password) {
		this._plainPassword = password;
		this.salt = crypto.randomBytes(128).toString('base64');
		this.hashPassword = this.encryptPassword(password);
	})
	.get(function() {
		return this._plainPassword;
	});

User2Schema.virtual('userId')
	.get(function() {
		return this.id;
	});

mongoose.model('User2', User2Schema);

