const { Schema, model, Mongoose } = require('mongoose');

const WishlistSchema = new Schema({
	name: String,
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = model('Wishlist', WishlistSchema);
