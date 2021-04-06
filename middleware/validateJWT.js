const jwt = require('jsonwebtoken');
const { User } = require('../models');

class InvalidCredentialError extends Error {
	constructor(message) {
		super(message);
	}
}

const validateJWTMiddleware = async (req, res, next) => {
	if (req.method === 'OPTIONS') next();

	try {
		const { authorization } = req.headers;
		const payload = jwt.verify(authorization, process.env.JWT_SECRET);

		const currentUser = await User.findOne({ email: payload.email }).exec();

		if (currentUser === null) throw new InvalidCredentialError();

		res.user = currentUser;
		next();
	} catch (error) {
		if (
			error instanceof InvalidCredentialError ||
			error instanceof jwt.JsonWebTokenError
		) {
			res.status(401).json({
				error: 'Not Allowed',
			});
		} else {
			res.status(500).json({
				error: 'Unable to verify token',
			});
		}
	}
};

module.exports = validateJWTMiddleware;
