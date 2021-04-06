const { Router } = require('express');
const { User } = require('../models');

const AuthUserRouter = Router();

AuthUserRouter.get('/', (req, res) => {
	res.status(200).json({
		message: 'Authorized user router',
	});
});

module.exports = AuthUserRouter;
