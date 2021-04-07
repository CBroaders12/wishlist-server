const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { User } = require('../models');
const { DuplicateUserError, InvalidCredentialError } = require('../errors');

const UserRouter = Router();

// Test route
UserRouter.get('/', (req, res) => {
	res.sendStatus(200);
});

/* Registration Router
    Method: POST
    Route: /register
    request: {
        email,
        username,
        password
    }
*/
UserRouter.post('/register', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password)
			throw new InvalidCredentialError('Provide username and password');

		// Check for existing users with the same email
		const existingUsers = await User.find({ email }).exec();
		if (existingUsers.length !== 0) {
			throw new DuplicateUserError(
				'A user with that email already exists'
			);
		}

		// Hash the password, create the new user, and save them to the database
		const hashedPassword = bcrypt.hashSync(password, 12);
		const newUser = new User({ email, password: hashedPassword });
		await newUser.save();

		// Create a webtoken for the user
		const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
			expiresIn: '12h',
		});

		res.status(201).json({
			message: 'User registered',
			token,
			user: {
				email,
			},
		});
	} catch (error) {
		if (
			error instanceof DuplicateUserError ||
			error instanceof InvalidCredentialError
		) {
			res.status(400).json({
				error: error.message,
			});
		} else {
			res.status(500).json({
				error: 'Unable to register user',
			});
		}
	}
});

/* Login Router
    Method: POST
    Route: /login
	request: {
		email,
		password
	}
*/
UserRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		const loginUser = await User.findOne({ email }).exec();

		const passwordIsValid = bcrypt.compareSync(
			password,
			loginUser.password
		);

		if (!passwordIsValid) {
			throw new InvalidCredentialError('Incorrect email or password');
		}

		const token = jwt.sign({ _id: loginUser._id }, process.env.JWT_SECRET, {
			expiresIn: '12h',
		});

		res.status(200).json({
			message: 'Login successful',
			token,
		});
	} catch (error) {
		if (error instanceof InvalidCredentialError) {
			res.status(403).json({
				error: error.message,
			});
		} else {
			res.status(500).json({
				error: 'Unable to login',
			});
		}
	}
});

module.exports = UserRouter;
