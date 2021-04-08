require('dotenv').config();

const app = require('./app');
const mongoose = require('mongoose');

const startServer = async (port) => {
	await mongoose.connect(process.env.MONGO_APP_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	app.listen(port, () => {
		console.log(`[server]: Listening on port ${port}`);
	});
};

startServer(5000);
