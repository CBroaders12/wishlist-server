const { Router } = require('express');
const { Wishlist } = require('../models');

const WishlistRouter = Router();

WishlistRouter.post('/new', async (req, res) => {
	try {
		const {
			user: { _id: userId },
			body: { name },
		} = req;

		const newList = new Wishlist({ name, owner: userId });
		await newList.save();

		res.sendStatus(201);
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

WishlistRouter.get('/', async (req, res) => {
	try {
		const { _id: userId } = req.user;

		const wishlists = await Wishlist.find({ owner: userId });

		res.status(200).json({
			wishlists,
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

module.exports = WishlistRouter;
