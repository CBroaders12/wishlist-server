const { Schema, model } = require('mongoose');

const GiftSchema = new Schema({
	name: String,
	link: String,
	inList: { type: Schema.Types.ObjectId, ref: 'Wishlist' },
	claimedBy: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = model('Gift', GiftSchema);
