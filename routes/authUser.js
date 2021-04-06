const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { InvalidCredentialError, DuplicateUserError } = require('../errors');

const AuthUserRouter = Router();

AuthUserRouter.get('/', (req, res) => {
	res.status(200).json({
		message: 'Authorized user router',
	});
});

/* Password update
	Method: PATCH
	Route: /password
	request: {
		oldPassword,
		newPassword
	}
*/
AuthUserRouter.patch('/updatepassword', async (req, res) => {
	try {
		const {
			user: { email },
			body: { oldPassword, newPassword },
		} = req;

		const currentUser = await User.findOne({ email }).exec();
		const passwordIsValid = bcrypt.compareSync(
			oldPassword,
			currentUser.password
		);

		if (!passwordIsValid)
			throw new InvalidCredentialError('Incorrect Password');

		// Change the password in the User object
		const newHashedPassword = bcrypt.hashSync(newPassword, 12);

		currentUser.password = newHashedPassword;
		currentUser.updatedAt = new Date();
		await currentUser.save();

		res.status(200).json({
			message: 'Password updated',
		});
	} catch (error) {
		if (error instanceof InvalidCredentialError) {
			res.status(401).json({
				error: error.message,
			});
		} else {
			res.status(500).json({
				error: 'Unable to update password',
			});
		}
	}
});

/* Update email
	Method: PATCH
	route: /updateemail
	request: {
		newEmail,
		password
	}
*/
AuthUserRouter.patch('/updateemail', async (req, res) => {
	try {
		const {
			user: { email },
			body: { password, newEmail },
		} = req;

		const duplicateEmail = await User.findOne({ email: newEmail }).exec();
		if (duplicateEmail !== null)
			throw new DuplicateUserError(
				'There is already an account with that email'
			);

		const currentUser = await User.findOne({ email }).exec();
		const passwordIsValid = bcrypt.compareSync(
			password,
			currentUser.password
		);

		if (!passwordIsValid)
			throw new InvalidCredentialError('Incorrect Password');

		currentUser.email = newEmail;
		currentUser.updatedAt = new Date();
		await currentUser.save();

		res.status(200).json({
			message: 'Email updated',
		});
	} catch (error) {
		if (
			error instanceof InvalidCredentialError ||
			error instanceof DuplicateUserError
		) {
			res.status(401).json({
				error: error.message,
			});
		} else {
			res.status(500).json({
				message: 'Unable to update email',
			});
		}
	}
});

module.exports = AuthUserRouter;
