const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	email: String,
	username: String,
	password: String,
	dateJoined: { type: Date, default: Date.now },
});

module.exports = model('User', UserSchema);
