const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	email: String,
	name: String,
	password: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = model('User', UserSchema);
