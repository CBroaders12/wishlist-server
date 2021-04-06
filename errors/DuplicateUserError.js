class DuplicateUserError extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = DuplicateUserError;
