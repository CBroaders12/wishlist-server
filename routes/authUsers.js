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

/* Update password
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
			user,
			body: { oldPassword, newPassword },
		} = req;

		const currentUser = await User.findById(user._id).exec();
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
			user,
			body: { password, newEmail },
		} = req;

		// Validate user and check that email is not their current email
		const currentUser = await User.findById(user._id).exec();
		const passwordIsValid = bcrypt.compareSync(
			password,
			currentUser.password
		);

		if (!passwordIsValid)
			throw new InvalidCredentialError('Incorrect Password');

		if (currentUser.email === newEmail)
			throw new DuplicateUserError(
				'New email should be different from current email'
			);

		// Check for other users with that email
		const duplicateEmail = await User.findOne({ email: newEmail }).exec();
		if (duplicateEmail !== null)
			throw new DuplicateUserError(
				'There is already an account with that email'
			);

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

AuthUserRouter.delete('/deleteaccount', async (req, res) => {
	try {
		const {
			user,
			body: { password },
		} = req;

		// Validate user's password before deleting account
		const userToDelete = await User.findById(user._id).exec();

		// This shouldn't happen if the middleware works properly
		if (userToDelete === null) throw new Error('User does not exist');

		const passwordIsValid = bcrypt.compareSync(
			password,
			userToDelete.password
		);

		if (!passwordIsValid)
			throw new InvalidCredentialError('Incorrect password');

		await User.deleteOne({ _id: user._id });

		res.status(204);
	} catch (error) {
		if (error.message === 'User does not exist') {
			res.status(400).json({
				error: error.message,
			});
		}
		res.status(500).json({
			error: 'Unable to delete user',
		});
	}
});

module.exports = AuthUserRouter;
